# Praktiska övningar

Detta kapitel innehåller många små övningar som täcker alla viktiga koncept inom webbaserad spelutveckling och WebSockets. Varje övning innehåller utförliga instruktioner om vad som behöver göras, så du kan lära dig steg för steg utan att bli överväldigad.

## Canvas API - Grundläggande ritning

### Övning 1: Rita en enkel cirkel
**Mål**: Lär dig använda Canvas API för att rita grundläggande former

**Instruktioner**: 
Skapa en HTML-fil med en canvas-element. I JavaScript ska du hämta canvas-elementet och få dess 2D-ritkontext. Använd arc-metoden för att rita en cirkel i mitten av canvasen. Cirkeln ska ha en radie på 50 pixlar och vara fylld med blå färg. Canvasen ska vara 400x400 pixlar stor, och cirkeln ska placeras exakt i mitten (koordinater 200, 200).

<details>
<summary>Lösningsförslag</summary>

```html
<!DOCTYPE html>
<html>
<head>
    <title>Canvas Cirkel</title>
</head>
<body>
    <canvas id="myCanvas" width="400" height="400"></canvas>
    
    <script>
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        
        // Rita en cirkel
        ctx.beginPath();
        ctx.arc(200, 200, 50, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
    </script>
</body>
</html>
```
</details>

---

### Övning 2: Animera en boll
**Mål**: Använda requestAnimationFrame för animation

**Instruktioner**: 
Skapa en HTML-fil med en canvas. Implementera en animation-loop med requestAnimationFrame där en röd boll rör sig från vänster till höger över canvasen. Bollen ska ha en radie på 20 pixlar och röra sig med en konstant hastighet. Varje frame ska canvasen rensas innan bollen ritas på nytt. När bollen når högerkanten av canvasen ska den börja om från vänsterkanten. Animationen ska köras kontinuerligt.

<details>
<summary>Lösningsförslag</summary>

```html
<!DOCTYPE html>
<html>
<head>
    <title>Animerad Boll</title>
</head>
<body>
    <canvas id="myCanvas" width="800" height="400"></canvas>
    
    <script>
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        
        let x = 0;
        const speed = 2;
        
        function animate() {
            // Rensa canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Rita bollen
            ctx.beginPath();
            ctx.arc(x, 200, 20, 0, Math.PI * 2);
            ctx.fillStyle = 'red';
            ctx.fill();
            
            // Uppdatera position
            x += speed;
            
            // Börja om när bollen når kanten
            if (x > canvas.width) {
                x = 0;
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    </script>
</body>
</html>
```
</details>

---

### Övning 3: Rita en rektangel med tangentbordsinput
**Mål**: Hantera tangentbordsinput och uppdatera canvas

**Instruktioner**: 
Skapa en HTML-fil med en canvas och en röd rektangel som kan styras med tangentbordet. Rektangeln ska vara 50x50 pixlar stor och initialt placerad på position (100, 100). Implementera event listeners för keydown och keyup för att spåra vilka tangenter som hålls nedtryckta. Använd piltangenterna (ArrowUp, ArrowDown, ArrowLeft, ArrowRight) för att flytta rektangeln. Rektangeln ska inte kunna flyttas utanför canvasens gränser. Implementera en game loop som kontinuerligt uppdaterar rektangelns position baserat på vilka tangenter som är nedtryckta och sedan ritar om canvasen.

<details>
<summary>Lösningsförslag</summary>

```html
<!DOCTYPE html>
<html>
<head>
    <title>Rörlig Rektangel</title>
</head>
<body>
    <canvas id="myCanvas" width="800" height="400"></canvas>
    
    <script>
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        
        const rect = {
            x: 100,
            y: 100,
            width: 50,
            height: 50,
            speed: 5
        };
        
        const keys = {};
        
        document.addEventListener('keydown', (e) => {
            keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });
        
        function update() {
            if (keys['ArrowLeft'] && rect.x > 0) {
                rect.x -= rect.speed;
            }
            if (keys['ArrowRight'] && rect.x < canvas.width - rect.width) {
                rect.x += rect.speed;
            }
            if (keys['ArrowUp'] && rect.y > 0) {
                rect.y -= rect.speed;
            }
            if (keys['ArrowDown'] && rect.y < canvas.height - rect.height) {
                rect.y += rect.speed;
            }
        }
        
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'red';
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        }
        
        function gameLoop() {
            update();
            render();
            requestAnimationFrame(gameLoop);
        }
        
        gameLoop();
    </script>
</body>
</html>
```
</details>

