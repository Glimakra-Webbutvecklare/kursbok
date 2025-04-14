# Hämta Data med Fetch API

Nu när vi förstår Promises och `async/await`, kan vi titta på det moderna sättet att göra nätverksanrop (network requests) i JavaScript: **Fetch API**.

Fetch API är ett inbyggt gränssnitt i webbläsaren (och Node.js via externa bibliotek) som ger ett kraftfullt och flexibelt sätt att interagera med resurser över nätverket, oftast genom att hämta data från eller skicka data till ett webb-API (Application Programming Interface).

**Varför Fetch?**

*   **Modernt och Standard:** Det är det rekommenderade sättet att göra AJAX (Asynchronous JavaScript and XML) -liknande anrop idag, och ersätter den äldre `XMLHttpRequest`.
*   **Promise-baserat:** Det använder Promises naturligt, vilket gör det lätt att integrera med `async/await` och `.then()`/`.catch()`.
*   **Flexibelt:** Ger finmaskig kontroll över request (förfrågan) och response (svar).

## Grundläggande Användning: GET-Request

Den vanligaste användningen är att hämta data med en HTTP GET-metod. Detta görs enkelt genom att skicka URL:en till resursen som argument till `fetch()`.

```javascript
// URL till ett publikt API (JSONPlaceholder - simulerar en blogg)
const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';

console.log("Startar fetch-anrop...");

fetch(apiUrl)
  .then(response => {
    // Steg 1: Hantera HTTP-svaret
    console.log("Mottagit response:", response.status, response.statusText);

    // fetch() kastar inte automatiskt fel vid HTTP-fel (som 404 eller 500)
    // Vi måste kontrollera response.ok (true om status är 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Om svaret är OK, behöver vi konvertera body till det format vi vill ha,
    // oftast JSON. response.json() returnerar *också* ett Promise!
    return response.json();
  })
  .then(data => {
    // Steg 2: Hantera den parsade datan (nu ett JavaScript-objekt)
    console.log("Mottagen data:", data);
    // Gör något med datan, t.ex. visa den på sidan
    document.body.innerHTML += `<p>Titel: ${data.title}</p>`;
  })
  .catch(error => {
    // Hantera fel från nätverket eller från throw new Error ovan
    console.error("Fel vid fetch:", error);
    document.body.innerHTML += `<p style="color: red;">Kunde inte hämta data: ${error.message}</p>`;
  });

console.log("Fetch-anrop startat, väntar...");
```

**Viktiga Steg:**

1.  Anropa `fetch(url)`. Detta returnerar ett Promise som blir *fulfilled* så snart webbläsaren får tillbaka **headers** från servern.
2.  I första `.then()`, kontrollera `response.ok`. Om inte OK, kasta ett fel (`throw new Error(...)`) så att det fångas av `.catch()`.
3.  Om OK, använd en metod på `response`-objektet för att läsa **body** (själva datan). De vanligaste är:
    *   `response.json()`: Tolkar body som JSON och returnerar ett Promise som blir *fulfilled* med det parsade JavaScript-objektet.
    *   `response.text()`: Returnerar ett Promise som blir *fulfilled* med body som en textsträng.
    *   `response.blob()`: För binärdata (t.ex. bilder).
    *   `response.formData()`: För formulärdata.
4.  I nästa `.then()` hanterar du den faktiska datan (t.ex. det parsade JSON-objektet).
5.  Använd `.catch()` för att hantera eventuella nätverksfel (t.ex. ingen anslutning) eller de fel du själv kastade (t.ex. vid `response.ok === false`).

## Använda med Async/Await

Fetch blir ännu smidigare med `async/await`:

```javascript
async function getPost() {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';
  console.log("Startar async fetch...");
  try {
    const response = await fetch(apiUrl);
    console.log("Mottagit response (async):", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Vänta på att body ska läsas och parsas som JSON
    const data = await response.json();
    console.log("Mottagen data (async):", data);

    document.body.innerHTML += `<p>Titel (async): ${data.title}</p>`;

  } catch (error) {
    console.error("Fel vid async fetch:", error);
    document.body.innerHTML += `<p style="color: red;">Kunde inte hämta data (async): ${error.message}</p>`;
  }
}

getPost();
console.log("Async fetch startad, väntar...");
```

## Mer Avancerad Fetch: Options

`fetch()` kan ta ett andra argument, ett **options-objekt**, för att anpassa förfrågan. Detta är nödvändigt för andra HTTP-metoder (som POST, PUT, DELETE) eller för att skicka med data och headers.

```javascript
async function createPost(newPostData) {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  try {
    const response = await fetch(apiUrl, {
      method: 'POST', // Ange HTTP-metod
      headers: {
        'Content-Type': 'application/json' // Tala om att vi skickar JSON
        // Lägg till andra headers här om det behövs (t.ex. Authorization)
      },
      body: JSON.stringify(newPostData) // Konvertera JS-objekt till JSON-sträng
    });

    if (!response.ok) {
      // För POST kan man vilja läsa felmeddelande från servern
      const errorData = await response.json().catch(() => ({})); // Försök läsa fel, annars tomt objekt
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
    }

    // För POST (status 201 Created), får vi oftast tillbaka det skapade objektet
    const createdPost = await response.json();
    console.log('Skapad post:', createdPost);
    return createdPost;

  } catch (error) {
    console.error('Fel vid POST-request:', error);
    // Hantera felet, visa meddelande för användaren etc.
    throw error; // Kasta vidare om anroparen behöver veta
  }
}

// Exempel på användning
const myNewPost = {
  title: 'Min Nya Bloggpost',
  body: 'Detta är innehållet.',
  userId: 1
};

createPost(myNewPost)
  .then(post => console.log(`Post med id ${post.id} skapades.`))
  .catch(err => console.log("Kunde inte skapa post."));

```

**Vanliga Options:**

*   `method`: HTTP-metod ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', etc.). Standard är 'GET'.
*   `headers`: Ett objekt med HTTP-headers (nyckel-värde-par) att skicka med förfrågan. `'Content-Type': 'application/json'` är mycket vanlig när man skickar JSON-data.
*   `body`: Datan som ska skickas med förfrågan (t.ex. för POST eller PUT). Måste oftast vara en sträng (använd `JSON.stringify()` för objekt) eller `FormData`, `Blob`, etc.
*   `mode`: ('cors', 'no-cors', 'same-origin'). Styr hur Cross-Origin Resource Sharing (CORS) hanteras. 'cors' är standard och vanligast för API-anrop.
*   `credentials`: ('include', 'same-origin', 'omit'). Styr om cookies ska skickas med förfrågan.

Fetch API är ett kraftfullt verktyg för att bygga dynamiska webbapplikationer som interagerar med externa datakällor.
