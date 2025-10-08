
# Bygga en webbserver med HTTP-modulen

Innan vi går vidare till Express.js, låt oss lära oss att bygga en komplett webbserver med Node.js inbyggda HTTP-modul. Detta ger dig en djupare förståelse för hur webbservrar fungerar.

## Steg 1: Grundläggande server

Låt oss börja med en enkel server som svarar på alla förfrågningar:

```js
import { createServer } from 'http';

const server = createServer((req, res) => {
  // Sätt status code och headers
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  
  // Skicka svar
  res.end('Hej från Node.js server!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});
```

## Steg 2: Hantera olika routes

Nu lägger vi till routing för att hantera olika URL:er. Vi behöver importera `url`-modulen för att parsa URL:er:

```js
import { parse } from 'url'; // Ny import

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  console.log(`${method} ${path}`); // Logga alla requests
  
  // Routing-logik
  if (path === '/' && method === 'GET') {
    res.statusCode = 200;
    res.end('Välkommen till startsidan!');
  } else if (path === '/about' && method === 'GET') {
    res.statusCode = 200;
    res.end('Om oss: Detta är en Node.js server');
  } else {
    res.statusCode = 404;
    res.end('404 - Sidan hittades inte');
  }
});
```

**Viktiga koncept:**
- `parse(req.url, true)` - Parsar URL:en och query parameters
- `pathname` - Sökvägen utan query parameters
- `method` - HTTP-metoden (GET, POST, etc.)

## Steg 3: Skicka HTML-innehåll från filer

Nu förbättrar vi servern för att skicka HTML-filer istället för inline HTML. Först skapar vi HTML-filer:

**Skapa följande filer:**
- `public/index.html` - Startsida med navigation
- `public/about.html` - Om oss-sida  
- `public/404.html` - Felsida

**Uppdaterad server-kod:**
```js
import { readFile } from 'fs/promises'; // Ny import för filläsning

const server = createServer(async (req, res) => { // Async för await
  const parsedUrl = parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  try {
    if (path === '/' && method === 'GET') {
      const html = await readFile('public/index.html', 'utf8');
      res.statusCode = 200;
      res.end(html);
    } else if (path === '/about' && method === 'GET') {
      const html = await readFile('public/about.html', 'utf8');
      res.statusCode = 200;
      res.end(html);
    } else {
      const html = await readFile('public/404.html', 'utf8');
      res.statusCode = 404;
      res.end(html);
    }
  } catch (error) {
    res.statusCode = 500;
    res.end('<h1>Serverfel</h1><p>Kunde inte läsa HTML-fil</p>');
  }
});
```

**Viktiga förändringar:**
- Servern är nu `async` för att hantera filläsning
- HTML-innehåll läses från externa filer
- Felhantering för filläsning med try/catch

## Steg 4: Skapa ett JSON API

Nu lägger vi till API-endpoints som returnerar JSON-data. Vi skapar en simulerad databas och API-routes:

**Lägg till simulerad data:**
```js
// Simulerad databas
const users = [
  { id: 1, name: 'Anna Andersson', email: 'anna@example.com', age: 28 },
  { id: 2, name: 'Erik Eriksson', email: 'erik@example.com', age: 32 }
];

const products = [
  { id: 1, name: 'Laptop', price: 15000, category: 'Electronics' },
  { id: 2, name: 'Bok', price: 299, category: 'Books' }
];
```

**API-routes (lägg till i routing-logiken):**
```js
// API Routes
if (path === '/api/users' && method === 'GET') {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({
    success: true,
    data: users,
    count: users.length
  }));
  
} else if (path.startsWith('/api/users/') && method === 'GET') {
  const userId = parseInt(path.split('/')[3]);
  const user = users.find(u => u.id === userId);
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = user ? 200 : 404;
  res.end(JSON.stringify({
    success: !!user,
    data: user,
    error: user ? undefined : 'Användare inte hittad'
  }));
  
} else if (path === '/api/products' && method === 'GET') {
  // Hantera query parameters för filtrering
  let filteredProducts = products;
  if (query.category) {
    filteredProducts = products.filter(p => 
      p.category.toLowerCase() === query.category.toLowerCase()
    );
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({
    success: true,
    data: filteredProducts,
    count: filteredProducts.length
  }));
}
```

**Viktiga API-koncept:**
- `Content-Type: application/json` för JSON-svar
- Konsekvent svarstruktur med `success`, `data`, `error`
- Query parameter-hantering för filtrering
- URL parameter-parsing för specifika resurser

