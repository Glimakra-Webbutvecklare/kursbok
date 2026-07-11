# Övningar: bygg ett portfolio-API steg för steg

I de här fyra övningarna bygger du vidare på samma projekt: `portfolio-api`.
När du är klar kan din portfolio visa projekt från MongoDB, medan en administratör
kan logga in och hantera innehållet. Varje övning utgår från checkpointen före.

All JavaScript-kod använder ES-moduler (`import` och `export`).

## Övning 1: Express, projektstruktur och health endpoint

### Mål

Skapa grunden till `portfolio-api`, starta en Express-server och kontrollera att
den svarar via en health endpoint.

### Din uppgift

1. Skapa projektet och initiera npm.
2. Installera `express`, `cors`, `helmet`, `morgan` och `dotenv`.
3. Installera `nodemon` som utvecklingsberoende.
4. Sätt `"type": "module"` i `package.json`.
5. Skapa `src/app.js` som konfigurerar Express utan att starta servern.
6. Skapa `src/server.js` som lyssnar på en port.
7. Lägg till `GET /api/health`.
8. Lägg till en JSON-baserad 404-hanterare för okända `/api`-adresser.
9. Lägg `PORT=3000` i `.env` och skapa även `.env.example`.

```bash
mkdir portfolio-api
cd portfolio-api
npm init -y
npm install express cors helmet morgan dotenv
npm install --save-dev nodemon
mkdir src
```

<details>
<summary>Lösningsförslag</summary>

Relevanta delar av `package.json`:

```json
{
  "name": "portfolio-api",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

`src/app.js`:

```javascript
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'portfolio-api',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpointen finns inte' });
});

export default app;
```

`src/server.js`:

```javascript
import 'dotenv/config';
import app from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`portfolio-api körs på http://localhost:${port}`);
});
```

`.env.example`:

```text
PORT=3000
```

</details>

Starta servern och prova den från en annan terminal:

```bash
npm run dev
curl -i http://localhost:3000/api/health
curl -i http://localhost:3000/api/saknas
```

### Checkpoint

- `GET /api/health` ger `200` och JSON med `status: "ok"`.
- En okänd `/api`-adress ger `404`.
- `app.js` anropar inte `listen`; det gör bara `server.js`.
- Projektet innehåller inga `require` eller `module.exports`.

**Förslag på Git-commit:** `feat: initialize portfolio API with health endpoint`

---

## Övning 2: Project CRUD med MongoDB

### Mål

Anslut API:et till MongoDB och bygg CRUD för de projekt som ska visas i
portfolion.

### Din uppgift

1. Installera `mongoose`.
2. Lägg `MONGODB_URI` i `.env` och ett ofarligt exempel i `.env.example`.
3. Skapa en databasfunktion som ansluter med `mongoose.connect`.
4. Skapa modellen `Project` med:
   - `title`: obligatorisk sträng, trim, max 100 tecken
   - `description`: obligatorisk sträng, max 1000 tecken
   - `technologies`: array av strängar
   - `imageUrl`, `repositoryUrl` och `liveUrl`: valfria strängar
   - `featured`: boolean med standardvärdet `false`
   - automatiska timestamps
5. Skapa routes för listning, hämtning, skapande, uppdatering och borttagning.
6. Returnera `404` när ett projekt inte finns.
7. Returnera `400` vid valideringsfel eller ett felaktigt MongoDB-id.
8. Starta servern först när databasanslutningen lyckats.

Föreslaget kontrakt:

| Metod | Endpoint | Resultat |
|---|---|---|
| `GET` | `/api/projects` | Alla projekt |
| `GET` | `/api/projects/:id` | Ett projekt |
| `POST` | `/api/projects` | Skapa projekt |
| `PATCH` | `/api/projects/:id` | Uppdatera projekt |
| `DELETE` | `/api/projects/:id` | Ta bort projekt |

```bash
npm install mongoose
mkdir -p src/config src/models src/routes src/middleware
```

<details>
<summary>Lösningsförslag</summary>

`src/models/Project.js`:

```javascript
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Titel krävs'],
      trim: true,
      maxlength: [100, 'Titeln får vara högst 100 tecken']
    },
    description: {
      type: String,
      required: [true, 'Beskrivning krävs'],
      trim: true,
      maxlength: [1000, 'Beskrivningen får vara högst 1000 tecken']
    },
    technologies: {
      type: [String],
      default: []
    },
    imageUrl: String,
    repositoryUrl: String,
    liveUrl: String,
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
```

`src/routes/projects.js`:

```javascript
import { Router } from 'express';
import Project from '../models/Project.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).location(`/api/projects/${project.id}`).json(project);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!project) return res.status(404).json({ error: 'Projektet finns inte' });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

