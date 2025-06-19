# Bygga en chattapplikation

## Introduktion
En chattapplikation är ett utmärkt exempel på realtidskommunikation på webben. Vi kommer att använda native WebSockets för att bygga en interaktiv chattapplikation med flera funktioner.

## WebSocket Setup

### Installation
```bash
npm install ws
```

### Grundläggande konfiguration
```javascript
// Server (Node.js med ws library)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('En användare anslöt');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Mottaget meddelande:', data);
    
    // Broadcast till alla anslutna klienter
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
  
  ws.on('close', () => {
    console.log('En användare kopplades från');
  });
});

console.log('WebSocket server körs på port 3000');

// Klient
const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  console.log('Ansluten till servern');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Meddelande mottaget:', data);
};

socket.onclose = () => {
  console.log('Anslutningen stängdes');
};

socket.onerror = (error) => {
  console.log('WebSocket-fel:', error);
};
```

## Broadcast Messages
Broadcast-meddelanden låter oss skicka meddelanden till alla anslutna klienter.

```javascript
// Server
const users = new Map(); // Hålla koll på anslutna användare

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'chat_message') {
        // Skicka till alla anslutna klienter
        broadcastMessage(data);
      }
    } catch (error) {
      console.error('Fel vid parsning av meddelande:', error);
    }
  });
});

function broadcastMessage(messageData) {
  const messageString = JSON.stringify(messageData);
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
}

// Klient
function sendMessage(text) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'chat_message',
      message: text,
      timestamp: Date.now()
    }));
  }
}
```

## Private Messaging
Privata meddelanden möjliggör kommunikation mellan specifika användare.

```javascript
// Server
const connectedUsers = new Map(); // ws -> användarinfo

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'user_join') {
        // Registrera användare
        connectedUsers.set(ws, {
          id: data.userId,
          username: data.username
        });
      } else if (data.type === 'private_message') {
        // Skicka privat meddelande
        sendPrivateMessage(data.targetUserId, data.message, ws);
      }
    } catch (error) {
      console.error('Fel vid hantering av meddelande:', error);
    }
  });
  
  ws.on('close', () => {
    connectedUsers.delete(ws);
  });
});

function sendPrivateMessage(targetUserId, message, senderWs) {
  const sender = connectedUsers.get(senderWs);
  
  // Hitta målklienten
  for (const [clientWs, userInfo] of connectedUsers) {
    if (userInfo.id === targetUserId) {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({
          type: 'private_message',
          from: sender.username,
          message: message,
          timestamp: Date.now()
        }));
      }
      break;
    }
  }
}
```

## Online Status
Hantering av användarstatus för att visa vilka som är online.

```javascript
// Server
const onlineUsers = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'user_join') {
        onlineUsers.set(ws, {
          id: data.userId,
          username: data.username,
          joinedAt: Date.now()
        });
        
        // Skicka uppdaterad användarlista till alla
        broadcastUserList();
      }
    } catch (error) {
      console.error('Fel:', error);
    }
  });
  
  ws.on('close', () => {
    onlineUsers.delete(ws);
    broadcastUserList();
  });
});

function broadcastUserList() {
  const userList = Array.from(onlineUsers.values());
  const message = JSON.stringify({
    type: 'user_list',
    users: userList
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Klient
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'user_list') {
    updateUserList(data.users);
  }
};

function updateUserList(users) {
  const userListElement = document.getElementById('user-list');
  userListElement.innerHTML = '';
  
  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.textContent = user.username;
    userElement.classList.add('online-user');
    userListElement.appendChild(userElement);
  });
}
```

## Praktisk Implementation

### Chattgränssnitt
```html
<div class="chat-container">
  <div class="users-list">
    <h3>Online användare</h3>
    <div id="user-list">
      <!-- Online användare visas här -->
    </div>
  </div>
  <div class="chat-messages" id="chat-messages">
    <!-- Meddelanden visas här -->
  </div>
  <form class="message-form" id="message-form">
    <input type="text" id="message-input" placeholder="Skriv ett meddelande..." required>
    <button type="submit">Skicka</button>
  </form>
</div>
```

