# RESTful API:er - Professionella Web-API:er

REST (Representational State Transfer) är en arkitekturstil för att designa webb-API:er som är intuitive, skalbar och enkla att använda. RESTful API:er har blivit standarden för modern webbutveckling och är fundamentala för att skapa robusta backend-tjänster.

## Vad är en RESTful API?

REST är en uppsättning designprinciper som definierar hur webb-API:er ska struktureras:

- **Stateless**: Varje request innehåller all information som behövs
- **Client-Server Architecture**: Tydlig separation mellan klient och server
- **Cacheable**: Responses kan cachas för bättre prestanda
- **Uniform Interface**: Konsekvent sätt att interagera med resurser
- **Layered System**: Arkitekturen kan ha flera lager
- **Code on Demand** (valfritt): Servern kan skicka körbar kod

### REST vs Andra API-stilar

```javascript
// REST - Resursbaserat
GET    /api/users           // Hämta alla användare
GET    /api/users/123       // Hämta specifik användare
POST   /api/users           // Skapa ny användare
PUT    /api/users/123       // Uppdatera användare
DELETE /api/users/123       // Ta bort användare

// RPC-stil (Remote Procedure Call) - Funktionsbaserat
POST /api/getUsers
POST /api/createUser
POST /api/updateUser
POST /api/deleteUser

// GraphQL - Query-baserat
POST /api/graphql
{
  query: "{ users { id name email } }"
}
```

## HTTP-metoder och deras användning

Varje HTTP-metod har ett specifikt syfte i RESTful design. Låt oss gå igenom varje metod steg för steg.

### GET - Hämta data

GET används för att hämta data från servern. Det är en **säker** metod - den ändrar aldrig data, bara läser.

#### Steg 1: Grundläggande GET

Låt oss börja enkelt. Skapa en route som hämtar alla böcker från databasen.

```javascript
app.get('/api/books', async (req, res) => {
  // TODO: Hämta alla böcker från databasen
  // Tips: Använd Book.find() utan parametrar
  
  // TODO: Returnera böckerna som JSON
  // Tips: Använd res.json()
  
  // TODO: Lägg till felhantering
  // Tips: Använd try/catch och returnera status 500 vid fel
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta böcker' });
  }
});
```

**Förklaring:**
- `Book.find()` hämtar alla dokument från Book-kollektionen
- `res.json()` skickar tillbaka data som JSON
- try/catch hanterar eventuella fel från databasen

</details>

#### Steg 2: Hämta specifik resurs

Nu ska du lägga till stöd för att hämta en specifik bok baserat på ID.

```javascript
app.get('/api/books/:id', async (req, res) => {
  // TODO: Hämta ID från URL-parametern
  // Tips: Använd req.params.id
  
  // TODO: Hitta boken med detta ID
  // Tips: Använd Book.findById()
  
  // TODO: Om boken inte finns, returnera 404
  // Tips: Kontrollera om resultatet är null
  
  // TODO: Om boken finns, returnera den
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Fel vid hämtning av bok' });
  }
});
```

**Förklaring:**
- `:id` i routen blir tillgängligt via `req.params.id`
- `findById()` returnerar `null` om dokumentet inte finns
- Statuskod 404 betyder "Not Found"

</details>

#### Steg 3: Filtrera med query parameters

Query parameters låter klienten filtrera resultatet. Du ska stödja filtrering efter kategori och författare.