---

### Övning 4: Skapa en enkel partikeleffekt
**Mål**: Hantera flera objekt samtidigt

**Instruktioner**: 
Skapa en HTML-fil med en canvas och implementera ett partikelsystem med 20 partiklar. Varje partikel ska vara en blå cirkel som faller från toppen av canvasen. Partiklarna ska ha olika hastigheter (slumpmässigt mellan 1-4 pixlar per frame) och olika storlekar (slumpmässigt mellan 2-7 pixlar radie). Varje partikel ska starta på en slumpmässig x-position längs canvasens bredd. När en partikel når botten av canvasen ska den börja om från toppen på en ny slumpmässig x-position. Skapa en Particle-klass med update- och render-metoder. I game loopen ska alla partiklar uppdateras och ritas varje frame.

<details>
<summary>Lösningsförslag</summary>

```html
<!DOCTYPE html>
<html>
<head>
    <title>Partiklar</title>
</head>
<body>
    <canvas id="myCanvas" width="800" height="400"></canvas>
    
    <script>
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = 0;
                this.speed = Math.random() * 3 + 1;
                this.size = Math.random() * 5 + 2;
            }
            
            update() {
                this.y += this.speed;
                
                // Börja om när partikeln når botten
                if (this.y > canvas.height) {
                    this.y = 0;
                    this.x = Math.random() * canvas.width;
                }
            }
            
            render() {
                ctx.fillStyle = 'blue';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        const particles = [];
        for (let i = 0; i < 20; i++) {
            particles.push(new Particle());
        }
        
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.render();
            });
            
            requestAnimationFrame(gameLoop);
        }
        
        gameLoop();
    </script>
</body>
</html>
```
</details>

---

## OOP för spel

### Övning 5: Skapa en GameObject-klass
**Mål**: Förstå grundläggande OOP-struktur för spel

**Instruktioner**: 
Skapa en GameObject-klass i JavaScript som fungerar som basklass för alla objekt i spelet. Klassen ska ha en konstruktor som tar emot x, y, width och height som parametrar och sparar dessa som instansvariabler. Klassen ska ha två metoder: en update-metod som tar deltaTime som parameter (men som standard inte gör något) och en render-metod som tar en canvas context som parameter. Render-metoden ska rita en grå rektangel på objektets position med objektets storlek. Testa klassen genom att skapa en instans och anropa render-metoden med en canvas context.

<details>
<summary>Lösningsförslag</summary>

```javascript
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    update(deltaTime) {
        // Grundläggande update-logik
    }
    
    render(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Test
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const obj = new GameObject(100, 100, 50, 50);
obj.render(ctx);
```
</details>

---

### Övning 6: Skapa en Player-klass som ärver från GameObject
**Mål**: Förstå arv i JavaScript

**Instruktioner**: 
Skapa en Player-klass som ärver från GameObject-klassen från övning 5. Player-klassen ska i sin konstruktor anropa super-konstruktorn med x, y och fasta värden för width och height (t.ex. 40x40). Lägg till två nya instansvariabler: health (satt till 100) och score (satt till 0). Överskriv render-metoden så att spelaren ritas som en blå rektangel istället för grå. Lägg också till en health-bar som ritas ovanför spelaren som en röd rektangel vars bredd är proportionell mot health-värdet. Skapa en takeDamage-metod som tar en amount-parameter och minskar health med det värdet, men säkerställ att health aldrig går under 0.

<details>
<summary>Lösningsförslag</summary>

