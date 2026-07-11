# Node.js – från fetch till ett eget API

I [kapitel 5 om fetch](../kapitel_5/fetch.md) hämtade webbläsaren data från
andras API:er. Nu bygger vi servern som svarar. Genom hela kapitlet utvecklar
vi samma projekt: `portfolio-api`, ett API för projekten i din portfolio.

> **Mål:**  
> Installera Node.js, skapa `portfolio-api` och förstå runtime, `package.json`,
> npm-skript, ES-moduler och miljövariabler.

## Förutsättningar

- Du kan JavaScript, JSON, Promises och `async`/`await`.
- Du har använt `fetch()` och en terminal.
- Du har en kodeditor.

---

## 1. Node.js kör JavaScript utanför webbläsaren

Webbläsaren ger JavaScript bland annat DOM och `window`. **Node.js** är en
JavaScript-runtime som i stället ger tillgång till operativsystemet, filer,
nätverk och serverfunktioner. Språket är detsamma, men miljön skiljer sig.

När en frontend gör `fetch('/api/projects')` skickas en HTTP-request. Vår
Node-process ska ta emot requesten och skicka JSON i en response. Node passar
bra för detta eftersom nätverksarbete är asynkront: processen kan vänta på
flera operationer utan att blockera vid varje request.

---

## 2. Installera aktuell Node.js LTS

Använd den aktuella **LTS-versionen** (Long Term Support), inte ett gammalt
versionsnummer från en guide.

### Windows

1. Öppna [nodejs.org](https://nodejs.org/) och hämta LTS-installationsfilen.
2. Kör installationsprogrammet med standardvalen; npm följer med.
3. Stäng och öppna terminalen igen.

Om du behöver växla mellan Node-versioner kan du i stället följa
[nvm-windows](https://github.com/coreybutler/nvm-windows). Använd inte både
den vanliga installationen och nvm-windows samtidigt.

### macOS

Det enklaste är LTS-installationsfilen från [nodejs.org](https://nodejs.org/).
För flera versioner, installera [nvm](https://github.com/nvm-sh/nvm) enligt
projektets instruktion och kör:

<!-- terminal -->
```bash
nvm install --lts
nvm use --lts
```

> **Kör nu i din riktiga terminal:** Kör kommandona ovan om du valde nvm.

### Linux

Distributions paketlager kan innehålla en äldre Node-version. Rekommendationen
är LTS från [nodejs.org](https://nodejs.org/) eller
[nvm](https://github.com/nvm-sh/nvm). Installera nvm enligt dess officiella
instruktion och kör sedan:

<!-- terminal -->
```bash
nvm install --lts
nvm use --lts
```

> **Kör nu i din riktiga terminal:** Kör kommandona ovan efter att nvm har installerats.

### Verifiera installationen

`node` kör JavaScript och `npm` hanterar projektets paket och skript.

<!-- terminal -->
```bash
node --version
# v<installerad LTS-version>

npm --version
# <installerad npm-version>
```

> **Kör nu i din riktiga terminal:** Kontrollera att båda kommandona visar ett versionsnummer.

---

## 3. Initiera `portfolio-api`

Skapa projektet i den katalog där du brukar ha dina kursprojekt:

<!-- terminal -->
```bash
mkdir portfolio-api
cd portfolio-api
npm init -y
mkdir src
```

> **Kör nu i din riktiga terminal:** Skapa projektmappen, initiera npm och lägg källkoden i `src/`.

`npm init -y` skapar `package.json`. Filen beskriver projektet och blir senare
platsen där npm registrerar beroenden. Ändra den till:

```json
{
  "name": "portfolio-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  }
}
```

- `"private": true` skyddar mot oavsiktlig publicering till npm.
- `"type": "module"` aktiverar moderna ES-moduler i `.js`-filer.
- `npm start` kör servern normalt.
- `npm run dev` startar om processen när filer ändras.

Den äldre modulformen CommonJS använder `require()`. I det här projektet
använder vi enbart standarden ES-moduler: `import` och `export`.

---

## 4. Prova runtime och ES-moduler

Skapa `src/projects.js`:

```js
export const projects = [
  {
    id: 1,
    title: 'Portfolio',
    description: 'Min personliga webbplats'
  }
];
```

Skapa tillfälligt `src/server.js`:

```js
import { projects } from './projects.js';

console.log('Portfolio API startar');
console.log(projects);
```

Lokala importer ska ha filändelsen `.js`. Kör filen:

<!-- terminal -->
```bash
npm start
# Portfolio API startar
# [ { id: 1, title: 'Portfolio', ... } ]
```

> **Kör nu i din riktiga terminal:** Skapa filerna och kontrollera att projektet skrivs ut.

Node avslutas här eftersom inget arbete återstår. I nästa lektion håller en
HTTP-server processen levande.

---

## 5. Ignorera lokala filer och hemligheter

Skapa `.gitignore`:

```text
node_modules/
.env
```

`node_modules/` skapas av npm och ska kunna återskapas. En `.env`-fil används
senare för lokal konfiguration:

```dotenv
PORT=3000
DATABASE_URL=mongodb://localhost:27017/portfolio
```

Miljövariabler läses som `process.env.PORT`. Paketet `dotenv` kan läsa `.env`
under lokal utveckling; vi installerar det först i Express-lektionen.

> **Säkerhet:** Lägg aldrig lösenord, API-nycklar eller andra hemligheter i
> Git. `.gitignore` förebygger misstag, men en hemlighet som redan har
> committats måste spärras och ersättas.

---

## Vanliga misstag

- **`node` hittas inte:** öppna en ny terminal eller kontrollera installationen.
- **`Cannot use import statement`:** kontrollera `"type": "module"`.
- **En lokal import hittas inte:** skriv hela sökvägen, exempelvis
  `./projects.js`.
- **`npm start` saknas:** kontrollera `scripts` i `package.json`.
- **`.env` läggs i Git:** lägg till den i `.gitignore` innan första commit.

---

## Checkpoint

- [ ] `node --version` och `npm --version` fungerar.
- [ ] Mappen heter `portfolio-api` och innehåller `package.json` samt `src/`.
- [ ] `package.json` har `"type": "module"` och skripten `start` och `dev`.
- [ ] `npm start` importerar och skriver ut projektlistan.
- [ ] `.gitignore` innehåller `node_modules/` och `.env`.
- [ ] Du kan förklara skillnaden mellan Node.js och npm.

Nästa lektion: [bygg API:ets första HTTP-server](http-webserver.md).