```javascript
app.get('/api/books', async (req, res) => {
  // TODO: Hämta query parameters för category och author
  // Tips: Använd req.query
  
  // TODO: Skapa ett filter-objekt
  // Tips: Lägg bara till filter om parametern finns
  
  // TODO: För author, använd case-insensitive sökning
  // Tips: Använd new RegExp(author, 'i')
  
  // TODO: Hämta böcker med filtret
  // Tips: Book.find(filter)
  
  // TODO: Returnera filtrerade böcker
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.get('/api/books', async (req, res) => {
  const { category, author } = req.query;
  
  const filter = {};
  if (category) filter.category = category;
  if (author) filter.author = new RegExp(author, 'i');
  
  try {
    const books = await Book.find(filter);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Förklaring:**
- Query parameters finns i `req.query`
- `RegExp` med flaggan 'i' gör sökningen case-insensitive
- Filter-objektet är tomt om inga parametrar skickas (hämtar då alla)

</details>

#### Steg 4: Implementera paginering

Lägg till stöd för paginering med `page` och `limit` query parameters.

```javascript
app.get('/api/books', async (req, res) => {
  // TODO: Hämta page och limit från query parameters
  // Tips: Sätt default-värden (page = 1, limit = 10)
  
  // TODO: Beräkna skip-värde
  // Tips: skip = (page - 1) * limit
  
  // TODO: Hämta böcker med limit och skip
  // Tips: Book.find().skip().limit()
  
  // TODO: Hämta totalt antal böcker
  // Tips: Book.countDocuments()
  
  // TODO: Returnera böcker med pagination-info
  // Tips: Inkludera page, limit, total, pages
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.get('/api/books', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  
  try {
    const [books, total] = await Promise.all([
      Book.find().skip(skip).limit(parseInt(limit)),
      Book.countDocuments()
    ]);
    
    res.json({
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Förklaring:**
- `skip()` hoppar över dokument
- `limit()` begränsar antalet resultat
- `Promise.all()` kör flera queries parallellt
- Pagination-info hjälper klienten navigera

</details>

### POST - Skapa ny resurs

POST används för att skapa nya resurser. Vi behöver validera input och hantera fel.

#### Steg 1: Grundläggande POST-route

```javascript
app.post('/api/books', async (req, res) => {
  // TODO: Hämta data från request body
  // Tips: req.body innehåller skickad JSON
  
  // TODO: Kontrollera att title och author finns
  // Tips: Returnera 400 Bad Request om de saknas
  
  // TODO: Skapa ny bok
  // Tips: new Book({ ... }) sedan .save()
  
  // TODO: Returnera den skapade boken med status 201
  // Tips: res.status(201).json()
  
  // TODO: Lägg till felhantering
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.post('/api/books', async (req, res) => {
  try {
    const { title, author } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ 
        error: 'Titel och författare krävs' 
      });
    }
    
    const book = new Book({
      title: title.trim(),
      author: author.trim()
    });
    
    const savedBook = await book.save();
    res.status(201).json(savedBook);
    
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte skapa bok' });
  }
});
```

**Förklaring:**
- Status 201 betyder "Created"
- `.trim()` tar bort extra mellanslag
- `.save()` sparar till databasen

</details>

#### Steg 2: Lägg till konfliktkontroll

Förbättra din POST-route genom att kontrollera om ISBN redan finns.

```javascript
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn } = req.body;
    
    // TODO: Om isbn finns i req.body, kontrollera om det redan finns
    // Tips: Använd Book.findOne({ isbn })
    
    // TODO: Om det finns, returnera status 409 Conflict
    // Tips: Inkludera ett lämpligt felmeddelande
    
    // TODO: Annars fortsätt med att skapa boken
  } catch (error) {
    // TODO: Hantera valideringsfel
    // Tips: Kontrollera error.name === 'ValidationError'
  }
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, category } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ 
        error: 'Titel och författare krävs' 
      });
    }
    
    if (isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(409).json({ 
          error: 'En bok med detta ISBN finns redan' 
        });
      }
    }
    
    const book = new Book({
      title: title.trim(),
      author: author.trim(),
      isbn,
      publishedYear,
      category
    });
    
    const savedBook = await book.save();
    
    res.status(201)
       .location(`/api/books/${savedBook._id}`)
       .json(savedBook);
       
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Valideringsfel',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ error: 'Kunde inte skapa bok' });
  }
});
```

**Förklaring:**
- Status 409 betyder "Conflict" - resursen finns redan
- `Location` header visar var den nya resursen finns
- ValidationError hanteras separat för bättre felmeddelanden

</details>

### PUT - Uppdatera hel resurs

PUT används för att ersätta en hel resurs. Alla fält måste skickas med.

#### Övning: Implementera PUT

```javascript
app.put('/api/books/:id', async (req, res) => {
  // TODO: Hämta ID från req.params
  // TODO: Hämta data från req.body
  // TODO: Validera att title och author finns (returnera 400 om ej)
  // TODO: Uppdatera boken med findByIdAndUpdate
  // Tips: Använd { new: true, runValidators: true }
  // TODO: Uppdatera updatedAt till new Date()
  // TODO: Om boken inte finns, returnera 404
  // TODO: Returnera den uppdaterade boken
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.put('/api/books/:id', async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, category } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ 
        error: 'Titel och författare krävs' 
      });
    }
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        author: author.trim(),
        isbn,
        publishedYear,
        category,
        updatedAt: new Date()
      },
      { 
        new: true, // Returnera uppdaterat dokument
        runValidators: true // Kör schemavalidering
      }
    );
    
    if (!updatedBook) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    
    res.json(updatedBook);
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Valideringsfel',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ error: 'Kunde inte uppdatera bok' });
  }
});
```

**Förklaring:**
- PUT ersätter hela resursen (till skillnad från PATCH som uppdaterar delvis)
- `new: true` returnerar det uppdaterade dokumentet istället för det gamla
- `runValidators: true` säkerställer att schemat valideras

</details>

### PATCH - Delvis uppdatering

PATCH används för att uppdatera endast de fält som skickas med.

#### Övning: Implementera PATCH

```javascript
app.patch('/api/books/:id', async (req, res) => {
  // TODO: Definiera vilka fält som får uppdateras
  // Tips: Skapa en array med tillåtna fält
  
  // TODO: Filtrera req.body så endast tillåtna fält ingår
  // Tips: Loopa över Object.keys(req.body)
  
  // TODO: Kontrollera att minst ett fält ska uppdateras
  // Tips: Returnera 400 om updates är tomt
  
  // TODO: Lägg till updatedAt
  // TODO: Uppdatera med findByIdAndUpdate
  // Tips: Använd { $set: updates }
  // TODO: Returnera uppdaterad bok eller 404
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.patch('/api/books/:id', async (req, res) => {
  try {
    const allowedUpdates = ['title', 'author', 'isbn', 'publishedYear', 'category'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        error: 'Inga giltiga fält att uppdatera' 
      });
    }
    
    updates.updatedAt = new Date();
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    
    res.json(updatedBook);
    
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte uppdatera bok' });
  }
});
```

**Förklaring:**
- `$set` i MongoDB uppdaterar endast de angivna fälten
- `allowedUpdates` förhindrar att användaren uppdaterar skyddade fält
- PATCH är mer flexibel än PUT eftersom bara vissa fält behöver skickas

</details>

### DELETE - Ta bort resurs

DELETE används för att ta bort resurser från systemet.

#### Övning: Implementera DELETE

```javascript
app.delete('/api/books/:id', async (req, res) => {
  // TODO: Hämta ID från req.params
  // TODO: Ta bort boken med findByIdAndDelete
  // TODO: Om boken inte finns, returnera 404
  // TODO: Om boken togs bort, returnera status 204
  // Tips: 204 No Content har ingen body
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.delete('/api/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    
    if (!deletedBook) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    
    res.status(204).send();
    
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte ta bort bok' });
  }
});
```

**Förklaring:**
- Status 204 betyder "No Content" - operationen lyckades men inget returneras
- `.send()` utan argument skickar en tom response

</details>

#### Extra: Bulk delete

Om du behöver ta bort flera resurser samtidigt:

```javascript
app.delete('/api/books', async (req, res) => {
  // TODO: Hämta array med IDs från req.body
  // TODO: Validera att ids är en array
  // TODO: Ta bort alla böcker med dessa IDs
  // Tips: Använd deleteMany med { _id: { $in: ids } }
  // TODO: Returnera antal borttagna böcker
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.delete('/api/books', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ 
        error: 'IDs måste vara en array' 
      });
    }
    
    const result = await Book.deleteMany({ 
      _id: { $in: ids } 
    });
    
    res.json({ 
      message: `${result.deletedCount} böcker borttagna`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte ta bort böcker' });
  }
});
```

**Förklaring:**
- `$in` är en MongoDB-operator som matchar värden i en array
- `deleteMany` returnerar information om hur många som togs bort

</details>

## HTTP-statuskoder

Statuskoder är viktiga för att kommunicera resultatet av en request. De är indelade i kategorier:

- **2xx**: Success (framgång)
- **4xx**: Client Error (fel i request)
- **5xx**: Server Error (fel på servern)

### Övning: Välj rätt statuskod

För varje scenario nedan, välj vilken statuskod som är lämplig:

1. En användare skapas framgångsrikt
   - [ ] 200 OK
   - [ ] 201 Created
   - [ ] 204 No Content

2. En bok tas bort framgångsrikt
   - [ ] 200 OK
   - [ ] 201 Created
   - [ ] 204 No Content

3. En bok med ID 123 finns inte
   - [ ] 400 Bad Request
   - [ ] 404 Not Found
   - [ ] 500 Internal Server Error

4. En request saknar required fält
   - [ ] 400 Bad Request
   - [ ] 404 Not Found
   - [ ] 422 Unprocessable Entity

5. En användare försöker skapa en bok med ISBN som redan finns
   - [ ] 400 Bad Request
   - [ ] 409 Conflict
   - [ ] 422 Unprocessable Entity

<details>
<summary>Svar</summary>

1. **201 Created** - Används när en ny resurs skapas framgångsrikt
2. **204 No Content** - Används vid DELETE när operationen lyckades men ingen data returneras
3. **404 Not Found** - Resursen som efterfrågas finns inte
4. **400 Bad Request** eller **422 Unprocessable Entity** - Båda är acceptabla, 422 är mer specifik för valideringsfel
5. **409 Conflict** - Resursen finns redan (konflikt)

</details>

### Vanliga statuskoder

Här är en översikt över vanliga statuskoder du kommer använda:

```javascript
// Success codes (2xx)
res.status(200).json(data);        // OK - lyckad GET, PUT, PATCH
res.status(201).json(newResource); // Created - lyckad POST
res.status(204).send();            // No Content - lyckad DELETE

// Client error codes (4xx)
res.status(400).json({ error: 'Bad Request - fel input' });
res.status(401).json({ error: 'Unauthorized - autentisering krävs' });
res.status(403).json({ error: 'Forbidden - otillåten åtkomst' });
res.status(404).json({ error: 'Not Found - resurs finns inte' });
res.status(409).json({ error: 'Conflict - resurs finns redan' });
res.status(422).json({ error: 'Unprocessable Entity - valideringsfel' });

// Server error codes (5xx)
res.status(500).json({ error: 'Internal Server Error' });
res.status(503).json({ error: 'Service Unavailable' });
```

### Övning: Implementera felhantering

Skapa en hjälpfunktion `sendError` som gör felhanteringen mer konsekvent.

```javascript
// TODO: Skriv funktionen sendError
const sendError = (res, statusCode, message, details = null) => {
  // TODO: Skapa ett error-objekt med message
  // TODO: Lägg till details om det finns
  // TODO: Returnera med rätt statuskod
};
```

<details>
<summary>Lösningsförslag</summary>

```javascript
const sendError = (res, statusCode, message, details = null) => {
  const error = { error: message };
  if (details) error.details = details;
  res.status(statusCode).json(error);
};

// Användning:
sendError(res, 400, 'Valideringsfel', ['Title krävs', 'Author krävs']);
sendError(res, 404, 'Bok inte hittad');
```

**Förklaring:**
- Denna funktion gör felhanteringen mer konsekvent
- `details` är valfritt och kan innehålla mer specifik information
- Används för att undvika repetition i koden

</details>

## Designprinciper för RESTful API:er

### 1. Använd substantiv, inte verb

REST API:er arbetar med **resurser**, inte **åtgärder**. HTTP-metoden säger vad vi gör, URL:en säger med vad.

#### Övning: Identifiera felaktiga routes

Vilka av dessa routes följer inte REST-principerna? Förbättra dem.

```javascript
GET    /api/getUsers        // ❌
POST   /api/createUser      // ❌
GET    /api/userById        // ❌
DELETE /api/removeUser/:id  // ❌
```

<details>
<summary>Rätt svar</summary>

```javascript
GET    /api/users           // ✅
POST   /api/users           // ✅
GET    /api/users/:id       // ✅
DELETE /api/users/:id       // ✅
```

**Regel:** URL:en ska vara ett substantiv (resurs), inte ett verb (åtgärd). HTTP-metoden (GET, POST, PUT, DELETE) indikerar åtgärden.

</details>

### 2. Hierarkiska resurser

När en resurs hör till en annan, reflektera det i URL-strukturen.

#### Övning: Designa routes för användare och inlägg

En användare har flera inlägg. Designa routes för att:
- Hämta alla inlägg för en specifik användare
- Skapa ett nytt inlägg för en användare
- Hämta ett specifikt inlägg
- Uppdatera ett inlägg
- Ta bort ett inlägg

Skriv dina förslag här:

```
// TODO: Skriv dina routes här
```

<details>
<summary>Lösningsförslag</summary>

```javascript
GET    /api/users/123/posts          // Användarens inlägg
POST   /api/users/123/posts          // Skapa inlägg för användare
GET    /api/users/123/posts/456      // Specifikt inlägg
PUT    /api/users/123/posts/456      // Uppdatera inlägg
DELETE /api/users/123/posts/456      // Ta bort inlägg
```

**Implementation:**
```javascript
app.get('/api/users/:userId/posts', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Förklaring:**
- Nested routes visar relationen mellan resurser
- `:userId` och `:postId` är route-parametrar
- Filteret `{ author: req.params.userId }` säkerställer att endast användarens inlägg hämtas

</details>

### 3. Filtrera, sortera och paginera

Query parameters ger flexibilitet utan att ändra URL-strukturen.

#### Övning: Implementera avancerad filtrering

Implementera en GET-route som stödjer:
- Filtrering efter kategori
- Prisintervall (minPrice, maxPrice)
- Sökning i namn och beskrivning
- Sortering efter valfritt fält
- Paginering

```javascript
app.get('/api/products', async (req, res) => {
  // TODO: Extrahera alla query parameters
  // TODO: Bygg filter för category, price range, och search
  // Tips: Använd $or för search, $gte och $lte för price
  // TODO: Bygg sort-objekt
  // TODO: Implementera pagination
  // TODO: Returnera produkter med pagination-info
});
```

<details>
<summary>Lösningsförslag</summary>

```javascript
app.get('/api/products', async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    sortBy = 'name',
    order = 'asc',
    page = 1,
    limit = 20,
    search
  } = req.query;
  
  try {
    const filter = {};
    if (category) filter.category = category;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;
    
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter)
    ]);
    
    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        category,
        priceRange: { min: minPrice, max: maxPrice },
        search
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Förklaring:**
- `$gte` (greater than or equal) och `$lte` (less than or equal) för prisintervall
- `$or` låter dig söka i flera fält samtidigt
- `hasNext` och `hasPrev` hjälper klienten veta om det finns fler sidor

</details>

## Bygga ett RESTful API med Express

Vi ska bygga ett komplett API för en bokhandel steg för steg.

### Steg 1: Projektstruktur och grundläggande setup

Skapa en ny Express-applikation och konfigurera grundläggande middleware.

```javascript
// TODO: Importera express och mongoose
// TODO: Skapa app-instans
// TODO: Konfigurera JSON-middleware
// Tips: app.use(express.json())
```

<details>
<summary>Lösningsförslag</summary>

```javascript
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
```

**Förklaring:**
- `express.json()` middleware parsar JSON från request body
- Detta behövs för POST och PUT requests

</details>

### Steg 2: Skapa Book-modellen

Definiera ett Mongoose-schema för böcker.

```javascript
// TODO: Skapa bookSchema med följande fält:
// - title (String, required, trimmed)
// - author (String, required, trimmed)
// - isbn (String, unique, optional)
// - publishedYear (Number, 1000 till nuvarande år)
// - category (Enum: 'fiction', 'non-fiction', etc., required)
// - price (Number, required, min 0)
// - inStock (Boolean, default true)
// - description (String, optional)
// - createdAt och updatedAt (Date, defaults)
// TODO: Skapa Book-modellen från schemat
```

<details>
<summary>Lösningsförslag</summary>

```javascript
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, unique: true, sparse: true },
  publishedYear: { 
    type: Number, 
    min: 1000, 
    max: new Date().getFullYear() 
  },
  category: { 
    type: String, 
    enum: ['fiction', 'non-fiction', 'science', 'history', 'biography'],
    required: true 
  },
  price: { type: Number, required: true, min: 0 },
  inStock: { type: Boolean, default: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);
```

**Förklaring:**
- `trim: true` tar bort extra mellanslag automatiskt
- `unique: true, sparse: true` gör ISBN unikt men tillåter null
- `enum` begränsar vilka värden som är tillåtna
- `default` sätter värden automatiskt om de inte anges

</details>

### Steg 3: Implementera GET /api/books med alla funktioner

Nu ska du implementera en komplett GET-route med filtrering, sortering och paginering.

```javascript
// TODO: Skapa en metod getAllBooks som hanterar:
// - Filtrering (category, author, search, price range, inStock)
// - Sortering (sortBy, order)
// - Paginering (page, limit)
// - Returnera med pagination-info
```

<details>
<summary>Lösningsförslag</summary>

```javascript
const getAllBooks = async (req, res) => {
  try {
    const { 
      category, 
      author, 
      minPrice, 
      maxPrice, 
      inStock,
      search,
      sortBy = 'title',
      order = 'asc',
      page = 1,
      limit = 10 
    } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (author) filter.author = new RegExp(author, 'i');
    if (inStock !== undefined) filter.inStock = inStock === 'true';
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };
    const skip = (page - 1) * limit;
    
    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Book.countDocuments(filter)
    ]);
    
    res.json({
      books,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta böcker' });
  }
};
```

</details>

### Steg 4: Validering med express-validator

Använd middleware för validering istället för manuell kontroll.

```javascript
// TODO: Importera body och validationResult från express-validator
// TODO: Skapa validateBook middleware-array med valideringar:
// - title: notEmpty, trim, isLength 1-200
// - author: notEmpty, trim, isLength 1-100
// - isbn: optional, isISBN
// - publishedYear: optional, isInt 1000-nuvarande år
// - category: isIn enum-värden
// - price: isFloat min 0
// - description: optional, isLength max 1000
// TODO: Skapa handleValidation middleware som kontrollerar errors
```

<details>
<summary>Lösningsförslag</summary>

```javascript
import { body, validationResult } from 'express-validator';

const validateBook = [
  body('title').notEmpty().trim().isLength({ min: 1, max: 200 }),
  body('author').notEmpty().trim().isLength({ min: 1, max: 100 }),
  body('isbn').optional().isISBN(),
  body('publishedYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }),
  body('category').isIn(['fiction', 'non-fiction', 'science', 'history', 'biography']),
  body('price').isFloat({ min: 0 }),
  body('description').optional().isLength({ max: 1000 })
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Valideringsfel',
      details: errors.array()
    });
  }
  next();
};
```

**Förklaring:**
- `express-validator` ger kraftfulla valideringsfunktioner
- `validationResult` samlar alla valideringsfel
- Middleware kan användas på flera routes

</details>

### Steg 5: Komplett API-struktur

Nu ska du sätta ihop allt: routes, error handling, och health check.

```javascript
// TODO: Skapa alla routes för books (GET, GET by id, POST, PUT, DELETE)
// Tips: Skapa funktioner för getAllBooks, getBookById, createBook, updateBook, deleteBook
// TODO: Lägg till health check endpoint
// TODO: Lägg till 404 handler för /api/* routes
// TODO: Lägg till global error handler
// TODO: Exportera app
```

<details>
<summary>Lösningsförslag</summary>

```javascript
// Controller functions
const getAllBooks = async (req, res) => {
  // ... (se tidigare implementation)
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta bok' });
  }
};

const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201)
       .location(`/api/books/${savedBook._id}`)
       .json(savedBook);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'ISBN finns redan' });
    }
    res.status(500).json({ error: 'Kunde inte skapa bok' });
  }
};

const updateBook = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte uppdatera bok' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Bok inte hittad' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte ta bort bok' });
  }
};

// API Routes
app.get('/api/books', getAllBooks);
app.get('/api/books/:id', getBookById);
app.post('/api/books', validateBook, handleValidation, createBook);
app.put('/api/books/:id', validateBook, handleValidation, updateBook);
app.delete('/api/books/:id', deleteBook);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint finns inte' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Något gick fel!' });
});

export default app;
```

**Förklaring:**
- Funktionsbaserade controllers är enklare än klasser för REST routes
- Health check används för att verifiera att API:et är igång
- 404 handler fångar alla okända API-routes
- Global error handler fångar oväntade fel
- Middleware körs i ordning deklarerats

</details>

## API-dokumentation och testning

### OpenAPI/Swagger dokumentation

OpenAPI (tidigare Swagger) är ett standardformat för att dokumentera REST API:er.

```javascript
/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Hämta alla böcker
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrera efter kategori
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Sidnummer för pagination
 *     responses:
 *       200:
 *         description: Lista av böcker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   type: object
 */
```

### Testning med cURL

cURL är ett verktyg för att testa API:er från kommandoraden.

```bash
# Hämta alla böcker
curl -X GET "http://localhost:3000/api/books"

# Hämta böcker med filter
curl -X GET "http://localhost:3000/api/books?category=fiction&page=1&limit=5"

# Skapa ny bok
curl -X POST "http://localhost:3000/api/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "category": "fiction",
    "price": 199,
    "publishedYear": 1949
  }'

# Uppdatera bok
curl -X PUT "http://localhost:3000/api/books/BOOK_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984 - Updated",
    "author": "George Orwell",
    "category": "fiction",
    "price": 249,
    "publishedYear": 1949
  }'

# Ta bort bok
curl -X DELETE "http://localhost:3000/api/books/BOOK_ID"
```

## Best Practices för RESTful API:er

### 1. Rate Limiting

Rate limiting skyddar ditt API från överbelastning och missbruk.

#### Övning: Implementera rate limiting

```javascript
// TODO: Importera express-rate-limit
// TODO: Skapa en limiter med:
// - windowMs: 15 minuter
// - max: 100 requests per IP
// - Ett passande felmeddelande
// TODO: Applicera på /api/ routes
```

<details>
<summary>Lösningsförslag</summary>

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuter
  max: 100, // Max 100 requests per IP
  message: {
    error: 'För många förfrågningar, försök igen senare'
  }
});

app.use('/api/', limiter);
```

**Förklaring:**
- `windowMs` definierar tidsfönstret
- `max` är max antal requests inom fönstret
- Rate limiting skyddar mot DDoS-attacker och missbruk

</details>

### 2. CORS-hantering

CORS (Cross-Origin Resource Sharing) behövs när frontend och backend körs på olika domäner.

#### Övning: Konfigurera CORS

```javascript
// TODO: Importera cors
// TODO: Konfigurera CORS med:
// - Tillåtna origins (localhost:3000 och din produktionsdomain)
// - Tillåtna metoder (GET, POST, PUT, DELETE)
// - Tillåtna headers (Content-Type, Authorization)
// TODO: Applicera på app
```

<details>
<summary>Lösningsförslag</summary>

```javascript
import cors from 'cors';

app.use(cors({
  origin: ['http://localhost:3000', 'https://myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Förklaring:**
- CORS måste konfigureras korrekt för att frontend ska kunna anropa API:et
- `origin` specificerar vilka domäner som tillåts
- `methods` och `allowedHeaders` begränsar vad som är tillåtet

</details>

### 3. Säkerhet

Säkerhet är kritiskt för produktions-API:er.

#### Övning: Lägg till säkerhetsheaders

```javascript
// TODO: Importera helmet
// TODO: Applicera helmet middleware
// TODO: Begränsa JSON body size till 10mb
// Tips: Använd express.json({ limit: '10mb' })
```

<details>
<summary>Lösningsförslag</summary>

```javascript
import helmet from 'helmet';

app.use(helmet()); // Säkerhetshuvuden
app.use(express.json({ limit: '10mb' })); // Begränsa request size
```

**Förklaring:**
- `helmet` lägger till säkerhetsheaders automatiskt
- Body size limit skyddar mot stora requests som kan överbelasta servern
- Dessa är grundläggande säkerhetsåtgärder som bör vara standard

</details>

### Vanliga misstag

1. **Glömma felhantering:** Alltid använd try/catch i async routes
2. **Felaktig 404-hantering:** Kontrollera om resultatet är null innan du använder det
3. **Exponera interna fel:** Skicka inte `error.message` direkt till klienten i produktion
4. **Glömma validering:** Validera alltid användarinput
5. **Sakna rate limiting:** Låt inte en användare överbelasta ditt API

## Sammanfattning

RESTful API:er ger dig en solid grund för att bygga skalbara och underhållbara backend-tjänster. Genom att följa REST-principerna skapar du API:er som är intuitiva för utvecklare att använda och enkla att underhålla över tid.

### Viktiga takeaways:

- **HTTP-metoder** har specifika syften (GET=hämta, POST=skapa, PUT=ersätta, PATCH=uppdatera, DELETE=ta bort)
- **Statuskoder** kommunicerar resultatet tydligt
- **Resursbaserade URL:er** gör API:et intuitivt
- **Validering och felhantering** är kritiskt för robusthet
- **Best practices** (rate limiting, CORS, säkerhet) gör API:et produktionsklart

### Nästa steg:

- Lär dig om **autentisering och säkerhet** för att skydda dina API:er
- Implementera **testning** för dina API-endpoints
- Utforska **API-dokumentation** med Swagger/OpenAPI