```javascript
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    update(deltaTime) {}
    
    render(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 40, 40);
        this.health = 100;
        this.score = 0;
    }
    
    render(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Visa health
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 10, this.health / 2, 5);
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
        }
    }
}

// Test
const player = new Player(100, 100);
player.takeDamage(30);
console.log(player.health); // 70
```
</details>

---

### Övning 7: Implementera kollisionsdetektering
**Mål**: Förstå AABB (Axis-Aligned Bounding Box) kollision

**Instruktioner**: 
Lägg till en collidesWith-metod i GameObject-klassen som tar ett annat GameObject som parameter och returnerar true om de två objekten kolliderar, annars false. Använd AABB (Axis-Aligned Bounding Box) kollisionsdetektering, vilket innebär att du kontrollerar om rektanglarna överlappar varandra. Två rektanglar kolliderar om den vänstra kanten av den ena är till vänster om den högra kanten av den andra, och vice versa, samt om den övre kanten av den ena är ovanför den nedre kanten av den andra, och vice versa. Metoden ska returnera true om alla dessa villkor är uppfyllda. Testa metoden genom att skapa två GameObject-instanser och kontrollera om de kolliderar.

<details>
<summary>Lösningsförslag</summary>

```javascript
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
    
    render(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Test
const obj1 = new GameObject(100, 100, 50, 50);
const obj2 = new GameObject(120, 120, 50, 50);

if (obj1.collidesWith(obj2)) {
    console.log('Kollision!');
}
```
</details>

---

### Övning 8: Skapa en Enemy-klass med AI
**Mål**: Implementera enkel AI-beteende

**Instruktioner**: 
Skapa en Enemy-klass som ärver från GameObject. I konstruktorn ska den ta emot x, y och ett target-objekt (t.ex. en Player-instans). Lägg till en speed-egenskap (t.ex. 50 pixlar per sekund). Överskriv update-metoden så att fienden automatiskt rör sig mot target-objektet. Beräkna riktningen genom att hitta skillnaden i x- och y-koordinater mellan fienden och målet. Normalisera riktningsvektorn genom att dividera med avståndet (använd Pythagoras sats för att beräkna avståndet). Multiplicera den normaliserade riktningen med speed och deltaTime (konverterat till sekunder) för att uppdatera fiendens position. Överskriv render-metoden så att fienden ritas som en röd rektangel. I game loopen ska fienden uppdateras med deltaTime varje frame.

<details>
<summary>Lösningsförslag</summary>

```javascript
class Enemy extends GameObject {
    constructor(x, y, target) {
        super(x, y, 30, 30);
        this.target = target;
        this.speed = 50; // pixels per sekund
    }
    
    update(deltaTime) {
        if (!this.target) return;
        
        const dt = deltaTime / 1000; // konvertera till sekunder
        
        // Beräkna riktning mot målet
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Normalisera och multiplicera med hastighet
            this.x += (dx / distance) * this.speed * dt;
            this.y += (dy / distance) * this.speed * dt;
        }
    }
    
    render(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Användning i game loop
let lastTime = 0;
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    enemy.update(deltaTime);
    enemy.render(ctx);
    
    requestAnimationFrame(gameLoop);
}
```
</details>

---

## Game Loop och Animation

### Övning 9: Skapa en grundläggande game loop
**Mål**: Förstå hur en game loop fungerar

**Instruktioner**: 
Skapa en Game-klass som hanterar hela spelets game loop. Klassen ska ha en konstruktor som hämtar canvas-elementet och dess 2D-context, samt initialiserar en running-flagga (satt till true) och lastTime-variabel (satt till 0). Skapa en gameLoop-metod som använder requestAnimationFrame och tar currentTime som parameter. I gameLoop ska du beräkna deltaTime genom att subtrahera lastTime från currentTime, och sedan uppdatera lastTime. Anropa en update-metod med deltaTime som parameter, och sedan en render-metod. Render-metoden ska först rensa canvasen med clearRect. Om running är true, anropa requestAnimationFrame igen med gameLoop. Skapa en start-metod som initierar game loopen och en stop-metod som sätter running till false.