export default router;
```

Implementera GET för ett id och DELETE med samma `try`/`catch`-mönster:
kontrollera resultatet, svara `404` när det är `null` och `204` efter lyckad
borttagning.

Montera routern före 404-hanteraren i `app.js`:

```javascript
import projectsRouter from './routes/projects.js';

app.use('/api/projects', projectsRouter);
```

Montera sist en error middleware som ger `400` för Mongoose-felen
`ValidationError` och `CastError`, annars loggar felet och ger ett generellt
`500`-svar.

Databasstart i `server.js`:

```javascript
import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const port = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`API körs på port ${port}`));
} catch (error) {
  console.error('Kunde inte ansluta till MongoDB', error);
  process.exit(1);
}
```

</details>

Prova CRUD. Spara id:t från POST-svaret:

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"Väderapp","description":"Visar prognoser","technologies":["React","Express"],"featured":true}'

curl http://localhost:3000/api/projects
curl http://localhost:3000/api/projects/PROJECT_ID

curl -X PATCH http://localhost:3000/api/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{"description":"Visar prognoser för valda städer"}'

curl -i -X DELETE http://localhost:3000/api/projects/PROJECT_ID
```

### Checkpoint

- Projekt överlever en omstart av servern.
- POST ger `201`, PATCH ger det uppdaterade dokumentet och DELETE ger `204`.
- Ett okänt men giltigt id ger `404`; ett trasigt id ger `400`.
- `GET /api/projects` är fortfarande publik.

**Förslag på Git-commit:** `feat: add MongoDB project CRUD`

---

## Övning 3: JWT-skydd för administratören

### Mål

Låt alla besökare läsa projekt, men kräv en giltig JWT för att skapa, ändra och
ta bort dem.

### Din uppgift

1. Installera `bcrypt` och `jsonwebtoken`.
2. Skapa en `Admin`-modell med unik e-post och hashat lösenord.
3. Skapa `POST /api/auth/login`.
4. Svara med samma generella felmeddelande för okänd e-post och fel lösenord.
5. Signera en kortlivad token med `JWT_SECRET`.
6. Skapa middleware som läser `Authorization: Bearer <token>`.
7. Skydda POST, PATCH och DELETE för projekt; behåll GET publika.
8. Skapa administratören med ett separat seed-skript, inte en publik
   registreringsendpoint.
9. Lägg aldrig lösenord, hash eller `JWT_SECRET` i API-svar eller Git.

Lägg exempelvärden utan riktiga hemligheter i `.env.example`:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=replace-with-a-long-random-secret
```

<details>
<summary>Lösningsförslag</summary>

`src/models/Admin.js`:

```javascript
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  }
});

adminSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model('Admin', adminSchema);
```

`src/routes/auth.js`:

```javascript
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+passwordHash');
    const valid = admin && await admin.verifyPassword(password);

    if (!valid) {
      return res.status(401).json({ error: 'Fel e-post eller lösenord' });
    }

    const token = jwt.sign(
      { sub: admin.id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;
```

`src/middleware/authenticate.js`:

```javascript
import jwt from 'jsonwebtoken';

export function authenticateAdmin(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Autentisering krävs' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Åtkomst nekad' });
    }
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Ogiltig eller utgången token' });
  }
}
```

Skydda skrivande routes:

```javascript
import { authenticateAdmin } from '../middleware/authenticate.js';

