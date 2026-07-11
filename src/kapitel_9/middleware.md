# Middleware och JWT-autentisering

Vi fortsätter med `portfolio-api`: besökare får läsa projekt, men bara en administratör får skapa, ändra och ta bort dem.

## Mål

Efter avsnittet kan du:

- förklara hur en request passerar Express middleware
- logga requests och samla felhantering på ett ställe
- registrera och logga in användare med hashade lösenord
- autentisera en JWT och auktorisera rollen `admin`
- hålla hemligheter utanför källkoden

## Förutsättningar

Du behöver projektet från [REST API](./rest-api.md), MongoDB-anslutningen från [MongoDB](./mongodb.md) och `"type": "module"` i `package.json`. Exemplen använder bara `import` och `export`.

## 1. Följ flödet

Middleware körs i den ordning den registreras:

```text
request
  -> express.json()
  -> logger
  -> route
  -> controller
  -> response

fel -> next(error) -> errorHandler
```

En middleware kan ändra `req` eller `res`, avsluta med ett svar, eller fortsätta med `next()`. Om den varken svarar eller anropar `next()` blir requesten hängande.

Skapa `src/middleware/logger.js`:

```javascript
export function logger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
}
```

`finish` körs när svaret är skickat och ger därför rätt statuskod och tid.

Skapa `src/middleware/errorHandler.js`:

```javascript
export function notFound(req, res) {
  res.status(404).json({ error: 'Resursen finns inte' });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  const status = error.status ?? 500;
  const message = status === 500 ? 'Ett serverfel uppstod' : error.message;
  res.status(status).json({ error: message });
}
```

Felhanteraren måste ha fyra parametrar, även om `next` inte används. Registrera allt i rätt ordning i `src/app.js`:

```javascript
import express from 'express';
import { logger } from './middleware/logger.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import projectsRouter from './routes/projects.js';

const app = express();

app.use(express.json());
app.use(logger);
app.use('/api/projects', projectsRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
```

I asynkrona controllers fångar du fel och anropar `next(error)`.

## 2. Installera autentisering

`bcryptjs` hashar lösenord utan native-kompilering. `jsonwebtoken` skapar och verifierar signerade tokens.

<!-- terminal -->
```console
$ npm install bcryptjs jsonwebtoken
added ... packages
```

### Kör nu i din riktiga terminal

```bash
npm install bcryptjs jsonwebtoken
```

Lägg en lång, slumpad hemlighet i `.env`, aldrig i kod eller versionshantering:

```dotenv
JWT_SECRET=byt-till-en-lang-slumpad-hemlighet
```

Applikationen bör vägra starta om `JWT_SECRET` saknas i produktion.

## 3. Skapa användarmodellen

Skapa `src/models/User.js`:

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
```

Modellen lagrar aldrig klartextlösenord. `select: false` minskar risken att hashvärdet råkar skickas i ett svar.

## 4. Registrera och logga in

Skapa `src/controllers/authController.js`:

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function createToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export async function register(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password || password.length < 10) {
      return res.status(400).json({ error: 'Giltig e-post och minst 10 tecken krävs' });
    }

    if (await User.exists({ email })) {
      return res.status(409).json({ error: 'E-postadressen används redan' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });
    res.status(201).json({ token: createToken(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const user = await User.findOne({ email }).select('+passwordHash');
    const valid = user && await bcrypt.compare(req.body.password ?? '', user.passwordHash);

    if (!valid) {
      return res.status(401).json({ error: 'Fel e-post eller lösenord' });
    }

    res.json({ token: createToken(user) });
  } catch (error) {
    next(error);
  }
}
```

Klienten får aldrig välja `role` vid registrering. Gör första administratören med ett kontrollerat seed-script eller direkt i databasen.

Koppla `register` och `login` till `POST /api/auth/register` respektive `POST /api/auth/login` i `src/routes/authRoutes.js`.

## 5. Autentisera och auktorisera

**Autentisering** frågar vem användaren är. **Auktorisation** frågar vad den användaren får göra.

Skapa `src/middleware/auth.js`:

```javascript
import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const [scheme, token] = (req.get('authorization') ?? '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Bearer-token krävs' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'Ogiltig eller utgången token' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Adminbehörighet krävs' });
  }
  next();
}
```

Skydda skrivning men håll läsning publik i `src/routes/projects.js`:

```javascript
import { Router } from 'express';
import * as projects from '../controllers/projectController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', projects.listProjects);
router.get('/:id', projects.getProject);
router.post('/', authenticate, requireAdmin, projects.createProject);
router.patch('/:id', authenticate, requireAdmin, projects.updateProject);
router.delete('/:id', authenticate, requireAdmin, projects.deleteProject);

export default router;
```

<!-- terminal -->
```console
$ curl http://localhost:3000/api/projects
[]
$ curl -X POST http://localhost:3000/api/projects -H 'Content-Type: application/json' -d '{"title":"API"}'
{"error":"Bearer-token krävs"}
```

### Kör nu i din riktiga terminal

Logga in, kopiera token och skicka `Authorization: Bearer DIN_TOKEN` när du provar en skyddad route.

## Säkerhetsgränser

Detta är en undervisningsgrund, inte ett komplett produktionssystem. Använd HTTPS, validera all input, begränsa loginförsök, rotera hemligheter och logga aldrig lösenord eller tokens. En JWT är signerad men normalt inte krypterad. Kort livslängd minskar skadan vid stöld, men riktig utloggning kräver exempelvis serverlagrad revokering eller en genomtänkt refresh-token-lösning. Kontrollera gärna aktuell roll i databasen för känsliga operationer; rollen i en redan utfärdad token kan annars vara inaktuell.

## Vanliga misstag

- Felhanteraren placeras före routes och fångar därför inget.
- `next()` glöms efter lyckad middleware.
- `JWT_SECRET` hårdkodas eller saknas.
- Klartextlösenord eller `passwordHash` skickas till klienten.
- `401` och `403` blandas ihop: saknad identitet respektive saknad behörighet.
- Alla routes skyddas av misstag, även publik `GET`.

## Checkpoint

- [ ] Loggern visar metod, URL, status och tid.
- [ ] Fel går via `next(error)` till en central felhanterare.
- [ ] Registrering sparar `passwordHash`, inte lösenord.
- [ ] Login returnerar en tidsbegränsad JWT.
- [ ] `GET` är publik; `POST`, `PATCH` och `DELETE` kräver admin.
- [ ] `JWT_SECRET` läses från miljön.

Fortsätt med [sessioner och cookies](./sessions.md) för ett alternativ till JWT, och testa sedan skyddet i [Testning med Jest](./testning.md).