<details>
<summary>Lösningsförslag</summary>

```javascript
class Game {
    constructor() {
        this.running = true;
        this.lastTime = 0;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
    }
    
    gameLoop = (currentTime) => {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        if (this.running) {
            requestAnimationFrame(this.gameLoop);
        }
    }
    
    update(deltaTime) {
        // Uppdatera spellogik här
    }
    
    render() {
        // Rensa canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Rita spelet här
    }
    
    start() {
        requestAnimationFrame(this.gameLoop);
    }
    
    stop() {
        this.running = false;
    }
}

// Starta spelet
const game = new Game();
game.start();
```
</details>

---

### Övning 10: Implementera FPS-räknare
**Mål**: Förstå performance-mätning

**Instruktioner**: 
Lägg till FPS-räkning i Game-klassen från övning 9. Skapa instansvariabler för frameCount (satt till 0), fps (satt till 0) och fpsUpdateTime (satt till 0). I gameLoop-metoden, öka frameCount med 1 och lägg till deltaTime till fpsUpdateTime. När fpsUpdateTime når eller överstiger 1000 millisekunder (1 sekund), sätt fps till frameCount, nollställ frameCount och fpsUpdateTime. I render-metoden, rita FPS-värdet på canvasen med fillText. Använd en tydlig font (t.ex. '20px Arial') och vit färg, och placera texten i övre vänstra hörnet (t.ex. position 10, 30).

<details>
<summary>Lösningsförslag</summary>

```javascript
class Game {
    constructor() {
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.fpsUpdateTime = 0;
    }
    
    gameLoop = (currentTime) => {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Uppdatera FPS varje sekund
        this.fpsUpdateTime += deltaTime;
        this.frameCount++;
        
        if (this.fpsUpdateTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsUpdateTime = 0;
        }
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(this.gameLoop);
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Visa FPS
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 30);
    }
}
```
</details>

---

## WebSockets - Grundläggande

### Övning 11: Skapa en enkel WebSocket-anslutning
**Mål**: Förstå grundläggande WebSocket-anslutning

**Instruktioner**: 
Skapa en HTML-sida med ett div-element för att visa anslutningsstatus och ett div-element för att visa mottagna meddelanden. I JavaScript, skapa en WebSocket-anslutning till 'ws://localhost:3000'. Implementera event handlers för WebSocket: när anslutningen öppnas (onopen), uppdatera status-div:en med texten "Ansluten!" och ändra färgen till grön. När ett meddelande tas emot (onmessage), skapa ett nytt div-element, sätt dess textContent till det mottagna meddelandet med prefix "Mottaget: ", och lägg till det i messages-div:en. När ett fel uppstår (onerror), uppdatera status-div:en med "Fel uppstod" och ändra färgen till röd, samt logga felet till konsolen. När anslutningen stängs (onclose), uppdatera status-div:en med "Frånkopplad" och ändra färgen till grå.

<details>
<summary>Lösningsförslag</summary>

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Test</title>
</head>
<body>
    <div id="status">Ansluter...</div>
    <div id="messages"></div>
    
    <script>
        const socket = new WebSocket('ws://localhost:3000');
        const statusDiv = document.getElementById('status');
        const messagesDiv = document.getElementById('messages');
        
        socket.onopen = () => {
            statusDiv.textContent = 'Ansluten!';
            statusDiv.style.color = 'green';
        };
        
        socket.onmessage = (event) => {
            const message = document.createElement('div');
            message.textContent = `Mottaget: ${event.data}`;
            messagesDiv.appendChild(message);
        };
        
        socket.onerror = (error) => {
            statusDiv.textContent = 'Fel uppstod';
            statusDiv.style.color = 'red';
            console.error('WebSocket error:', error);
        };
        
        socket.onclose = () => {
            statusDiv.textContent = 'Frånkopplad';
            statusDiv.style.color = 'gray';
        };
    </script>
