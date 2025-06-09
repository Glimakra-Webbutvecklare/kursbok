# Teknisk Intervju: Spelutveckling och WebSockets

Detta avsnitt innehåller grundläggande tekniska intervjufrågor för spelutveckling och realtidskommunikation på webben, anpassade för juniora utvecklare. Frågorna täcker Canvas grundläggande, enkel animation, WebSockets introduktion och grundläggande spelutveckling.

## Fråga 1: Canvas Grundläggande - Rita former

**Intervjuare:** "Förklara vad Canvas är och visa hur du ritar grundläggande former."

**Bra svar:**
```javascript
// HTML
// <canvas id="myCanvas" width="400" height="300"></canvas>

// Hämta canvas-elementet och dess 2D-kontext
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Rita en fylld rektangel
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 100, 80); // x, y, width, height

// Rita en cirkel
ctx.fillStyle = 'blue';
ctx.beginPath();
ctx.arc(200, 100, 40, 0, 2 * Math.PI); // x, y, radius, startAngle, endAngle
ctx.fill();

// Rita en linje
ctx.strokeStyle = 'green';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(50, 200); // Startpunkt
ctx.lineTo(300, 200); // Slutpunkt
ctx.stroke();

// Rita text
ctx.fillStyle = 'black';
ctx.font = '20px Arial';
ctx.fillText('Hej Canvas!', 100, 250);
```

**Förklaring:** 
- Canvas är ett HTML-element för att rita grafik med JavaScript
- `getContext('2d')` ger oss verktyg för 2D-ritning
- Koordinatsystemet börjar i övre vänstra hörnet (0,0)
- `fillRect()` ritar fyllda rektanglar, `arc()` ritar cirklar

## Fråga 2: Enkel Animation - Rörlig cirkel

**Intervjuare:** "Skapa en enkel animation där en cirkel rör sig över skärmen."

**Bra svar:**
```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Cirkelns egenskaper
let x = 50;      // Startposition x
let y = 150;     // Startposition y
let radius = 20; // Storlek
let speed = 2;   // Hastighet

function animate() {
    // Rensa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Rita cirkeln på ny position
    ctx.fillStyle = 'purple';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Uppdatera position
    x += speed;
    
    // Vänd när cirkeln når kanten
    if (x > canvas.width - radius || x < radius) {
        speed = -speed;
    }
    
    // Fortsätt animationen
    requestAnimationFrame(animate);
}

// Starta animationen
animate();
```

**Förklaring:**
- `clearRect()` rensar canvas innan vi ritar igen
- `requestAnimationFrame()` skapar smidig animation (ca 60 FPS)
- Vi uppdaterar positionen varje frame
- Enkel kollision med väggarna genom att vända hastigheten

## Fråga 3: Musinteraktion - Klicka för att rita

**Intervjuare:** "Lägg till musinteraktion så användaren kan rita genom att klicka och dra."

**Bra svar:**
```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;

// När musen trycks ner
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    
    // Få musposition relativt canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Starta ny linje
    ctx.beginPath();
    ctx.moveTo(x, y);
});

// När musen rör sig
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    // Få musposition
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Rita linje till ny position
    ctx.lineTo(x, y);
    ctx.stroke();
});

// När musen släpps
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

// Rita utanför canvas
canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

// Inställningar för pennan
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;
ctx.lineCap = 'round';
```

**Förklaring:**
- `getBoundingClientRect()` ger oss musposition relativt canvas
- Vi använder en flagga `isDrawing` för att veta när vi ska rita
- `moveTo()` flyttar pennan utan att rita
- `lineTo()` ritar linje från förra positionen

## Fråga 4: Enkel Kollisiondetektering

**Intervjuare:** "Skapa två rektanglar och kontrollera om de kolliderar."

**Bra svar:**
```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Första rektangeln (spelare)
const player = {
    x: 50,
    y: 50,
    width: 60,
    height: 60,
    color: 'blue'
};

// Andra rektangeln (fiende)
const enemy = {
    x: 200,
    y: 100,
    width: 40,
    height: 40,
    color: 'red'
};

// Funktion för att kontrollera kollision
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Funktion för att rita en rektangel
function drawRect(rect) {
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

// Styrning med tangentbord
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function update() {
    // Flytta spelaren med pilar
    if (keys['ArrowUp']) player.y -= 3;
    if (keys['ArrowDown']) player.y += 3;
    if (keys['ArrowLeft']) player.x -= 3;
    if (keys['ArrowRight']) player.x += 3;
    
    // Kontrollera kollision
    const collision = checkCollision(player, enemy);
    
    // Ändra färg vid kollision
    if (collision) {
        enemy.color = 'yellow';
    } else {
        enemy.color = 'red';
    }
    
    // Rita allt
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(player);
    drawRect(enemy);
    
    // Visa kollisionsstatus
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(collision ? 'KOLLISION!' : 'Flytta med pilarna', 10, 20);
    
    requestAnimationFrame(update);
}

update();
```

**Förklaring:**
- Kollision mellan rektanglar kontrolleras genom att jämföra deras kanter
- Vi använder event listeners för tangentbordsinput
- Färgen ändras för att visa kollision visuellt

## Fråga 5: Introduktion till WebSockets

**Intervjuare:** "Förklara skillnaden mellan HTTP och WebSockets och visa en enkel WebSocket-anslutning."

