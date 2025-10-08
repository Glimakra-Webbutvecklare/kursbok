# Introduktion till Node.js

## Vad är Node.js?

Node.js är en öppen källkod JavaScript-runtime-miljö som körs på serversidan. Den är byggd på Chrome's V8 JavaScript-motor och möjliggör för utvecklare att köra JavaScript-kod utanför webbläsaren. Detta innebär att du kan bygga skalbara nätverksapplikationer och servrar med samma programmeringsspråk som du använder på klientsidan.

## Historia och bakgrund
Node.js skapades av Ryan Dahl 2009. Innan Node.js var JavaScript främst begränsat till webbläsaren, men med introduktionen av Node.js blev det möjligt att använda JavaScript för server-side-programmering, alltså utanför en webbläsare. Detta öppnade upp för enhetlig utveckling där både frontend och backend kunde skrivas i samma språk. Node.js har sedan dess utvecklats och har nu en stor och aktiv community som bidrar till dess ekosystem.

## Varför använda Node.js?
- Event-drivet och asynkront: Node.js använder en event-driven, non-blocking I/O-modell som gör den lätt och effektiv, speciellt för applikationer som behöver hantera många samtidiga anslutningar.
- Skalbarhet: Tack vare dess asynkrona natur är Node.js utmärkt för att bygga skalbara nätverksapplikationer.
- Enhetligt språk: Använd samma språk för både klient och server, vilket förenklar utvecklingsprocessen.
- Stort ekosystem: Med NPM (Node Package Manager) har du tillgång till ett enormt bibliotek av öppna moduler som kan användas i dina projekt.

## Installera Node.js
- Steg-för-steg-guide för att installera Node.js på Windows, macOS och Linux med hjälp av Node Version Manager.

## Din första Node.js-applikation
Låt oss skapa en enkel “Hello World”-applikation som körs i terminalen.
1.	Öppna en textredigerare och skapa en fil kallad app.js.
2. Skriv följande kod i filen
```js,editable
console.log('Hello, World!');
```
3. Spara Filen och öppna en terminal
4. Kör programmet med kommandot
```bash
node app.js
``` 

Du bör se `Hello, World!` skrivet i terminalen.

## Grundläggande koncept i Node.js

### Globala objekt och modulsystem-skillnader

Node.js har flera globala objekt som är tillgängliga överallt i din applikation:

**Tillgängliga i både CommonJS och ES6 Modules:**
- `global`: Motsvarigheten till `window` i webbläsaren
- `process`: Ger information om och kontroll över den aktuella Node.js-processen
- `console`: För utskrift och debugging
- `Buffer`: För hantering av binär data

**Endast i CommonJS:**
- `__dirname`: Ger den fullständiga sökvägen till den katalog där den aktuella filen befinner sig
- `__filename`: Ger den fullständiga sökvägen till den aktuella filen
- `require`: För att importera moduler
- `module`: Information om den aktuella modulen
- `exports`: För att exportera från modulen

**ES6 Modules alternativ:**
```js
// I ES6 modules, använd import.meta för liknande funktionalitet
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Current file:', __filename);
console.log('Current directory:', __dirname);
```


### Modulsystem i Node.js

Node.js stöder två huvudsakliga modulsystem:

#### CommonJS (traditionellt)
```js
const fs = require('fs');
const path = require('path');
```

#### ES6 Modules (modernt och rekommenderat)
```js
import fs from 'fs';
import path from 'path';
```

### Varför ES6 Modules är bättre

ES6 Modules (ECMAScript Modules) är den moderna standarden för JavaScript-moduler och har flera fördelar:

**1. Standardiserat och framtidssäkert**
- Del av JavaScript-standarden (ECMAScript)
- Samma syntax i både Node.js och webbläsare
- Bättre långsiktig kompatibilitet

**2. Statisk analys**
```js
// ES6 imports kan analyseras vid byggtid
import { readFile, writeFile } from 'fs/promises';

// CommonJS require() körs vid runtime
const { readFile, writeFile } = require('fs/promises');
```

**3. Bättre prestanda**
- Tree shaking (oanvänd kod kan tas bort)
- Optimering vid byggtid
- Mindre bundle-storlek

**4. Tydligare syntax**
```js
// ES6 - tydligt vad som importeras
import { createServer } from 'http';
import express from 'express';

// CommonJS - mindre tydligt
const { createServer } = require('http');
const express = require('express');
```

**5. Asynkron laddning**
```js
// Dynamisk import (ES6)
const module = await import('./myModule.js');

// Top-level await stöds i ES6 modules
const data = await fetch('/api/data');
```

### Konfigurera ES6 Modules

För att använda ES6 modules i Node.js, lägg till i din `package.json`:
```json
{
  "type": "module"
}
```