</body>
</html>
```
</details>

---

### Övning 12: Skicka meddelanden via WebSocket
**Mål**: Förstå hur man skickar data via WebSocket

**Instruktioner**: 
Utöka HTML-sidan från övning 11 med ett formulär som innehåller ett textfält för meddelanden och en submit-knapp. Lägg till en event listener på formuläret för submit-händelsen. I event handler-funktionen, förhindra standardformulärbeteendet med preventDefault. Kontrollera att WebSocket-anslutningen är öppen (readyState === WebSocket.OPEN) och att textfältet inte är tomt. Om båda villkoren är uppfyllda, skicka textfältets värde via socket.send() och töm sedan textfältet. Behåll funktionaliteten från övning 11 så att mottagna meddelanden fortfarande visas i messages-div:en.

<details>
<summary>Lösningsförslag</summary>

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Chat</title>
</head>
<body>
    <div id="messages"></div>
    <form id="messageForm">
        <input type="text" id="messageInput" placeholder="Skriv ett meddelande...">
        <button type="submit">Skicka</button>
    </form>
    
    <script>
        const socket = new WebSocket('ws://localhost:3000');
        const messagesDiv = document.getElementById('messages');
        const messageForm = document.getElementById('messageForm');
        const messageInput = document.getElementById('messageInput');
        
        socket.onmessage = (event) => {
            const message = document.createElement('div');
            message.textContent = event.data;
            messagesDiv.appendChild(message);
        };
        
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (socket.readyState === WebSocket.OPEN && messageInput.value) {
                socket.send(messageInput.value);
                messageInput.value = '';
            }
        });
    </script>
</body>
</html>
```
</details>

---

### Övning 13: Skapa en enkel WebSocket-server
**Mål**: Förstå server-sidan av WebSockets

**Instruktioner**: 
Skapa en Node.js-server med Express och WebSocket-stöd. Använd express för att serva statiska filer från en 'public'-mapp. Skapa en HTTP-server med http.createServer och en WebSocket-server med WebSocket.Server som använder HTTP-servern. Implementera en connection-händelse på WebSocket-servern. När en klient ansluter, logga "Ny anslutning" till konsolen. Skicka ett välkomstmeddelande till klienten direkt efter anslutning. Implementera en message-händelse på WebSocket-anslutningen som loggar det mottagna meddelandet till konsolen och sedan skickar tillbaka meddelandet med prefix "Echo: ". Implementera en close-händelse som loggar "Anslutning stängd". Starta servern på port 3000. Skapa en package.json-fil och installera express och ws som dependencies.

<details>
<summary>Lösningsförslag</summary>

```javascript
// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('Ny anslutning');
    
    ws.on('message', (message) => {
        console.log('Mottaget:', message.toString());
        
        // Echo tillbaka meddelandet
        ws.send(`Echo: ${message.toString()}`);
    });
    
    ws.on('close', () => {
        console.log('Anslutning stängd');
    });
    
    // Skicka välkomstmeddelande
    ws.send('Välkommen till servern!');
});

server.listen(3000, () => {
    console.log('Server körs på port 3000');
});
```

Installera dependencies:
```bash
npm init -y
npm install express ws
```
</details>

---

### Övning 14: Broadcast meddelanden till alla klienter
**Mål**: Förstå hur man skickar meddelanden till alla anslutna klienter

**Instruktioner**: 
Modifiera WebSocket-servern från övning 13 så att när en klient skickar ett meddelande, skickas det till alla anslutna klienter (inklusive avsändaren). I message-händelsen, istället för att bara echoa tillbaka till avsändaren, loopa igenom alla klienter i wss.clients. För varje klient, kontrollera att dess readyState är WebSocket.OPEN innan du skickar meddelandet. Detta säkerställer att du bara skickar till aktiva anslutningar. Skicka det ursprungliga meddelandet (som sträng) till alla anslutna klienter. Behåll loggningen av mottagna meddelanden och close-händelsen från övning 13.

<details>
<summary>Lösningsförslag</summary>

