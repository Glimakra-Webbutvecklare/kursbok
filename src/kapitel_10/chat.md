# Bygga en chattapplikation

## Introduktion
En chattapplikation är ett utmärkt exempel på realtidskommunikation på webben. Vi kommer att använda Socket.IO för att bygga en interaktiv chattapplikation med flera funktioner.

## Socket.IO Setup

### Installation
```bash
npm install socket.io
```

### Grundläggande konfiguration
```javascript
// Server
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('En användare anslöt');
});

http.listen(3000, () => {
  console.log('Server körs på port 3000');
});

// Klient
const socket = io('http://localhost:3000');
```

## Broadcast Messages
Broadcast-meddelanden låter oss skicka meddelanden till alla anslutna klienter.

```javascript
// Server
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Skickar till alla klienter
  });
});

// Klient
socket.emit('chat message', 'Hej alla!');
```

## Private Messaging
Privata meddelanden möjliggör kommunikation mellan specifika användare.

```javascript
// Server
io.on('connection', (socket) => {
  socket.on('private message', ({to, message}) => {
    socket.to(to).emit('private message', {
      from: socket.id,
      message
    });
  });
});
```

## Online Status
Hantering av användarstatus för att visa vilka som är online.

```javascript
// Server
const users = new Map();

io.on('connection', (socket) => {
  users.set(socket.id, { online: true });
  
  io.emit('users', Array.from(users.entries()));
  
  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('users', Array.from(users.entries()));
  });
});
```

## Praktisk Implementation

### Chattgränssnitt
```html
<div class="chat-container">
  <div class="users-list">
    <!-- Online användare visas här -->
  </div>
  <div class="chat-messages">
    <!-- Meddelanden visas här -->
  </div>
  <form class="message-form">
    <input type="text" id="message" placeholder="Skriv ett meddelande...">
    <button type="submit">Skicka</button>
  </form>
</div>
```

### Styling
```css
.chat-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  height: 100vh;
}

.users-list {
  background: #f5f5f5;
  padding: 1rem;
}

.chat-messages {
  padding: 1rem;
  overflow-y: auto;
}

.message-form {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 1rem;
}
```

## Best Practices
- Implementera felhantering för tappade anslutningar
- Använd throttling för att förhindra spam
- Implementera meddelandehistorik
- Säkerställ datavalidering
- Använd SSL för säker kommunikation

## Övning
Skapa en enkel chattapplikation med följande funktioner:
1. Användarregistrering med nickname
2. Allmän chatt där alla kan se meddelanden
3. Online-status för användare
4. Möjlighet att skicka privata meddelanden

För inspiration på hur man kan strukturera kod och hantera events, se exemplet på DOM-manipulation och events i:
```markdown:src/kapitel_4/dom-manipulation-events.md
startLine: 199
endLine: 214
```

För att hantera användarautentisering kan du använda liknande metoder som i demo-appen:
```markdown:src/kapitel_9/demo.md
startLine: 375
endLine: 389
```
