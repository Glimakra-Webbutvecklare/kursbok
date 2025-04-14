# Praktiska Övningar: Asynkron JavaScript och API-Anrop

Nu är det dags att praktisera de kraftfulla koncept vi har lärt oss i detta kapitel. Vi kommer att använda `fetch` för att hämta data från det publika test-API:et [JSONPlaceholder](https://jsonplaceholder.typicode.com/) och sedan bearbeta och visa den datan med hjälp av array-metoder och DOM-manipulation.

**Förutsättningar:**

*   En enkel HTML-fil (`index.html`) där du kan visa resultaten.
*   En länkad JavaScript-fil (`script.js`) där du skriver din kod.
*   Grundläggande kunskaper i DOM-manipulation (t.ex. `querySelector`, `createElement`, `textContent`, `appendChild`) från föregående kapitel.

**Tips:** Använd `async/await` för att hantera dina `fetch`-anrop, då det ofta ger mer läsbar kod. Glöm inte `try...catch` för felhantering!

## Övning 1: Hämta och Visa Användare

**Mål:** Hämta en lista med användare från JSONPlaceholder och visa deras namn i en lista på webbsidan.

1.  **Skapa HTML-struktur:** Lägg till en `<ul>`-tagg i din `index.html` med ett id, t.ex. `id="user-list"`.
2.  **Hämta Användare (i `script.js`):**
    *   Skapa en `async function`, t.ex. `fetchUsers()`.
    *   Använd `fetch` för att göra ett GET-anrop till `https://jsonplaceholder.typicode.com/users`.
    *   Hantera `response`-objektet: Kontrollera `response.ok` och använd `await response.json()` för att få datan.
    *   Använd `try...catch` för att fånga eventuella fel under hämtningen.
3.  **Visa Namnen:**
    *   Inuti `fetchUsers()` (efter att du har fått datan): Hämta referensen till din `<ul>`-tagg.
    *   Loopa igenom arrayen med användardata (som du fick från API:et).
    *   För varje användare, skapa ett nytt `<li>`-element.
    *   Sätt `<li>`-elementets `textContent` till användarens `name`.
    *   Lägg till (`appendChild`) `<li>`-elementet i din `<ul>`.
4.  **Anropa Funktionen:** Glöm inte att anropa din `fetchUsers()`-funktion så att koden körs när sidan laddas.
5.  **Testa:** Öppna `index.html` i webbläsaren. Ser du en lista med 10 användarnamn?

## Övning 2: Filtrera och Mappa Todos

**Mål:** Hämta en lista med "todos" (att-göra-uppgifter) från JSONPlaceholder. Filtrera listan så att du bara har de slutförda (`completed: true`) uppgifterna. Visa titlarna på dessa slutförda uppgifter i en ny lista.

1.  **Skapa HTML-struktur:** Lägg till en ny `<ul>`-tagg, t.ex. `id="completed-todos"`.
2.  **Hämta Todos (i `script.js`):**
    *   Skapa en ny `async function`, t.ex. `fetchAndFilterTodos()`.
    *   Använd `fetch` för att hämta data från `https://jsonplaceholder.typicode.com/todos`.
    *   Hantera `response` och parsa JSON som i övning 1, inkludera `try...catch`.
3.  **Filtrera och Mappa:**
    *   När du har fått todo-arrayen:
        *   Använd `filter()`-metoden för att skapa en ny array som *endast* innehåller de objekt där egenskapen `completed` är `true`.
        *   Använd `map()`-metoden på den *filtrerade* arrayen för att skapa en ny array som *endast* innehåller `title` för varje slutförd todo.
4.  **Visa Titlarna:**
    *   Hämta referensen till din `<ul>`-tagg (`#completed-todos`).
    *   Loopa igenom arrayen med **titlar**.
    *   Skapa och lägg till `<li>`-element för varje titel i `<ul>`.
5.  **Anropa Funktionen:** Anropa `fetchAndFilterTodos()`.
6.  **Testa:** Öppna `index.html`. Ser du en lista med titlarna på de slutförda uppgifterna?

## Övning 3: Kombinera Data (Post och Kommentarer)

**Mål:** Hämta först en specifik bloggpost (t.ex. post med id 5). När du har hämtat posten, använd dess `id` för att hämta alla kommentarer som hör till just den posten. Visa postens titel och sedan en lista med kommentarernas namn (namnet på den som kommenterat).

1.  **Skapa HTML-struktur:** Lägg till en `<div>`, t.ex. `id="post-and-comments"`.
2.  **Hämta Data (i `script.js`):**
    *   Skapa en `async function`, t.ex. `fetchPostAndComments(postId)`.
    *   **Steg 1: Hämta Posten:**
        *   Använd `fetch` för att hämta data från `https://jsonplaceholder.typicode.com/posts/${postId}` (använd template literal för att inkludera `postId`).
        *   Hantera `response` och parsa JSON. Spara post-objektet.
    *   **Steg 2: Hämta Kommentarer:**
        *   Använd `fetch` igen, nu för att hämta data från `https://jsonplaceholder.typicode.com/posts/${postId}/comments` (eller `https://jsonplaceholder.typicode.com/comments?postId=${postId}`).
        *   Hantera `response` och parsa JSON. Spara kommentars-arrayen.
    *   Använd `try...catch` för att hantera fel från båda anropen.
3.  **Visa Resultatet:**
    *   Hämta referensen till din `<div>` (`#post-and-comments`).
    *   Skapa och lägg till ett `<h2>`-element med postens `title`.
    *   Skapa en `<ul>`-lista för kommentarerna.
    *   Loopa igenom kommentars-arrayen.
    *   För varje kommentar, skapa ett `<li>`-element med kommentarens `name` och lägg till det i `<ul>`.
    *   Lägg till `<ul>`-listan i din `<div>`.
4.  **Anropa Funktionen:** Anropa `fetchPostAndComments(5)` (eller välj ett annat id).
5.  **Testa:** Öppna `index.html`. Ser du postens titel följt av en lista med namn på de som kommenterat?

## Övning 4: Felhantering med Fetch

**Mål:** Öva på att hantera olika typer av fel som kan uppstå vid `fetch`-anrop.

1.  **Försök hämta från en ogiltig URL:**
    *   Skapa en `async function`.
    *   Försök att `fetch` från en URL som inte finns, t.ex. `https://jsonplaceholder.typicode.com/nonexistent-endpoint`.
    *   Använd `try...catch`. Vad händer i `catch`-blocket? Logga felet.
    *   Kontrollera också `response.ok` inuti `try`-blocket (även om du kanske inte kommer dit om URL:en är helt fel). Visa ett felmeddelande på sidan om `response.ok` är `false` eller om ett `catch`-fel inträffar.
2.  **Försök parsa ogiltig JSON:**
    *   Hämta data från en URL som *inte* returnerar JSON, t.ex. `https://google.com` (detta kan ge CORS-problem, testa annars med en lokal fil eller en URL du vet returnerar HTML).
    *   Försök att anropa `await response.json()` på svaret.
    *   Se till att ditt `try...catch`-block fångar felet som uppstår vid JSON-parsningen. Logga felet och visa ett användarvänligt meddelande på sidan.

## Övning 5 (Bonus): Aggregera Data med Reduce

**Mål:** Hämta alla "posts" från JSONPlaceholder och använd `reduce` för att räkna hur många poster varje `userId` har skrivit.

1.  **Hämta Alla Poster:**
    *   Skapa en `async function`.
    *   Hämta data från `https://jsonplaceholder.typicode.com/posts`.
    *   Hantera `response` och parsa JSON.
2.  **Räkna Poster per Användare:**
    *   Använd `reduce()`-metoden på post-arrayen.
    *   Ditt `initialValue` ska vara ett tomt objekt `{}`.
    *   I din reducer-funktion, för varje `post`:
        *   Kontrollera om `post.userId` redan finns som en nyckel i ackumulator-objektet (`accumulator`).
        *   Om det finns, öka värdet (antalet) med 1.
        *   Om det inte finns, lägg till `post.userId` som en nyckel med värdet 1.
        *   Returnera det uppdaterade ackumulator-objektet.
3.  **Visa Resultatet:**
    *   Logga det slutliga objektet som `reduce` returnerar. Det bör se ut ungefär så här: `{ '1': 10, '2': 10, '3': 10, ... }`.
    *   (Valfritt) Visa denna information på webbsidan på ett snyggt sätt.

Dessa övningar ger dig en bra grund för att arbeta med asynkron kod och externa API:er i dina framtida JavaScript-projekt!

