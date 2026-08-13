# Praktiska Övningar: Asynkron JavaScript och API-Anrop

Nu bygger vi ett **portfolio-dashboard** i `portfolio-site` med data från [JSONPlaceholder](https://jsonplaceholder.typicode.com/). Varje övning lägger till en ny del – använd `async/await` och `try...catch` genomgående.

> **Mål:**  
> Hämta, bearbeta och visa extern data i `portfolio-site` med fetch, JSON och array-metoder.

**Förutsättningar:**
- `portfolio-site` med `index.html` och `script.js`
- Grundläggande DOM-kunskaper från kapitel 4
- En modern webbläsare med internetanslutning (för riktiga API-anrop)

**Tips:** Använd `async/await` för fetch-anrop och glöm inte `try...catch` för felhantering.

---

## Övning 1: Hämta och visa användare

**Mål:** Hämta en lista med användare och visa deras namn i en lista på webbsidan.

1. Lägg till `<ul id="user-list"></ul>` i `index.html`.
2. Skapa `async function fetchUsers()` i `script.js`.
3. Hämta `https://jsonplaceholder.typicode.com/users`, kontrollera `response.ok`, parsa JSON.
4. Loopa igenom användarna och lägg till `<li>` med varje `name` i listan.
5. Anropa `fetchUsers()` när sidan laddas.

<details>
<summary>Lösningsförslag</summary>

```javascript
async function fetchUsers() {
  const list = document.querySelector("#user-list");
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const users = await response.json();

    users.forEach((user) => {
      const item = document.createElement("li");
      item.textContent = user.name;
      list.appendChild(item);
    });
  } catch (error) {
    console.error("Kunde inte hämta användare:", error);
    list.textContent = "Kunde inte ladda användare.";
  }
}

fetchUsers();
```
</details>

**Checkpoint:** Ser du 10 användarnamn i listan när du öppnar sidan?

---

## Övning 2: Filtrera och mappa todos

**Mål:** Hämta todos, filtrera slutförda (`completed: true`) och visa titlarna.

1. Lägg till `<ul id="completed-todos"></ul>`.
2. Hämta `https://jsonplaceholder.typicode.com/todos`.
3. Använd `filter()` och `map()` för att få titlar på slutförda uppgifter.
4. Visa titlarna i listan.

<details>
<summary>Lösningsförslag</summary>

```javascript
async function fetchCompletedTodos() {
  const list = document.querySelector("#completed-todos");
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const todos = await response.json();
    const completedTitles = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.title);

    completedTitles.forEach((title) => {
      const item = document.createElement("li");
      item.textContent = title;
      list.appendChild(item);
    });
  } catch (error) {
    console.error(error);
    list.textContent = "Kunde inte ladda todos.";
  }
}

fetchCompletedTodos();
```
</details>

**Checkpoint:** Listan innehåller bara titlar på slutförda todos (inte de med `completed: false`).

---

## Övning 3: Post och kommentarer

**Mål:** Hämta post med id 5, sedan dess kommentarer, och visa titel + kommentarsnamn.

1. Lägg till `<div id="post-and-comments"></div>`.
2. Skapa `async function fetchPostAndComments(postId)`.
3. Hämta posten från `/posts/${postId}`, sedan kommentarer från `/posts/${postId}/comments`.
4. Visa postens `title` som `<h2>` och kommentarernas `name` i en `<ul>`.

<details>
<summary>Lösningsförslag</summary>

```javascript
async function fetchPostAndComments(postId) {
  const container = document.querySelector("#post-and-comments");
  try {
    const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
    const post = await postRes.json();

    const commentsRes = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
    if (!commentsRes.ok) throw new Error(`HTTP ${commentsRes.status}`);
    const comments = await commentsRes.json();

    const heading = document.createElement("h2");
    heading.textContent = post.title;
    container.appendChild(heading);

    const ul = document.createElement("ul");
    comments.forEach((comment) => {
      const li = document.createElement("li");
      li.textContent = comment.name;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  } catch (error) {
    console.error(error);
    container.textContent = "Kunde inte ladda post och kommentarer.";
  }
}

fetchPostAndComments(5);
```
</details>

**Checkpoint:** Du ser postens titel följt av en lista med kommentarsnamn.

---

## Övning 4: Felhantering med fetch

**Mål:** Öva på att hantera fel vid ogiltiga anrop.

1. Lägg till `<p id="error-demo"></p>`.
2. Försök hämta `https://jsonplaceholder.typicode.com/nonexistent-endpoint`.
3. Visa ett användarvänligt felmeddelande på sidan om `response.ok` är `false` eller om `catch` triggas.

<details>
<summary>Lösningsförslag</summary>

```javascript
async function demoErrorHandling() {
  const output = document.querySelector("#error-demo");
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/nonexistent-endpoint"
    );
    if (!response.ok) {
      throw new Error(`Servern svarade med status ${response.status}`);
    }
    const data = await response.json();
    output.textContent = JSON.stringify(data);
  } catch (error) {
    console.error(error);
    output.textContent = `Fel: ${error.message}`;
    output.style.color = "red";
  }
}

demoErrorHandling();
```
</details>

**Checkpoint:** Sidan visar ett tydligt felmeddelande (t.ex. status 404) utan att krascha.

> **Om CORS-blockering:** JSONPlaceholder tillåter anrop från webbläsaren. Om du testar mot andra URL:er kan webbläsaren blockera anropet – använd då JSONPlaceholder eller ett lokalt test-API.

---

## Övning 5 (Bonus): Aggregera data med reduce

**Mål:** Hämta alla posts och räkna hur många poster varje `userId` har skrivit.

1. Hämta `https://jsonplaceholder.typicode.com/posts`.
2. Använd `reduce()` för att bygga ett objekt `{ userId: antal }`.
3. Logga resultatet i konsolen (eller visa på sidan).

<details>
<summary>Lösningsförslag</summary>

```javascript
async function countPostsPerUser() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const posts = await response.json();
    const counts = posts.reduce((acc, post) => {
      const id = post.userId;
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    console.log("Poster per användare:", counts);
  } catch (error) {
    console.error(error);
  }
}

countPostsPerUser();
```
</details>

**Checkpoint:** Konsolen visar ett objekt där varje `userId` har värdet 10 (JSONPlaceholder har 10 användare med 10 poster vardera).

---

## Sammanfattning

Du har nu byggt ett datadrivet portfolio-dashboard med:
- **Fetch och async/await** (övning 1, 3–4)
- **Array-metoder** (övning 2, 5)
- **Felhantering** (övning 4)

Committa dina ändringar i `portfolio-site` innan du går vidare till nästa kapitel.
