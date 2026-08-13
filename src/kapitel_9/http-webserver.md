# Bygg `portfolio-api` med Node HTTP

I [förra lektionen](node-intro.md) skapade du Node-projektet och körde
JavaScript utanför webbläsaren. Nu bygger du API:ets första riktiga server med
Node-modulen `node:http` – utan externa beroenden.

> **Mål:**  
> Förstå HTTP:s request–response-flöde och skapa `GET /api/health` samt
> `GET /api/projects` med korrekta statuskoder och JSON-headers.

## Förutsättningar

- Du arbetar i mappen `portfolio-api`.
- `package.json` har `"type": "module"` och skriptet
  `"dev": "node --watch src/server.js"`.
- Du har slutfört [introduktionen till Node.js](node-intro.md).

---

## 1. Request in, response ut

En HTTP-server upprepar samma flöde:

1. En klient, exempelvis `fetch()` eller `curl`, skickar en **request**.
2. Servern läser metod (`GET`) och URL (`/api/projects`).
3. Servern väljer statuskod, headers och body.
4. Servern avslutar sin **response**.

Några statuskoder vi behöver:

| Kod | Betydelse | När? |
| --- | --- | --- |
| `200` | OK | Resursen kunde hämtas |
| `404` | Not Found | Ingen route matchade |
| `405` | Method Not Allowed | URL:en finns, men metoden stöds inte |

Headern `Content-Type: application/json; charset=utf-8` berättar för klienten
hur svarets body ska tolkas.

---

## 2. Skapa servern

Ersätt innehållet i `src/server.js` med följande. Prefixet `node:` visar
tydligt att `http` är en inbyggd Node-modul.

```js
import { createServer } from 'node:http';

const PORT = Number(process.env.PORT) || 3000;

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

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(data));
}

export function requestHandler(request, response) {
  const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`);

  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, { status: 'ok' });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/projects') {
    sendJson(response, 200, projects);
    return;
  }

  const knownPath =
    url.pathname === '/api/health' || url.pathname === '/api/projects';

  if (knownPath) {
    response.setHeader('Allow', 'GET');
    sendJson(response, 405, { error: 'Metoden stöds inte' });
    return;
  }

  sendJson(response, 404, { error: 'Endpointen finns inte' });
}

export const server = createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Portfolio API körs på http://localhost:${PORT}`);
});
```

`requestHandler` är en vanlig funktion som exporteras separat. Det gör
routinglogiken möjlig att testa utan att duplicera den. `createServer`
anropar funktionen för varje request, och den exporterade `server`-instansen
kan senare stängas i automatiska tester.

`new URL()` skiljer sökvägen från exempelvis query-parametrar. Därför matchar
även `/api/projects?technology=JavaScript` samma route, även om vi inte
filtrerar ännu.

---

## 3. Starta servern

<!-- terminal -->
```bash
npm run dev
# Portfolio API körs på http://localhost:3000
```

> **Kör nu i din riktiga terminal:** Starta servern och låt terminalen vara öppen.

Processen avslutas inte, eftersom servern lyssnar efter fler requests.
`node --watch` startar om den när du sparar filen. Stoppa med `Ctrl+C`.

---

## 4. Testa med curl

Öppna en **andra terminal** i projektmappen medan servern kör.

<!-- terminal -->
```bash
curl -i http://localhost:3000/api/health
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
#
# {"status":"ok"}
```

> **Kör nu i din riktiga terminal:** Anropa `/api/health` och kontrollera statuskod och JSON.

Testa projektresursen:

<!-- terminal -->
```bash
curl -i http://localhost:3000/api/projects
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
#
# [{"id":1,"title":"Portfolio",...}]
```

> **Kör nu i din riktiga terminal:** Anropa `/api/projects` och kontrollera att arrayen innehåller två projekt.

Testa även ett kontrollerat fel:

<!-- terminal -->
```bash
curl -i http://localhost:3000/saknas
# HTTP/1.1 404 Not Found
#
# {"error":"Endpointen finns inte"}
```

> **Kör nu i din riktiga terminal:** Kontrollera att en okänd sökväg ger `404`.

Samma frontend-idé som i kapitel 5 fungerar nu mot ditt eget API:

```js
const response = await fetch('http://localhost:3000/api/projects');
const projects = await response.json();
```

Frontend på en annan origin behöver senare CORS-konfiguration. `curl` berörs
inte av webbläsarens CORS-regler.

---

## Vanliga misstag

- **`EADDRINUSE`:** port 3000 används redan. Stoppa den gamla processen eller
  välj en annan `PORT`.
- **Requesten laddar för alltid:** varje kodväg måste avslutas med
  `response.end()`; `sendJson` gör det åt oss.
- **Objekt ger fel:** HTTP skickar text eller bytes, så använd
  `JSON.stringify()` för JSON.
- **Fel Content-Type:** använd `application/json`, inte `text/html`.
- **Ändringar syns inte:** spara filen och kontrollera att watch-processen
  startade om.

---

## Checkpoint

- [ ] `GET /api/health` ger `200` och `{ "status": "ok" }`.
- [ ] `GET /api/projects` ger `200` och en JSON-array med två projekt.
- [ ] En okänd route ger `404` som JSON.
- [ ] Du kan peka ut request, response, statuskod, header och body.
- [ ] `requestHandler` och `server` exporteras med ES-modulsyntax.

Nästa lektion: [bygg om samma API med Express](expressjs.md).