Eller använd `.mjs` filextension:
```bash
# Filer med .mjs använder automatiskt ES6 modules
node app.mjs
```

## Inbyggda moduler

Node.js kommer med flera inbyggda moduler som kan användas utan att installera något ytterligare.

### fs (File System)

Används för att interagera med filsystemet.
- Läsa från en fil:

```js
import fs from 'fs';

fs.readFile('text.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

- Skriva till en fil:
```js
fs.writeFile('output.txt', 'Detta är en testfil.', (err) => {
  if (err) throw err;
  console.log('Filen har sparats!');
});
```

### http

Används för att skapa en HTTP-server.
```js
import { createServer } from 'http';

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(3000, () => {
  console.log('Servern körs på http://localhost:3000/');
});
```

### path

Används för att hantera fil- och sökvägar.
```js
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// I ES6 modules behöver vi skapa __dirname manuellt
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fullPath = path.join(__dirname, 'folder', 'file.txt');
console.log(fullPath);

// Alternativt, använd path.resolve för absoluta sökvägar
const absolutePath = path.resolve('folder', 'file.txt');
console.log(absolutePath);
```
### os

Ger information om operativsystemet.
```js
import os from 'os';

console.log('OS Platform:', os.platform());
console.log('CPU Architecture:', os.arch());
console.log('Total Memory:', os.totalmem());
```
## Event-driven programmering

Node.js är baserat på en event-driven arkitektur, vilket innebär att applikationen kan reagera på händelser utan att blockera huvudtråden.

TODO: Lägg till bild av - Illustration av Node.js Event Loop

## EventEmitter

EventEmitter är en klass i Node.js som tillåter skapandet och hanteringen av anpassade händelser.
```js
import { EventEmitter } from 'events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// Lyssna på en händelse
myEmitter.on('event', () => {
  console.log('En händelse inträffade!');
});

// Utlösa händelsen
myEmitter.emit('event');
```

**Praktiskt exempel med EventEmitter:**
```js
import { EventEmitter } from 'events';

class FileProcessor extends EventEmitter {
  processFile(filename) {
    this.emit('start', filename);
    
    // Simulera filbearbetning
    setTimeout(() => {
      this.emit('progress', 50);
      
      setTimeout(() => {
        this.emit('complete', filename);
      }, 1000);
    }, 1000);
  }
}

const processor = new FileProcessor();

processor.on('start', (filename) => {
  console.log(`Börjar bearbeta: ${filename}`);
});

processor.on('progress', (percent) => {
  console.log(`Framsteg: ${percent}%`);
});

processor.on('complete', (filename) => {
  console.log(`Klar med: ${filename}`);
});

processor.processFile('document.pdf');
```

## Asynkron programmering i Node.js

### Callbacks

Callbacks är funktioner som skickas som argument till andra funktioner och anropas när en viss operation är klar.
```js
function fetchData(callback) {
  setTimeout(() => {
    callback('Data hämtad');
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
```
### Promises

Promises underlättar hanteringen av asynkron kod genom att kedja operationer och hantera fel på ett mer strukturerat sätt.
```js
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data hämtad');
    }, 1000);
  });
}

fetchData()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
```

### Async/Await

Async/Await är syntaktiskt socker ovanpå Promises och gör asynkron kod ser synkron ut.
```js
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

getData();
```

## NPM – Node Package Manager

### Vad är NPM?

NPM är en pakethanterare för Node.js som låter dig installera och dela paket (bibliotek och moduler).

Installera paket

- Lokalt paket:
```bash
npm install package-name
```


- Globalt paket:

```bash
npm install -g package-name
```


### package.json

package.json är en fil som innehåller metadata om ditt projekt och dess beroenden.

För att skapa en package.json kan du använda:
```bash
npm init
```
Följ instruktionerna för att konfigurera ditt projekt.

## Skapa en CLI-applikation

Låt oss skapa en enkel kommandoradsapplikation som hälsar på användaren.
	1.	Skapa en fil kallad `greet.js`.
	2.	Skriv följande kod:
```js
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Vad heter du? ', (answer) => {
  console.log(`Hej, ${answer}!`);
  rl.close();
});
```

3.	Kör applikationen:
```bash
node greet.js
```


## Debugging i Node.js

### console.log

Det enklaste sättet att debugga är att använda console.log() för att skriva ut variabler och meddelanden.
```js
const x = 5;
console.log('Värdet av x är:', x);
```
### Debugger

Node.js har en inbyggd debugger som du kan använda genom att starta din applikation med --inspect flaggan.
```bash
node --inspect app.js
```
Du kan sedan ansluta till debuggern via Chrome DevTools genom att öppna chrome://inspect i Chrome.

## Best Practices

### Kodstruktur

- Moduler: Dela upp din kod i mindre, återanvändbara moduler.
- Mappar: Organisera filer i logiska mappar som controllers, models, views.

### Felhantering

- Använd try...catch block för att fånga synkrona fel.
- Hantera asynkrona fel i catch blocket när du använder Promises.
- Skapa en global felhanterare om möjligt.

### Prestandaoptimering

- Använd asynkrona metoder: För att undvika blockering av huvudtråden.
- Cache: Implementera caching där det är lämpligt.
- Strömlinjeforma kod: Undvik onödiga beräkningar och minnesanvändning.

## Praktiska övningar

### Övning 1: Filhantering

Skapa en applikation som läser från en textfil input.txt och skriver ut innehållet i terminalen.

```js
import fs from 'fs';

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Fel vid läsning av fil:', err.message);
    return;
  }
  console.log(data);
});
```

**Alternativ med Promises (rekommenderat):**
```js
import { readFile } from 'fs/promises';