```javascript
// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('Ny anslutning');
    
    ws.on('message', (message) => {
        console.log('Mottaget:', message.toString());
        
        // Broadcast till alla anslutna klienter
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
    
    ws.on('close', () => {
        console.log('Anslutning stängd');
    });
});

server.listen(3000, () => {
    console.log('Server körs på port 3000');
});
```
</details>

---

## Chat-applikationer

### Övning 15: Lägg till användarnamn i chatten
**Mål**: Förstå hur man hanterar användaridentitet i WebSocket-applikationer

**Instruktioner**: 
Modifiera både klienten och servern från övning 14 för att hantera användarnamn. På klienten, skapa ett inloggningsformulär med ett textfält för användarnamn och en knapp för att ansluta. Dölj chat-gränssnittet tills användaren har anslutit. När användaren klickar på anslut-knappen, skapa WebSocket-anslutningen. När anslutningen öppnas, skicka ett JSON-meddelande med typen 'setUsername' och användarnamnet. Visa sedan chat-gränssnittet och dölj inloggningsformuläret. När meddelanden skickas, skicka dem som JSON med typen 'message' och meddelandetexten. När meddelanden tas emot, parsa JSON och visa användarnamnet tillsammans med meddelandet. På servern, spara användarnamnet för varje WebSocket-anslutning (börja med 'Anonym' som standard). När ett meddelande med typen 'setUsername' tas emot, uppdatera användarnamnet och skicka ett välkomstmeddelande tillbaka. När ett meddelande med typen 'message' tas emot, broadcasta ett JSON-objekt som innehåller användarnamnet och meddelandetexten till alla klienter. I close-händelsen, logga användarnamnet när någon kopplar från.

<details>
<summary>Lösningsförslag</summary>

**Client-side (HTML/JavaScript)**:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Chat med Användarnamn</title>
</head>
<body>
    <div id="login">
        <input type="text" id="usernameInput" placeholder="Ange ditt namn...">
        <button id="connectBtn">Anslut</button>
    </div>
    
    <div id="chat" style="display: none;">
        <div id="messages"></div>
        <form id="messageForm">
            <input type="text" id="messageInput" placeholder="Skriv ett meddelande...">
            <button type="submit">Skicka</button>
        </form>
    </div>
    
    <script>
        let socket = null;
        let username = '';
        
        const loginDiv = document.getElementById('login');
        const chatDiv = document.getElementById('chat');
        const usernameInput = document.getElementById('usernameInput');
        const connectBtn = document.getElementById('connectBtn');
        const messagesDiv = document.getElementById('messages');
        const messageForm = document.getElementById('messageForm');
        const messageInput = document.getElementById('messageInput');
        
        connectBtn.addEventListener('click', () => {
            username = usernameInput.value.trim();
            if (username) {
                socket = new WebSocket('ws://localhost:3000');
                
                socket.onopen = () => {
                    // Skicka användarnamn till servern
                    socket.send(JSON.stringify({
                        type: 'setUsername',
                        username: username
                    }));
                    
                    loginDiv.style.display = 'none';
                    chatDiv.style.display = 'block';
                };
                
                socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    const message = document.createElement('div');
                    message.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
                    messagesDiv.appendChild(message);
                };
            }
        });
        
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (socket && socket.readyState === WebSocket.OPEN && messageInput.value) {
                socket.send(JSON.stringify({
                    type: 'message',
                    message: messageInput.value
                }));
                messageInput.value = '';
            }
        });
    </script>
</body>
</html>
```

**Server-side (Node.js)**:
```javascript
// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
    let username = 'Anonym';
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'setUsername') {
                username = data.username;
                ws.send(JSON.stringify({
                    type: 'system',
                    message: `Välkommen, ${username}!`
                }));
            } else if (data.type === 'message') {
                // Broadcast till alla klienter
                const broadcastData = {
                    type: 'message',
                    username: username,
                    message: data.message
                };
                
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(broadcastData));
                    }
                });
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log(`${username} kopplade från`);
    });
});

server.listen(3000, () => {
    console.log('Server körs på port 3000');
});
```
</details>