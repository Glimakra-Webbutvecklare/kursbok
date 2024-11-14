# Introduktion till Nodejs
## Vad är Node.js?
Node.js är en öppen källkod JavaScript-runtime-miljö som körs på serversidan. Den är byggd på Chrome’s V8 JavaScript-motor och möjliggör för utvecklare att köra JavaScript-kod utanför webbläsaren. Detta innebär att du kan bygga skalbara nätverksapplikationer och servrar med samma programmeringsspråk som du använder på klientsidan.

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

### Globala objekt

Node.js har flera globala objekt som är tillgängliga överallt i din applikation:
- global: Motsvarigheten till window i webbläsaren.
- process: Ger information om och kontroll över den aktuella Node.js-processen.
- __dirname: Ger den fullständiga sökvägen till den katalog där den aktuella filen befinner sig. (i CommonJS)
- __filename: Ger den fullständiga sökvägen till den aktuella filen. (i CommonJS)


### Importera moduler
Node.js använder modulsystemet CommonJS för att hantera beroenden som default. Det innebär att `require('packet-name')` används för att importera moduler:
```js
const fs = require('fs');
```
I modern Node.js (med ES6-stöd) kan du använda import:
```js
import fs from 'fs';
```
__Notera__ att för att använda import behöver du vanligtvis ställa in `"type": "module"` i din `package.json`.

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
const http = require('http');

const server = http.createServer((req, res) => {
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

const fullPath = path.join(__dirname, 'folder', 'file.txt');
console.log(fullPath);
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
const EventEmitter from events;

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// Lyssna på en händelse
myEmitter.on('event', () => {
  console.log('En händelse inträffade!');
});

// Utlösa händelsen
myEmitter.emit('event');
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

const fs from 'fs';

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

### Övning 2: Bygga en HTTP-server

Utveckla en enkel webbsida som serveras via Node.js inbyggda http-modul.
```js
const http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1>Välkommen till min webbserver!</h1>');
  res.end();
});

server.listen(3000, () => {
  console.log('Servern körs på http://localhost:3000/');
});
```
### Övning 3: Asynkron datahantering

Använd fs-modulen för att läsa och skriva data asynkront med Promises.

## Sammanfattning

I denna introduktion har vi gått igenom grunderna i Node.js, inklusive installation, grundläggande koncept, inbyggda moduler och asynkron programmering. Vi har också tittat på hur man använder NPM för att hantera paket och hur man kan skapa enkla applikationer både i terminalen och på webben.