## Steg 5: Hantera POST-data och filuppladdning

Detta är det mest komplexa steget där vi lär oss att hantera POST-requests, JSON-data och filuppladdningar. Vi delar upp det i flera substeg:

### 5.1: Förberedelser - Nya imports och setup

```js
import { writeFile, mkdir } from 'fs/promises'; // För filhantering
import { existsSync } from 'fs';
import path from 'path';

// Skapa uploads-mapp om den inte finns
if (!existsSync('uploads')) {
  await mkdir('uploads');
}

// Gör users-array mutable för POST-operationer
let users = [
  { id: 1, name: 'Anna Andersson', email: 'anna@example.com' },
  { id: 2, name: 'Erik Eriksson', email: 'erik@example.com' }
];
let nextUserId = 3;
```

### 5.2: Läsa request body för POST-data

HTTP POST-data kommer som en stream, så vi behöver en hjälpfunktion:

```js
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString(); // Lägg till varje chunk
    });
    
    req.on('end', () => {
      resolve(body); // Hela body är klar
    });
    
    req.on('error', reject); // Hantera fel
  });
}
```

**Varför behövs detta?**
- HTTP-data kommer i "chunks" (bitar)
- Vi måste vänta tills all data är mottagen
- Promises gör det enkelt att hantera asynkront

### 5.3: Hantera JSON POST-requests

Nu kan vi skapa användare via POST:

```js
// API: Skapa ny användare
if (path === '/api/users' && method === 'POST') {
  const body = await getRequestBody(req);
  const userData = JSON.parse(body); // Parsa JSON
  
  // Enkel validering
  if (!userData.name || !userData.email) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    res.end(JSON.stringify({
      success: false,
      error: 'Namn och e-post krävs'
    }));
    return;
  }
  
  // Skapa ny användare
  const newUser = {
    id: users.length, // Använd arrayens length för id generation
    name: userData.name,
    email: userData.email
  };
  
  users.push(newUser);
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 201; // Created
  res.end(JSON.stringify({
    success: true,
    data: newUser,
    message: 'Användare skapad'
  }));
}
```

**Viktiga delar:**
- `JSON.parse()` för att konvertera JSON-string till objekt
- Validering av inkommande data
- Status code 201 för "Created"
- Konsekvent API-svarstruktur

### 5.4: Förstå multipart/form-data

För filuppladdning använder webbläsare `multipart/form-data` format:

```
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="image"; filename="photo.jpg"
Content-Type: image/jpeg

[BINARY FILE DATA HERE]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

Vi behöver en parser för detta format:

```js
function parseMultipartData(body, boundary) {
  const parts = body.split('--' + boundary);
  const files = [];
  const fields = {};
  
  for (const part of parts) {
    if (part.includes('Content-Disposition')) {
      const lines = part.split('\r\n');
      const dispositionLine = lines.find(line => 
        line.includes('Content-Disposition')
      );
      
      if (dispositionLine) {
        const nameMatch = dispositionLine.match(/name="([^"]+)"/);
        const filenameMatch = dispositionLine.match(/filename="([^"]+)"/);
        
        if (filenameMatch && nameMatch) {
          // Detta är en fil
          const filename = filenameMatch[1];
          const fieldName = nameMatch[1];
          const contentTypeIndex = lines.findIndex(line => 
            line.includes('Content-Type')
          );
          const dataStartIndex = contentTypeIndex + 2;
          const fileData = lines.slice(dataStartIndex, -1).join('\r\n');
          
          files.push({ fieldName, filename, data: fileData });
        }
      }
    }
  }
  
  return { fields, files };
}
```

### 5.5: Implementera filuppladdning

```js
// API: Ladda upp bild
if (path === '/api/upload' && method === 'POST') {
  const contentType = req.headers['content-type'];
  
  if (contentType && contentType.includes('multipart/form-data')) {
    const boundary = contentType.split('boundary=')[1];
    const body = await getRequestBody(req);
    const { fields, files } = parseMultipartData(body, boundary);
    
    if (files.length > 0) {
      const uploadedFiles = [];
      
      for (const file of files) {
        // Validera filtyp
        const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif'];
        const fileExt = path.extname(file.filename).toLowerCase();
        
        if (!allowedTypes.includes(fileExt)) {
          res.statusCode = 400;
          res.end(JSON.stringify({
            success: false,
            error: 'Endast bildfiler tillåtna'
          }));
          return;
        }
        
        // Generera säkert filnamn
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.filename}`;
        const filepath = path.join('uploads', filename);
        
        // Spara fil
        await writeFile(filepath, file.data, 'binary');
        
        uploadedFiles.push({
          originalName: file.filename,
          filename: filename,
          url: `/uploads/${filename}`
        });
      }
      
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        files: uploadedFiles,
        message: 'Filer uppladdade'
      }));
    }
  }
}
```

### 5.6: Servera uppladdade filer

```js
// Servera uppladdade filer
if (path.startsWith('/uploads/') && method === 'GET') {
  const filename = path.split('/uploads/')[1];
  const filepath = `uploads/${filename}`;
  
  if (existsSync(filepath)) {
    const fileData = await readFile(filepath);
    const ext = path.extname(filename).toLowerCase();
    
    // Sätt rätt Content-Type för bilder
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    
    res.setHeader('Content-Type', contentType);
    res.statusCode = 200;
    res.end(fileData);
  } else {
    res.statusCode = 404;
    res.end('Fil inte hittad');
  }
}
```

### 5.7: Frontend-integration

Skapa `public/upload-demo.html` med formulär för att testa funktionaliteten:

```html
<!-- Formulär för användarregistrering -->
<form id="userForm">
  <input type="text" id="name" placeholder="Namn" required>
  <input type="email" id="email" placeholder="E-post" required>
  <button type="submit">Skapa användare</button>
</form>

<!-- Formulär för filuppladdning -->
<form id="uploadForm" enctype="multipart/form-data">
  <input type="file" id="imageFile" accept="image/*" required>
  <button type="submit">Ladda upp</button>
</form>

<script>
// JavaScript för att hantera formulär med fetch API
document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value
  };
  
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const result = await response.json();
  console.log(result);
});
</script>
```

## Viktiga lärdomar från HTTP-modulen

**Vad vi har lärt oss:**

1. **Grundläggande serverhantering**
   - Skapa server med `createServer()`
   - Hantera requests och responses asynkront
   - Sätta status codes och headers korrekt

2. **Routing och URL-hantering**
   - Parsa URL:er med `url.parse()`
   - Hantera olika HTTP-metoder (GET, POST)
   - Implementera grundläggande routing med if/else

3. **Filhantering och Content Types**
   - Läsa HTML-filer med `fs/promises`
   - Sätta rätt `Content-Type` för olika filtyper
   - Servera statiska filer säkert

4. **API-utveckling**
   - Skapa RESTful endpoints
   - Konsekvent JSON-svarstruktur
   - Hantera query parameters och URL-parametrar

5. **POST-data och filuppladdning**
   - Läsa request body som streams
   - Parsa JSON-data från POST-requests
   - Hantera multipart/form-data för filuppladdning
   - Validera och säkra filuppladdningar

6. **Felhantering och säkerhet**
   - Try/catch för asynkrona operationer
   - Validering av inkommande data
   - Säkra filnamn för uppladdningar

## Begränsningar med ren HTTP-modul

- **Mycket boilerplate-kod** för grundläggande funktionalitet
- **Ingen inbyggd middleware-support** för autentisering, logging, etc.
- **Komplicerad routing** för stora applikationer
- **Manuell hantering** av cookies, sessions, CORS
- **Ingen inbyggd säkerhet** mot vanliga attacker
- **Komplex multipart-parsing** som vi implementerade manuellt

## Varför Express.js är bättre

Detta är precis varför ramverk som **Express.js** existerar:

- **Enklare routing** med `app.get()`, `app.post()`, etc.
- **Inbyggd middleware** för vanliga uppgifter
- **Automatisk body-parsing** för JSON och multipart
- **Säkerhetsfeatures** och best practices
- **Plugin-ekosystem** för utökad funktionalitet

## Nästa steg

Nu förstår du hur HTTP-servrar fungerar under huven! Detta ger dig en solid grund för att:

1. **Uppskatta Express.js** - Du vet nu vad det abstraherar bort
2. **Felsöka bättre** - Du förstår vad som händer bakom kulisserna  
3. **Optimera prestanda** - Du kan identifiera flaskhalsar
4. **Bygga custom lösningar** när Express inte räcker till

**Gå vidare till Express.js-kapitlet** för att lära dig bygga webbapplikationer och API:er effektivt!