**Bra svar:**
```javascript
// HTTP - En-vägs kommunikation
// Klienten frågar, servern svarar, sedan stängs anslutningen

// WebSockets - Tvåvägs kommunikation
// Anslutningen hålls öppen, båda kan skicka meddelanden när som helst

// Enkelt WebSocket-exempel
const socket = new WebSocket('ws://localhost:8080');

// När anslutningen öppnas
socket.onopen = function() {
    console.log('Ansluten till servern!');
    
    // Skicka ett meddelande
    socket.send('Hej från klienten!');
};

// När vi får ett meddelande från servern
socket.onmessage = function(event) {
    console.log('Meddelande från server:', event.data);
    
    // Visa meddelandet på sidan
    const messageDiv = document.getElementById('messages');
    messageDiv.innerHTML += '<p>' + event.data + '</p>';
};

// Om anslutningen stängs
socket.onclose = function() {
    console.log('Anslutningen stängdes');
};

// Om det blir fel
socket.onerror = function(error) {
    console.log('WebSocket fel:', error);
};

// Skicka meddelande med knapp
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    
    if (message && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        input.value = ''; // Rensa input
    }
}
```

**Förklaring:**
- HTTP: Klient skickar förfrågan → Server svarar → Anslutning stängs
- WebSocket: Anslutning hålls öppen → Båda kan skicka när som helst
- WebSockets är bra för chat, spel och realtidsuppdateringar

## Fråga 6: Enkel Chat med WebSockets

**Intervjuare:** "Skapa en grundläggande chattapplikation med WebSockets."

**Bra svar:**
```javascript
// HTML struktur behövs:
// <input type="text" id="usernameInput" placeholder="Ditt namn...">
// <button onclick="connect()">Anslut</button>
// <input type="text" id="messageInput" placeholder="Skriv meddelande..." disabled>
// <button onclick="sendMessage()" disabled id="sendBtn">Skicka</button>
// <div id="messages"></div>

let socket = null;
let username = '';

// Anslut till WebSocket-server
function connect() {
    username = document.getElementById('usernameInput').value.trim();
    
    if (!username) {
        alert('Skriv ditt namn först!');
        return;
    }
    
    // Skapa WebSocket-anslutning
    socket = new WebSocket('ws://localhost:8080');
    
    // När anslutningen öppnas
    socket.onopen = function() {
        console.log('Ansluten till chat!');
        
        // Aktivera chat-funktioner
        document.getElementById('messageInput').disabled = false;
        document.getElementById('sendBtn').disabled = false;
        
        // Skicka användarnamn till servern
        socket.send(JSON.stringify({
            type: 'join',
            username: username
        }));
        
        displaySystemMessage('Du är nu ansluten till chatten!');
    };
    
    // När vi får ett meddelande
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
            displayMessage(data.username, data.text);
        } else if (data.type === 'userJoined') {
            displaySystemMessage(data.username + ' gick med i chatten');
        } else if (data.type === 'userLeft') {
            displaySystemMessage(data.username + ' lämnade chatten');
        }
    };
    
    // Om anslutningen stängs
    socket.onclose = function() {
        displaySystemMessage('Anslutningen stängdes');
        document.getElementById('messageInput').disabled = true;
        document.getElementById('sendBtn').disabled = true;
    };
    
    // Om det blir fel
    socket.onerror = function(error) {
        console.log('WebSocket fel:', error);
        displaySystemMessage('Fel vid anslutning!');
    };
}

// Skicka meddelande
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'message',
            username: username,
            text: message
        }));
        input.value = '';
    }
}

// Visa meddelande på sidan
function displayMessage(username, text) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.innerHTML = '<strong>' + username + ':</strong> ' + text;
    messagesDiv.appendChild(messageElement);
    
    // Scrolla ner automatiskt
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Visa systemmeddelanden
function displaySystemMessage(text) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.style.color = 'gray';
    messageElement.style.fontStyle = 'italic';
    messageElement.textContent = text;
    messagesDiv.appendChild(messageElement);
}

// Skicka meddelande med Enter
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
```

**Server-exempel (Node.js med ws library):**
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const users = new Map(); // Spara anslutna användare

wss.on('connection', (ws) => {
    console.log('En användare anslöt');
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            if (message.type === 'join') {
                // Spara användarnamn
                users.set(ws, message.username);
                
                // Meddela andra att användaren gick med
                broadcast({
                    type: 'userJoined',
                    username: message.username
                }, ws);
                
            } else if (message.type === 'message') {
                // Skicka meddelandet till alla
                broadcast({
                    type: 'message',
                    username: message.username,
                    text: message.text
                });
            }
        } catch (error) {
            console.log('Fel vid parsning:', error);
        }
    });
    
    ws.on('close', () => {
        const username = users.get(ws);
        if (username) {
            users.delete(ws);
            
            // Meddela andra att användaren lämnade
            broadcast({
                type: 'userLeft',
                username: username
            }, ws);
        }
        console.log('En användare kopplades från');
    });
});

// Skicka meddelande till alla anslutna (utom avsändaren)
function broadcast(message, excludeSocket = null) {
    const messageString = JSON.stringify(message);
    
    wss.clients.forEach((client) => {
        if (client !== excludeSocket && client.readyState === WebSocket.OPEN) {
            client.send(messageString);
        }
    });
}

console.log('WebSocket server körs på port 8080');
```

**Förklaring:**
- WebSockets håller anslutningen öppen för tvåvägs kommunikation
- Vi skickar JSON-meddelanden med `socket.send()`
- Servern använder `broadcast()` för att skicka till alla anslutna
- `readyState` kontrollerar om anslutningen är öppen
- Enklare och mer grundläggande än Socket.IO

---

**Sammanfattning:**
- **Canvas** - HTML-element för att rita med JavaScript
- **Animation** - Använd `requestAnimationFrame()` för smidiga rörelser
- **Events** - Lyssna på mus och tangentbord för interaktion
- **Kollision** - Jämför position och storlek för att upptäcka kollisioner
- **WebSockets** - Tvåvägs kommunikation mellan klient och server
- **JSON-meddelanden** - Använd `JSON.stringify()` och `JSON.parse()` för att skicka data

