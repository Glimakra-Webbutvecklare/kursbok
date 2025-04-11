# WebSockets

## Vad är WebSockets?
WebSockets är ett kommunikationsprotokoll som möjliggör dubbelriktad, fullständig kommunikation mellan en webbläsare (klient) och en server över en enda, långvarig anslutning. Till skillnad från traditionell HTTP, där klienten måste initiera varje förfrågan, kan både klient och server skicka data när som helst efter att anslutningen har etablerats.

## HTTP vs WebSockets
- **HTTP**:
  - Klient-initierad kommunikation
  - Ny anslutning för varje förfrågan
  - Stateless (tillståndslös)
  - Högre overhead för upprepade förfrågningar

- **WebSockets**:
  - Dubbelriktad kommunikation
  - Permanent anslutning
  - Stateful (tillståndsfull)
  - Minimal overhead efter initial anslutning
  - Realtidskommunikation

## Hur fungerar WebSockets?
1. **Handshake**: Klienten initierar en WebSocket-anslutning genom en HTTP-uppgradering
2. **Protokollbyte**: Efter lyckad handshake övergår kommunikationen till WebSocket-protokollet
3. **Dataöverföring**: Både klient och server kan skicka meddelanden när som helst
4. **Frames**: Data skickas i form av "frames" som kan innehålla text eller binär data

## Hur använder man WebSockets?
### Klientsidan (JavaScript):
```javascript
const socket = new WebSocket('ws://server.example.com');

socket.onopen = () => {
    console.log('Ansluten till servern');
    socket.send('Hej från klienten!');
};

socket.onmessage = (event) => {
    console.log('Meddelande från server:', event.data);
};

socket.onclose = () => {
    console.log('Anslutningen stängdes');
};
```

### Serversidan (Node.js exempel med ws):
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('Mottaget:', message);
        ws.send('Servern svarar!');
    });
});
```

## Exempel på WebSockets
Vanliga användningsområden inkluderar:
- Chatt-applikationer
- Realtidsspel
- Aktiekurser och finansiell data
- Kollaborativa redigeringsverktyg
- Live-uppdateringar på sociala medier
- IoT-enheter och sensorer

## Nackdelar med WebSockets
- Kräver mer serverresurser på grund av permanenta anslutningar
- Kan vara svårare att skala horisontellt
- Behöver hantera återanslutning vid nätverksproblem
- Mindre standardiserad caching jämfört med HTTP
- Kan kräva särskild konfiguration för proxies och lastbalanserare

## Alternativ till WebSockets
1. **Server-Sent Events (SSE)**
   - Enkelriktad server-till-klient kommunikation
   - Använder vanlig HTTP
   - Enklare att implementera

2. **Long Polling**
   - Klienten gör upprepade HTTP-förfrågningar
   - Fungerar med äldre webbläsare
   - Högre latens och overhead

3. **HTTP/2 Server Push**
   - Del av HTTP/2-standarden
   - Servern kan proaktivt skicka resurser
   - Begränsad till HTTP-semantik


