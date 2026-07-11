# Testning av `portfolio-api` med Jest

Automatiska test gör att vi kan ändra API:t utan att manuellt prova varje route. Här testar vi hälsokontrollen, projektvalidering och JWT-skydd med Jest och Supertest, utan att starta en riktig nätverksserver.

## Mål

Efter avsnittet kan du:

- skilja på enhets- och integrationstest
- skriva test enligt Arrange–Act–Assert
- testa Express med Supertest
- verifiera `400`, `401`, `403` och lyckade svar
- hålla databasberoenden utanför små, snabba test

## Förutsättningar

Utgå från `portfolio-api` i [middleware och JWT](./middleware.md). Projektet använder ES-moduler genom `"type": "module"`. Läs [sessioner](./sessions.md) om du valde cookiealternativet; testerna här följer kapitlets primära JWT-spår.

## 1. Gör appen testbar

`src/app.js` ska konfigurera och exportera Express-appen, men inte lyssna på en port:

```javascript
import express from 'express';
import projectsRouter from './routes/projects.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/projects', projectsRouter);
app.use(notFound);
app.use(errorHandler);
export default app;
```

Endast `src/server.js` ansluter databasen och börjar lyssna:

```javascript
import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';

const port = process.env.PORT ?? 3000;
await connectDatabase();
app.listen(port, () => console.log(`portfolio-api kör på port ${port}`));
```

Separationen är viktig: `request(app)` kan anropa appen direkt och lämnar ingen öppen port efter testet.

## 2. Installera testverktygen

Vi använder aktuell Jest med `babel-jest` för att transformera projektets ES-moduler under test. Därmed behövs inte det äldre scriptet med `--experimental-vm-modules`, och applikationskoden fortsätter använda enbart `import` och `export`.

<!-- terminal -->
```console
$ npm install --save-dev jest supertest babel-jest @babel/core @babel/preset-env
added ... packages
```

### Kör nu i din riktiga terminal

```bash
npm install --save-dev jest supertest babel-jest @babel/core @babel/preset-env
```

Komplettera `package.json` utan att ta bort befintliga beroenden:

```json
{
  "type": "module",
  "scripts": {
    "test": "jest --runInBand",
    "test:watch": "jest --watch"
  },
  "babel": {
    "presets": [
      ["@babel/preset-env", { "targets": { "node": "current" } }]
    ]
  },
  "jest": {
    "testEnvironment": "node",
    "clearMocks": true
  }
}
```

`--runInBand` kör filerna sekventiellt. Det är ofta tydligare för API-test och gemensamma resurser. Node har också `node --test`, men vi använder Jest eftersom resten av upplägget bygger på Jests matchers och mocks.

Sätt `JWT_SECRET` och `NODE_ENV=test` i `.env.test` eller en Jest setup-fil. Använd aldrig produktionshemligheter i test.

## 3. Testa hälsokontrollen

Skapa `tests/health.test.js`:

```javascript
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/health', () => {
  test('svarar att API:t mår bra', async () => {
    // Arrange: appen är importerad och ingen server startas.

    // Act
    const response = await request(app).get('/api/health');

    // Assert
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
```

Arrange förbereder, Act utför och Assert verifierar. Kommentarerna kan tas bort när strukturen är självklar.

<!-- terminal -->
```console
$ npm test
PASS tests/health.test.js
Tests:       1 passed, 1 total
```

### Kör nu i din riktiga terminal

```bash
npm test
```

Vid `FAIL`, läs testnamnet och skillnaden mellan `Expected` och `Received`.

## 4. Testa validering och auktorisation utan databas

Vi testar att saknad token ger `401`, rollen `user` ger `403` och ogiltig admindata ger `400`, allt innan MongoDB anropas.

Det förutsätter att routeordningen är:

```javascript
router.post(
  '/',
  authenticate,
  requireAdmin,
  validateProject,
  createProject
);
```

En liten valideringsmiddleware kan se ut så här:

```javascript
export function validateProject(req, res, next) {
  if (typeof req.body.title !== 'string' || !req.body.title.trim()) {
    return res.status(400).json({ error: 'Titel krävs' });
  }
  next();
}
```

Skapa `tests/projects.auth.test.js`:

```javascript
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';

const secret = 'test-secret-som-endast-anvands-lokalt';

beforeAll(() => {
  process.env.JWT_SECRET = secret;
});

function tokenFor(role) {
  return jwt.sign({ sub: 'test-user-id', role }, secret, { expiresIn: '5m' });
}

describe('POST /api/projects', () => {
  test('avvisar en request utan token', async () => {
    // Arrange
    const project = { title: 'Min portfolio' };

    // Act
    const response = await request(app).post('/api/projects').send(project);

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Bearer-token krävs' });
  });

  test('avvisar en vanlig användare', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenFor('user')}`)
      .send({ title: 'Min portfolio' });
    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/Admin/);
  });

  test('validerar data från en administratör', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ title: '   ' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Titel krävs' });
  });
});
```

Sätt miljövariabeln före import om din auth-modul läser hemligheten på modulnivå. Bättre är att läsa `process.env.JWT_SECRET` när token verifieras eller att använda en setup-fil.

## 5. Testa controllern med en injicerad modell

Enhetsprov blir enklare om logiken tar sitt beroende som argument:

```javascript
export function makeCreateProject(Project) {
  return async (req, res, next) => {
    try {
      const project = await Project.create(req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };
}
```

Skapa `tests/createProject.test.js`:

```javascript
import { jest } from '@jest/globals';
import { makeCreateProject } from '../src/controllers/projectController.js';

test('skapar ett validerat projekt', async () => {
  const saved = { id: 'p1', title: 'Portfolio API' };
  const Project = { create: jest.fn().mockResolvedValue(saved) };
  const req = { body: { title: 'Portfolio API' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  await makeCreateProject(Project)(req, res, next);

  expect(Project.create).toHaveBeenCalledWith(req.body);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(saved);
});
```

Modellen är en kontrollerad mock. `mongodb-memory-server` passar senare för Mongoose-frågor, index och hooks, men innebär mer setup. Lägg inte till det innan testet behöver riktigt MongoDB-beteende.

## 6. Läs och förbättra testresultatet

Kör en fil med `npx jest tests/projects.auth.test.js`. Kör hela sviten före leverans:

```bash
npm test
npm test -- --coverage
```

Kodtäckning visar körd kod, inte testkvalitet. Prioritera felaktig token, fel roll, ogiltig input, databasfel och statuskoder.

## Vanliga misstag

- `app.listen()` ligger i `src/app.js` och håller Jest öppet.
- Testet ansluter av misstag till utvecklings- eller produktionsdatabasen.
- `await` glöms framför Supertest-anropet.
- Ett test verifierar intern implementation i stället för HTTP-beteende.
- Samma data delas mellan test så att ordningen påverkar resultatet.
- En admin-token används i test utan kort giltighet eller separat testhemlighet.

## Checkpoint

- [ ] `src/app.js` exporterar appen och endast `src/server.js` lyssnar.
- [ ] `npm test` fungerar med ES-moduler utan VM-flaggan.
- [ ] Hälsokontrollen testas med Supertest.
- [ ] Projektets validering, `401` och `403` har egna test.
- [ ] Minst ett test följer tydligt Arrange–Act–Assert.
- [ ] Databasen är mockad eller uttryckligen isolerad från riktig data.

Fortsätt med [övningarna](./ovningar.md) och lägg test till varje ny route.