try {
  const data = await readFile('input.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error('Fel vid läsning av fil:', err.message);
}
```

### Övning 2: Bygga en HTTP-server

Utveckla en enkel webbsida som serveras via Node.js inbyggda http-modul.
```js
import { createServer } from 'http';

const server = createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.write('<h1>Välkommen till min webbserver!</h1>');
  res.end();
});

server.listen(3000, () => {
  console.log('Servern körs på http://localhost:3000/');
});
```

**Utökad version med routing:**
```js
import { createServer } from 'http';
import { parse } from 'url';

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const path = parsedUrl.pathname;
  
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  
  switch (path) {
    case '/':
      res.write('<h1>Startsida</h1><p>Välkommen!</p>');
      break;
    case '/about':
      res.write('<h1>Om oss</h1><p>Detta är en enkel Node.js server.</p>');
      break;
    default:
      res.writeHead(404);
      res.write('<h1>404 - Sidan hittades inte</h1>');
  }
  
  res.end();
});

server.listen(3000, () => {
  console.log('Servern körs på http://localhost:3000/');
});
```
### Övning 3: Asynkron datahantering

Använd fs-modulen för att läsa och skriva data asynkront med Promises.

```js
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

async function processFiles() {
  try {
    // Kontrollera om filen finns
    if (!existsSync('input.txt')) {
      console.log('input.txt finns inte, skapar en ny fil...');
      await writeFile('input.txt', 'Detta är ursprungsdata\nRad 2\nRad 3');
    }
    
    // Läs från fil
    const data = await readFile('input.txt', 'utf8');
    console.log('Läst data:', data);
    
    // Bearbeta data (lägg till tidsstämpel)
    const processedData = data + `\nBearbetad: ${new Date().toISOString()}`;
    
    // Skriv till ny fil
    await writeFile('output.txt', processedData);
    console.log('Data har bearbetats och sparats till output.txt');
    
  } catch (error) {
    console.error('Fel vid filhantering:', error.message);
  }
}

processFiles();
```

**Bonus: Hantera flera filer parallellt**
```js
import { readFile, writeFile } from 'fs/promises';

async function processMultipleFiles() {
  const files = ['file1.txt', 'file2.txt', 'file3.txt'];
  
  try {
    // Läs alla filer parallellt
    const fileContents = await Promise.all(
      files.map(file => readFile(file, 'utf8').catch(() => `Fel: ${file} kunde inte läsas`))
    );
    
    // Kombinera innehållet
    const combined = fileContents.join('\n---\n');
    
    // Skriv till resultatfil
    await writeFile('combined.txt', combined);
    console.log('Alla filer har kombinerats till combined.txt');
    
  } catch (error) {
    console.error('Fel vid bearbetning:', error.message);
  }
}
```

## Sammanfattning

I denna introduktion har vi gått igenom grunderna i Node.js och fokuserat på moderna utvecklingsmetoder:

**Vad vi har lärt oss:**
- Node.js som JavaScript-runtime för serversidan
- Skillnaden mellan CommonJS och ES6 Modules
- Varför ES6 Modules är det moderna valet
- Inbyggda moduler som `fs`, `http`, `path` och `os`
- Event-driven programmering med EventEmitter
- Asynkron programmering med callbacks, Promises och async/await
- NPM för pakethantering
- Praktiska exempel och övningar

**Viktiga takeaways:**
- Använd ES6 Modules (`import`/`export`) för nya projekt
- Konfigurera `"type": "module"` i `package.json`
- Föredra `fs/promises` över callback-baserade fs-metoder
- Använd `async/await` för tydligare asynkron kod
- EventEmitter är kraftfullt för event-driven arkitektur
