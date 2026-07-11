# Sessioner och cookies

I [föregående avsnitt](./middleware.md) valde `portfolio-api` JWT. Här bygger vi samma inloggning med en serverlagrad session för att förstå ett vanligt alternativ. Kapitelprojektets primära lösning är fortfarande JWT; koden nedan är ett alternativ, inte något som ska köras parallellt utan ett medvetet beslut.

## Mål

Efter avsnittet kan du:

- beskriva samspelet mellan cookie, sessions-id och serverlager
- konfigurera `express-session` med säkra cookieval
- logga in, kontrollera en session och logga ut
- välja mellan sessioner och JWT utifrån faktiska krav
- förklara varför cookieautentisering behöver CSRF-skydd

## Förutsättningar

Du behöver `portfolio-api`, användarmodellen med `email`, `passwordHash` och `role` från [middleware och JWT](./middleware.md), samt `"type": "module"` i `package.json`.

## 1. Förstå modellen

HTTP minns inget mellan requests. Med sessioner sker detta:

```text
POST /api/session/login
  -> servern verifierar lösenordet
  -> servern sparar userId och role i sessionen
  -> webbläsaren får en cookie med ett slumpat sessions-id

GET /api/session/me + cookie
  -> servern slår upp sessions-id
  -> req.session innehåller användardata
```

Cookien ska bara innehålla sessions-id, inte lösenord eller hela användarobjektet. En signerad cookie skyddar mot ändring, men är inte automatiskt krypterad.

## 2. Installera `express-session`

<!-- terminal -->
```console
$ npm install express-session
added ... packages
```

### Kör nu i din riktiga terminal

```bash
npm install express-session
```

Lägg en separat, lång hemlighet i `.env`:

```dotenv
SESSION_SECRET=byt-till-en-annan-lang-slumpad-hemlighet
```

Återanvänd inte `JWT_SECRET`. Kontrollera att `SESSION_SECRET` finns när appen startar.

## 3. Konfigurera middleware

Skapa `src/config/session.js`:

```javascript
import session from 'express-session';

const production = process.env.NODE_ENV === 'production';

export const sessionMiddleware = session({
  name: 'portfolio.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: production,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60
  }
});
```

- `httpOnly` hindrar JavaScript i webbläsaren från att läsa cookien.
- `secure` skickar den bara över HTTPS.
- `sameSite: 'lax'` minskar vissa CSRF-risker.
- `maxAge` ger en timmes giltighet.
- `saveUninitialized: false` skapar inte sessioner för anonyma besökare.

Montera middleware före sessionsrouterna i `src/app.js`:

```javascript
import { sessionMiddleware } from './config/session.js';
import sessionRoutes from './routes/sessionRoutes.js';

app.use(sessionMiddleware);
app.use('/api/session', sessionRoutes);
```

Express standardlager `MemoryStore` är endast för lokal utveckling. Det läcker minne över tid, försvinner vid omstart och kan inte delas av flera serverinstanser.

## 4. Bygg login och logout

Skapa `src/controllers/sessionController.js`:

```javascript
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function login(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const user = await User.findOne({ email }).select('+passwordHash');
    const valid = user && await bcrypt.compare(
      req.body.password ?? '',
      user.passwordHash
    );

    if (!valid) {
      return res.status(401).json({ error: 'Fel e-post eller lösenord' });
    }

    req.session.regenerate((error) => {
      if (error) return next(error);

      req.session.user = { id: user.id, role: user.role };
      req.session.save((saveError) => {
        if (saveError) return next(saveError);
        res.json({ user: { id: user.id, email: user.email, role: user.role } });
      });
    });
  } catch (error) {
    next(error);
  }
}

export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie('portfolio.sid');
    res.status(204).end();
  });
}

export function me(req, res) {
  res.json({ user: req.session.user });
}
```

`regenerate()` byter sessions-id efter login och motverkar session fixation. Vi sparar bara den identitet som behövs. För mycket känsliga operationer kan rollen läsas på nytt från databasen.

Skapa `src/middleware/sessionAuth.js`:

```javascript
export function requireSession(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Inloggning krävs' });
  }
  next();
}

export function requireSessionAdmin(req, res, next) {
  if (req.session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Adminbehörighet krävs' });
  }
  next();
}
```