router.post('/', authenticateAdmin, async (req, res, next) => {
  // Samma create-kod som i övning 2.
});
router.patch('/:id', authenticateAdmin, updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);
```

I seed-skriptet: hasha `ADMIN_PASSWORD` med
`bcrypt.hash(process.env.ADMIN_PASSWORD, 12)` och använd `Admin.updateOne` med
`{ upsert: true }`. Läs e-post och lösenord från miljön.

</details>

Logga in och använd token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"byt-mig"}'

TOKEN="KLISTRA_IN_TOKEN"

curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Portfolio API","description":"API för mina projekt","technologies":["Node.js","MongoDB"]}'

curl -i -X DELETE http://localhost:3000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Checkpoint

- Publika GET-anrop fungerar utan token.
- Skrivande anrop utan token ger `401`.
- En giltig admin-token tillåter POST, PATCH och DELETE.
- En utgången eller manipulerad token avvisas.
- Det finns ingen publik endpoint för att skapa administratörer.

**Förslag på Git-commit:** `feat: protect project mutations with admin JWT`

---

## Övning 4: API-tester och anslutning till frontend

### Mål

Verifiera API-kontraktet med Jest och Supertest och låt din befintliga
`portfolio-site`, eller React-appen från kapitel 8, läsa projekten.

### Din uppgift

1. Installera Jest, Supertest och `mongodb-memory-server`.
2. Säkerställ att tester kan importera `app` utan att en port eller
   produktionsdatabas startas.
3. Testa health endpoint, publik projektlista och valideringsfel.
4. Testa att skrivning nekas utan token och tillåts med giltig admin-token.
5. Rensa testdatabasen mellan tester och stäng anslutningen efteråt.
6. Sätt frontendvariabeln `VITE_API_URL`.
7. Hämta och rendera projekten med `fetch`.
8. Lägg till laddnings- och feltillstånd.
9. Begränsa CORS till frontendens origin via en miljövariabel.

```bash
npm install --save-dev jest supertest mongodb-memory-server
```

<details>
<summary>Lösningsförslag</summary>

`package.json`:

```json
{
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand"
  },
  "jest": {
    "testEnvironment": "node"
  }
}
```

Representativa tester i `test/projects.test.js`:

```javascript
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import Project from '../src/models/Project.js';

let mongo;
process.env.JWT_SECRET = 'test-secret-that-is-not-used-in-production';

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  await Project.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('GET /api/health visar att tjänsten mår bra', async () => {
  const response = await request(app).get('/api/health').expect(200);
  expect(response.body.status).toBe('ok');
});

test('GET /api/projects är publik', async () => {
  await Project.create({ title: 'Test', description: 'Ett testprojekt' });
  const response = await request(app).get('/api/projects').expect(200);
  expect(response.body).toHaveLength(1);
});

test('POST /api/projects kräver token', async () => {
  await request(app)
    .post('/api/projects')
    .send({ title: 'Test', description: 'Ska nekas' })
    .expect(401);
});

test('admin kan skapa projekt', async () => {
  const token = jwt.sign(
    { sub: new mongoose.Types.ObjectId().toString(), role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  const response = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Test', description: 'Skapas i testdatabasen' })
    .expect(201);

  expect(response.body.title).toBe('Test');
});
```

En frontend-hjälpare i exempelvis `src/api/projects.js`:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;

export async function getProjects() {
  const response = await fetch(`${apiUrl}/api/projects`);
  if (!response.ok) throw new Error('Kunde inte hämta projekt');
  return response.json();
}
```

I en React-komponent:

```jsx
import { useEffect, useState } from 'react';
import { getProjects } from './api/projects.js';

export function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getProjects().then(setProjects).catch(error => setError(error.message));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!projects.length) return <p>Inga projekt att visa ännu.</p>;

  return (
    <section>
      {projects.map(project => (
        <article key={project._id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </article>
      ))}
    </section>
  );
}
```

Konfigurera CORS med `app.use(cors({ origin: process.env.FRONTEND_URL }))`.

</details>

Kör tester och kontrollera integrationen:

```bash
npm test
curl http://localhost:3000/api/projects

# I frontendens .env:
VITE_API_URL=http://localhost:3000
```

### Checkpoint

- Testsviten går igenom utan en lokal MongoDB-process.
- Testerna använder inte produktionsdatabasen.
- Frontend visar data från API:et och hanterar nätverksfel.
- Produktions-CORS använder en explicit frontend-origin, inte `*`.
- Ändringar syns efter ett nytt HTTP-anrop; detta är inte realtid.

Vill du senare skicka uppdateringar direkt till öppna webbläsare kan du bygga
vidare med [WebSockets i kapitel 10](../kapitel_10/websockets.md).

**Förslag på Git-commit:** `test: cover portfolio API and connect frontend`

---

Efter de fyra checkpointsen har du backendgrunden till kapitlets sammanhängande
capstone: en fullstack-portfolio med publik projektsida och skyddad administration.
Fortsätt i [Capstone: Fullstack-portfolio](demo.md).
