# Bygg `portfolio-api` med Express

I [lektionen om Node HTTP](http-webserver.md) hanterade du routing, JSON och
headers själv. Express bygger ovanpå samma HTTP-flöde och ger oss tydligare
routes och middleware. Vi bygger nu om samma `portfolio-api`, utan att ändra
API:ets adresser eller svar.

> **Mål:**  
> Installera Express och dotenv, dela upp app och server, skapa en router samt
> använda JSON- och felmiddleware.

## Förutsättningar

- `portfolio-api` har `"type": "module"` i `package.json`.
- Du har `start`- och `dev`-skripten från [Node-introduktionen](node-intro.md).
- Du kan förklara request, response, statuskod och JSON-header.

---

## 1. Installera beroenden

Express sköter webbserverns routes och middleware. dotenv läser lokal
konfiguration från `.env` till `process.env`.

<!-- terminal -->
```bash
npm install express dotenv
```

> **Kör nu i din riktiga terminal:** Installera båda paketen i `portfolio-api`.

npm lägger till paketen under `dependencies` i `package.json` och uppdaterar
`package-lock.json`. Vi använder bara ES-moduler med `import` och `export`.
CommonJS (`require`) förekommer i äldre exempel men används inte här.

Skapa mapparna för projektets första router:

<!-- terminal -->
```bash
mkdir -p src/routes
```

> **Kör nu i din riktiga terminal:** Skapa mappen `src/routes` (i PowerShell kan du använda `mkdir src/routes`).

---

## 2. Skapa en projektrouter

Skapa `src/routes/projects.js`:

```js
import { Router } from 'express';

export const projectsRouter = Router();

const projects = [
  {
    id: 1,
    title: 'Portfolio',
    description: 'Min personliga webbplats',
    technologies: ['HTML', 'CSS', 'JavaScript']
  },
  {
    id: 2,
    title: 'Väderapp',
    description: 'Visar väderdata från ett externt API',
    technologies: ['JavaScript', 'Fetch API']
  }
];

projectsRouter.get('/', (request, response) => {
  response.status(200).json(projects);
});
```

En router samlar routes som hör till samma resurs. Sökvägen `/` är relativ
till den adress där routern monteras. Arrayen ligger bara i minnet och
återställs när servern startar om. I
[MongoDB-lektionen](mongodb.md) ersätts den av beständig data.

---

## 3. Konfigurera Express-appen

Skapa `src/app.js`:

```js
import express from 'express';
import { projectsRouter } from './routes/projects.js';

export const app = express();

app.use(express.json());

app.get('/health', (request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use('/api/projects', projectsRouter);

app.use((request, response) => {
  response.status(404).json({ error: 'Endpointen finns inte' });
});

app.use((error, request, response, next) => {
  console.error(error);

  const statusCode = error.status ?? 500;
  const message =
    statusCode === 400 ? 'Ogiltig JSON' : 'Internt serverfel';

  response.status(statusCode).json({ error: message });
});
```

`express.json()` är middleware. Den läser requests med JSON-body och placerar
resultatet i `request.body`, vilket behövs när API:et senare får POST-routes.

Ordningen är viktig: JSON-parsern körs först, därefter routes, 404-hanteraren
och sist felhanteraren. En Express-felhanterare känns igen på sina fyra
parametrar, även när `request` och `next` inte används ännu.

Express sätter automatiskt rätt JSON-header när `response.json()` används.

---

## 4. Separera start från app

Skapa `.env` i projektets rot:

```dotenv
PORT=3000
```

`.env` ska redan finnas i `.gitignore`. Porten är inte hemlig, men samma fil
kommer senare att innehålla databasens anslutningssträng och ska därför aldrig
committas.

Ersätt `src/server.js` med:

```js
import 'dotenv/config';
import { app } from './app.js';

const PORT = Number(process.env.PORT) || 3000;

export const server = app.listen(PORT, () => {
  console.log(`Portfolio API körs på http://localhost:${PORT}`);
});
```

`src/app.js` beskriver beteendet; `src/server.js` läser miljön och börjar
lyssna. Uppdelningen gör appen enklare att importera i tester utan att
automatiskt öppna en port.

Projektet ser nu ut så här:

```text
portfolio-api/
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── src/
    ├── routes/
    │   └── projects.js
    ├── app.js
    └── server.js
```

När projektet växer tillkommer bland annat modeller, controllers och
databaskonfiguration. Skapa inte de lagren innan de behövs.

---

## 5. Starta och testa

<!-- terminal -->
```bash
npm run dev
# Portfolio API körs på http://localhost:3000
```

> **Kör nu i din riktiga terminal:** Starta Express-servern och låt den terminalen vara öppen.

Öppna en andra terminal:

<!-- terminal -->
```bash
curl -i http://localhost:3000/health
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
#
# {"status":"ok"}

curl -i http://localhost:3000/api/projects
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
#
# [{"id":1,"title":"Portfolio",...}]
```

> **Kör nu i din riktiga terminal:** Kontrollera att båda GET-routes ger samma JSON som tidigare.

Verifiera också 404-hanteraren:

<!-- terminal -->
```bash
curl -i http://localhost:3000/saknas
# HTTP/1.1 404 Not Found
# {"error":"Endpointen finns inte"}
```

> **Kör nu i din riktiga terminal:** Anropa en okänd route och kontrollera att svaret är JSON med status `404`.

---

## Vanliga misstag

- **`require is not defined`:** kopiera inte CommonJS-exempel; använd
  `import` och kontrollera `"type": "module"`.
- **Routern ger 404:** kontrollera både `app.use('/api/projects', ...)` och
  `projectsRouter.get('/')`.
- **`request.body` är `undefined`:** placera `express.json()` före routes.
- **Felmiddleware körs inte:** den ska ligga sist och ha fyra parametrar.
- **Porten ändras inte:** kontrollera `.env`, starta om processen och verifiera
  att `import 'dotenv/config'` ligger först i `src/server.js`.
- **Hemligheter hamnar i Git:** kontrollera att `.env` finns i `.gitignore`.

---

## Checkpoint

- [ ] `express` och `dotenv` finns under `dependencies`.
- [ ] `src/app.js` exporterar appen och `src/server.js` startar den.
- [ ] `GET /health` och `GET /api/projects` ger `200` och JSON.
- [ ] Projektroutern ligger i `src/routes/projects.js`.
- [ ] Okända endpoints ger ett JSON-svar med `404`.
- [ ] JSON-, 404- och felmiddleware ligger i rätt ordning.

Fortsätt med [middleware](middleware.md) och därefter
[REST-API:er](rest-api.md), där `portfolio-api` får fler operationer.
