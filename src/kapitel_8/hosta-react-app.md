# Publicera Kulturverkstan med Dokploy

Nu fungerar lista, detalj, bokning, bekräftelse och demo-API lokalt. I den här
lektionen bygger du appen, pushar den till GitHub och publicerar samma flöde.

> **Mål:** Bygga en produktionsversion, publicera den med Dokploy och kontrollera att både direkta routes och `/api` fungerar.

## Före publicering

Kör kontrollerna i Kulturverkstans projektmapp:

```bash
npm run build
npm start
```

Öppna adressen som terminalen visar. Kontrollera sedan:

- `/api/workshops` visar JSON,
- `/workshops/keramik` visar detaljsidan,
- `/book/keramik` visar formuläret,
- en bokning leder till `/confirm`.

Avsluta servern med `Ctrl+C`.

## Gör demoservern redo för produktion

I API-lektionen använde du `server.cjs` enbart för API:t. Ersätt filen med
versionen nedan. Den serverar också Vites `dist`-mapp och skickar `index.html`
för direkta React Router-adresser.

```js
const fs = require('node:fs');
const path = require('node:path');
const jsonServer = require('json-server');

const server = jsonServer.create();
const api = jsonServer.router(path.join(__dirname, 'db.json'));
const port = Number(process.env.PORT) || 3001;
const distDirectory = path.join(__dirname, 'dist');

server.use(jsonServer.defaults({
  static: fs.existsSync(distDirectory) ? distDirectory : undefined,
}));
server.use(jsonServer.bodyParser);
server.use('/api', api);

server.get('*', (request, response) => {
  const indexFile = path.join(distDirectory, 'index.html');

  if (fs.existsSync(indexFile)) {
    response.sendFile(indexFile);
    return;
  }

  response.status(404).json({
    message: 'Bygg appen med npm run build.',
  });
});

server.listen(port, () => {
  console.log(`Kulturverkstan kör på port ${port}`);
});
```

Kontrollera att `package.json` innehåller dessa scripts:

```json
{
  "scripts": {
    "vite": "vite",
    "api": "node server.cjs",
    "dev": "concurrently -k -n API,VITE \"npm:api\" \"npm:vite\"",
    "build": "vite build",
    "start": "node server.cjs"
  }
}
```

> Demoservern är kursinfrastruktur. `db.json` kan återställas när appen byggs
> om och är inte en riktig databas.

## Checkpoint 1: gör en lokal produktionskontroll

Kör på nytt:

```bash
npm run build
npm start
```

Skriv in `/book/keramik` direkt i adressfältet och ladda om sidan. Du är klar
när sidan fortfarande visas och `/api/workshops` svarar.

## Pusha till GitHub

Kontrollera först att `node_modules` och `dist` ignoreras:

```gitignore
node_modules/
dist/
.env
```

Committa och pusha:

```bash
git add .
git commit -m "förbered kulturverkstan för publicering"
git push
```

Kontrollera på GitHub att `db.json`, `server.cjs`, `package.json` och
`package-lock.json` finns, men inte `node_modules`.

## Skapa applikationen i Dokploy

1. Logga in på kursens Dokploy-instans.
2. Skapa eller öppna ditt projekt.
3. Skapa en **Application**.
4. Välj GitHub som källa och välj Kulturverkstans repository och branch.
5. Använd projektroten som build path.
6. Välj **Nixpacks** eller den byggtyp läraren anger.
7. Ange vid behov:
   - build command: `npm run build`
   - start command: `npm start`
8. Spara och starta deployment.

Dokploy kan ansluta GitHub-repositories och automatiskt publicera den valda
branchen efter nya pushes. De exakta fältnamnen kan förändras; läs därför även
[Dokploys GitHub-guide](https://docs.dokploy.com/docs/core/github) och
[översikten över build types](https://docs.dokploy.com/docs/core/applications/build-type).

## Koppla domän och port

När deploymenten är grön:

1. Öppna fliken **Domains**.
2. Lägg till domänen som läraren har tilldelat.
3. Ange den port som Dokploy visar för applikationen.
4. Aktivera HTTPS om det inte sker automatiskt.

Öppna den publika adressen i ett privat webbläsarfönster. Det avslöjar om du
råkar vara beroende av något som bara finns lokalt.

## Se → förutsäg → kör → ändra → kontrollera → förklara

1. **Se:** hitta build- och startkommandot i deploymentloggen.
2. **Förutsäg:** vad händer om `dist` inte har byggts?
3. **Kör:** öppna `/api/workshops` på den publika domänen.
4. **Ändra:** uppdatera en workshoptext, committa och pusha.
5. **Kontrollera:** texten ska synas efter nästa deployment.
6. **Förklara:** varför måste servern skicka `index.html` för `/book/keramik`?

## Första hjälpen

| Symptom | Kontroll |
|---|---|
| Builden misslyckas | Kör `npm run build` lokalt och läs det första felet |
| `npm start` saknas | Kontrollera scripts i `package.json` |
| Startsidan fungerar men `/api/workshops` ger 404 | Kontrollera `server.use('/api', api)` |
| Direktlänk ger 404 | Kontrollera `server.get('*', ...)` och att `dist/index.html` finns |
| Appen lyssnar på fel port | Använd `process.env.PORT` som i serverfilen |
| Ny push publiceras inte | Kontrollera vald branch och deploymentloggen |

## Slutcheckpoint

Du är klar när:

- den publika startsidan visar workshops,
- ett GET-anrop och en boknings-POST fungerar,
- `/workshops/keramik` och `/book/keramik` kan laddas om direkt,
- `/confirm` visar ett hjälpsamt tomläge efter en direkt omladdning,
- en ny push leder till en ny fungerande deployment.

> **Commit-förslag:** `git commit -m "publicera kulturverkstan"`