### Komplett klient-implementation
```javascript
class ChatClient {
  constructor() {
    this.socket = null;
    this.username = null;
    this.userId = null;
    this.setupEventListeners();
  }
  
  connect(username) {
    this.username = username;
    this.userId = Math.random().toString(36).substr(2, 9);
    
    this.socket = new WebSocket('ws://localhost:3000');
    
    this.socket.onopen = () => {
      console.log('Ansluten till chat');
      this.joinChat();
    };
    
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
    
    this.socket.onclose = () => {
      console.log('Frånkopplad från chat');
      this.displaySystemMessage('Anslutningen förlorad');
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket-fel:', error);
      this.displaySystemMessage('Fel vid anslutning');
    };
  }
  
  joinChat() {
    this.sendMessage({
      type: 'user_join',
      userId: this.userId,
      username: this.username
    });
  }
  
  sendMessage(messageData) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(messageData));
    }
  }
  
  sendChatMessage(text) {
    this.sendMessage({
      type: 'chat_message',
      message: text,
      username: this.username,
      timestamp: Date.now()
    });
  }
  
  handleMessage(data) {
    switch (data.type) {
      case 'chat_message':
        this.displayChatMessage(data.username, data.message);
        break;
      case 'user_list':
        this.updateUserList(data.users);
        break;
      case 'private_message':
        this.displayPrivateMessage(data.from, data.message);
        break;
    }
  }
  
  displayChatMessage(username, message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    const time = new Date().toLocaleTimeString();
    messageElement.innerHTML = `
      <span class="timestamp">${time}</span>
      <span class="username">${username}:</span>
      <span class="text">${message}</span>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  displaySystemMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('system-message');
    messageElement.textContent = message;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  setupEventListeners() {
    document.getElementById('message-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('message-input');
      const message = input.value.trim();
      
      if (message) {
        this.sendChatMessage(message);
        input.value = '';
      }
    });
  }
}

// Användning
const chatClient = new ChatClient();

// Anslut med användarnamn
function joinChat() {
  const username = document.getElementById('username-input').value.trim();
  if (username) {
    chatClient.connect(username);
  }
}
```

### Styling
```css
.chat-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr auto;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.users-list {
  background: #f5f5f5;
  padding: 1rem;
  border-right: 1px solid #ddd;
  grid-row: 1 / 3;
}

.users-list h3 {
  margin-top: 0;
  color: #666;
}

.online-user {
  padding: 0.5rem;
  margin: 0.25rem 0;
  background: #e8f5e8;
  border-radius: 4px;
  font-size: 0.9rem;
}

.chat-messages {
  padding: 1rem;
  overflow-y: auto;
  max-height: 70vh;
}

.message {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  background: #f9f9f9;
}

.timestamp {
  color: #999;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

.username {
  font-weight: bold;
  color: #2196F3;
  margin-right: 0.5rem;
}

.system-message {
  color: #666;
  font-style: italic;
  text-align: center;
  margin: 0.5rem 0;
}

.message-form {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #ddd;
  background: #fff;
}

.message-form input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
}

.message-form button {
  padding: 0.75rem 1.5rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message-form button:hover {
  background: #1976D2;
}
```

## Best Practices
- Implementera återanslutning (reconnection) för tappade anslutningar
- Använd throttling för att förhindra spam
- Implementera meddelandehistorik med databas
- Säkerställ datavalidering på både klient och server
- Använd SSL/TLS för säker kommunikation i produktion
- Hantera fel och edge cases gracefully

## Säkerhetsaspekter
- **Input validation**: Validera alla inkommande meddelanden
- **Rate limiting**: Begränsa antal meddelanden per användare
- **Sanitization**: Rensa användarinput för att förhindra XSS
- **Authentication**: Implementera användarautentisering
- **SSL/TLS**: Använd wss:// för krypterad kommunikation

## Övning
Skapa en enkel chattapplikation med följande funktioner:
1. Användarregistrering med nickname
2. Allmän chatt där alla kan se meddelanden
3. Online-status för användare
4. Möjlighet att skicka privata meddelanden
5. Meddelandehistorik som sparas i 24 timmar

För inspiration på hur man kan strukturera kod och hantera events, se exemplet på DOM-manipulation och events i kapitel 4.

För att hantera användarautentisering kan du använda liknande metoder som i demo-appen från kapitel 9.