Skapa `src/routes/sessionRoutes.js`:

```javascript
import { Router } from 'express';
import { login, logout, me } from '../controllers/sessionController.js';
import {
  requireSession,
  requireSessionAdmin
} from '../middleware/sessionAuth.js';

const router = Router();

router.post('/login', login);
router.get('/me', requireSession, me);
router.post('/logout', requireSession, logout);
router.get('/admin-check', requireSession, requireSessionAdmin, (req, res) => {
  res.json({ ok: true });
});

export default router;
```

Registrering kan återanvända den säkra registreringen från JWT-avsnittet. Autentiseringsmekanismen ändrar inte kravet på hashade lösenord.

## 5. Prova cookieflödet

`curl -c` sparar cookies och `curl -b` skickar dem igen.

<!-- terminal -->
```console
$ curl -c cookies.txt -X POST http://localhost:3000/api/session/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"ett-langt-losenord"}'
{"user":{"id":"...","email":"admin@example.com","role":"admin"}}
$ curl -b cookies.txt http://localhost:3000/api/session/me
{"user":{"id":"...","role":"admin"}}
$ curl -b cookies.txt -X POST http://localhost:3000/api/session/logout
```

### Kör nu i din riktiga terminal

Kör kommandona med din administratör. Kontrollera att `/me` ger `401` utan cookie och efter logout.

## 6. Beständig lagring med MongoDB

Om sessioner blir ditt produktionsval, använd ett delat lager. `connect-mongo` kan återanvända projektets `MONGODB_URI`.

```javascript
import MongoStore from 'connect-mongo';

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 60 * 60
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60
  }
});
```

### Kör nu i din riktiga terminal

Installera `connect-mongo` endast om du väljer sessionsspåret:

```bash
npm install connect-mongo
```

## Sessioner eller JWT?

| Fråga | Session | JWT |
|---|---|---|
| Var finns tillståndet? | På servern | I signerad token |
| Logout/revokering | Direkt genom radering | Kräver extra strategi |
| Flera serverinstanser | Delat lager behövs | Ingen sessionslagring behövs |
| Rolländring | Syns när sessionen uppdateras | Token kan vara inaktuell |
| Webbläsare | Cookieflöde är naturligt | Bearer-token kräver säker lagring |
| CSRF | Relevant när cookie skickas automatiskt | Lägre med Authorization-header |

JWT är inte automatiskt säkrare eller mer skalbart i alla system. Sessioner ger enkel revokering men kräver tillgänglig serverlagring. JWT passar fristående API-klienter, men stulna tokens gäller tills de går ut om ingen revokeringslösning finns. För `portfolio-api` behåller vi JWT som primär lösning så resten av kapitlet har ett tydligt spår.

## Produktion och CSRF

Cookieautentisering gör att webbläsaren skickar credentials automatiskt. `sameSite` hjälper men ersätter inte alltid CSRF-skydd. Använd en aktivt underhållen CSRF-lösning eller ett verifierat tokenmönster för skrivande requests, kontrollera `Origin`, och tillåt inte bred CORS med credentials.

I produktion krävs HTTPS för `secure: true`. Bakom en reverse proxy måste Express lita på rätt proxy, exempelvis `app.set('trust proxy', 1)`, annars kan säkra cookies utebli. Sätt bara detta när infrastrukturen verkligen har exakt den proxykedjan.

## Vanliga misstag

- `MemoryStore` används i produktion.
- Sessionshemligheten hårdkodas eller återanvänds.
- `secure: true` testas över vanlig lokal HTTP och cookien verkar försvinna.
- Sessions-id regenereras inte efter login.
- Cookie-namnet i `clearCookie` skiljer sig från `name`.
- CORS, CSRF och proxyinställningar behandlas som samma problem.

## Checkpoint

- [ ] Du kan förklara vad cookien respektive serverlagret innehåller.
- [ ] Login regenererar sessionen och logout förstör den.
- [ ] Cookie har `httpOnly`, rimlig `sameSite`, livslängd och produktionsstyrd `secure`.
- [ ] Produktion använder ett beständigt, delat lager.
- [ ] Du kan motivera JWT-valet för `portfolio-api`.

Fortsätt med [Testning med Jest](./testning.md), där vi verifierar API:ets publika och skyddade routes.
