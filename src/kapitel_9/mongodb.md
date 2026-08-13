# MongoDB och Mongoose i `portfolio-api`

I de tidigare Express-lektionerna byggde du grunden till `portfolio-api`. Nu
ersätter vi tillfällig data i minnet med MongoDB. MongoDB lagrar dokument som
liknar JavaScript-objekt, medan Mongoose ger oss scheman, validering och ett
tydligt API för databasanrop.

## Mål

Efter lektionen kan du:

- ansluta ett Express-projekt till MongoDB med Mongoose
- hålla anslutningssträngen utanför Git
- skapa en Mongoose-modell med validering
- starta servern först när databasen är ansluten

## Förutsättningar

- Du arbetar i projektmappen `portfolio-api`.
- `package.json` innehåller `"type": "module"`.
- Express-appen är uppdelad i `src/app.js` och `src/server.js`.
- Du har följt [lektionen om Express](./expressjs.md).

## 1. Välj MongoDB Atlas

[MongoDB Atlas](https://www.mongodb.com/atlas) är förstahandsvalet i kursen.
Det fungerar likadant på Windows, macOS och Linux och kräver ingen lokal
databasserver.

1. Skapa ett kostnadsfritt Atlas-konto och ett kluster.
2. Skapa en databasanvändare med ett eget, starkt lösenord.
3. Lägg till din nuvarande IP-adress under **Network Access**.
4. Välj **Connect → Drivers → Node.js** och kopiera anslutningssträngen.
5. Byt ut lösenordet och ange databasnamnet `portfolio`.

Strängen liknar detta:

```text
mongodb+srv://portfolio_user:<password>@cluster0.example.mongodb.net/portfolio
```

Lösenord med specialtecken måste URL-kodas. Atlas kan hjälpa dig att skapa rätt
sträng.

### Kort lokalt alternativ

Om du redan har MongoDB Community Server installerad kan du använda:

```text
mongodb://127.0.0.1:27017/portfolio
```

Startkommandot skiljer sig mellan operativsystem. Atlas rekommenderas därför
för en gemensam kursmiljö.

## 2. Installera Mongoose

Vi använder även `dotenv` för att läsa lokala miljövariabler.

<!-- terminal -->
```bash
$ cd portfolio-api
$ npm install mongoose dotenv

added ... packages
```

Kontrollera också att projektet använder ES-moduler:

```json
{
  "type": "module"
}
```

Använd bara `import` och `export` i projektet. Blanda inte in `require` eller
`module.exports`.

## 3. Skydda anslutningssträngen

Skapa `.env` i projektets rot:

```dotenv
MONGODB_URI=mongodb+srv://portfolio_user:DITT_LOSENORD@cluster0.example.mongodb.net/portfolio
PORT=3000
```

Skapa sedan `.env.example`, som får versionshanteras:

```dotenv
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/portfolio
PORT=3000
```

Kontrollera att `.gitignore` innehåller:

```gitignore
node_modules/
.env
```

`.env.example` visar vilka variabler projektet behöver utan att avslöja
hemligheter. **Lägg aldrig till din riktiga MongoDB-URI i Git.** Om den ändå
råkar publiceras ska du byta databaslösenord direkt; det räcker inte att bara
ta bort strängen i en senare commit.

<!-- terminal -->
```bash
$ printf "\n.env\n" >> .gitignore
$ test -f .env && echo ".env finns lokalt"

.env finns lokalt
```

Kommandot är en simulering. Lägg inte till en extra `.env`-rad om den redan
finns.

## 4. Skapa databasanslutningen

Skapa mapparna under `src`:

<!-- terminal -->
```bash
$ mkdir -p src/config src/models
```

Skapa `src/config/database.js`:

```javascript
// src/config/database.js
import mongoose from 'mongoose';

export async function connectDatabase() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI saknas i .env');
  }

  await mongoose.connect(MONGODB_URI);
  console.log(`MongoDB ansluten: ${mongoose.connection.name}`);
}
```

`mongoose.connect()` returnerar ett promise. Genom att invänta det kan vi
undvika att servern tar emot anrop innan databasen är redo. Moderna versioner
av Mongoose behöver inte alternativen `useNewUrlParser` eller
`useUnifiedTopology`.

## 5. Modellera ett portfolio-projekt

Skapa `src/models/Project.js`:

```javascript
// src/models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Titel krävs'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Beskrivning krävs'],
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
```

Modellnamnet `Project` blir normalt kollektionen `projects`. `timestamps`
skapar och uppdaterar fälten `createdAt` och `updatedAt` automatiskt.

## 6. Anslut innan servern startar

`src/app.js` ska konfigurera Express men inte anropa `listen`:

```javascript
// src/app.js
import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' });
});

export default app;
```

Låt `src/server.js` läsa miljön, ansluta och därefter starta appen:

```javascript
// src/server.js
import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 3000;

try {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Kunde inte starta servern:', error.message);
  process.exit(1);
}
```

Toppnivå-`await` fungerar med ES-moduler. Uppdelningen gör `src/app.js`
lättare att testa utan att öppna en nätverksport. Låt npm-scriptet `start`
köra `node src/server.js`.

## 7. Verifiera anslutningen

Kör nu i din riktiga terminal:

<!-- terminal -->
```bash
$ npm start

MongoDB ansluten: portfolio
Servern körs på http://localhost:3000
```

Öppna en andra terminal:

<!-- terminal -->
```bash
$ curl http://localhost:3000/api/health

{"status":"ok"}
```

Om anslutningen misslyckas, kontrollera Atlas IP-regel, användarnamn, lösenord
och databasnamn. Skriv inte ut hela `MONGODB_URI` när du felsöker.

## Vanliga misstag

- **URI:n ligger i koden:** läs den från `process.env.MONGODB_URI`.
- **`.env` har lagts till i Git:** ignorera filen och byt exponerade lösenord.
- **Servern startar före databasen:** invänta `connectDatabase()` före `listen`.
- **Fel IP i Atlas:** lägg till den IP-adress du ansluter från.
- **CommonJS blandas med ES-moduler:** använd endast `import` och `export`.
- **`localhost` ger lokala anslutningsproblem:** använd `127.0.0.1` i lokal URI.

## Checkpoint

Innan du går vidare ska du kunna svara ja:

- [ ] `.env` innehåller den riktiga URI:n och ignoreras av Git.
- [ ] `.env.example` innehåller endast platshållare.
- [ ] `src/config/database.js` exporterar `connectDatabase`.
- [ ] `src/models/Project.js` har schema, standardvärden och timestamps.
- [ ] Terminalen visar både databasanslutning och startad server.

Nästa lektion bygger CRUD-routes ovanpå modellen:
[Bygg ett REST-API](./rest-api.md).
