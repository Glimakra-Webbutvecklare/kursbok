# Praktiska övningar: JavaScript och interaktivitet

Bästa sättet att lära sig JavaScript är att skriva kod i ett riktigt projekt. Vi fortsätter med **`portfolio-site`** från Git-kapitlet – samma mapp, nu med `script.js` och interaktivitet.

> **Mål:**  
> Bygga vidare på `portfolio-site` med variabler, funktioner, kontrollstrukturer och DOM-manipulation.

**Förutsättningar:** Du har `portfolio-site` med minst `index.html`. Länka `script.js` med `<script src="script.js"></script>` före `</body>`.

---

## Övning 1: Första scriptet i portfolio-site

1. Skapa `script.js` i `portfolio-site`.
2. Skriv `console.log("Portfolio laddad!")` i filen.
3. Öppna `index.html` i webbläsaren och bekräfta meddelandet i konsolen (F12).

<details>
<summary>Lösningsförslag</summary>

**index.html** (lägg till före `</body>`):
```html
<script src="script.js"></script>
```

**script.js:**
```javascript
console.log("Portfolio laddad!");
```
</details>

**Checkpoint:** Konsolen visar "Portfolio laddad!" när sidan öppnas.

---

## Övning 2: Variabler och template literals

1. Skapa variabler `siteTitle` och `ownerName` i `script.js`.
2. Skriv ut en rad med template literal, t.ex. `Välkommen till [titel] – av [namn]`.

<details>
<summary>Lösningsförslag</summary>

```javascript
const siteTitle = "Min Portfolio";
const ownerName = "Anna Andersson";
console.log(`Välkommen till ${siteTitle} – av ${ownerName}`);
```
</details>

**Checkpoint:** Utskriften innehåller både titel och namn i en sammanhängande mening.

---

## Övning 3: Ändra text på sidan

1. Lägg till `<h1 id="main-title">Min Portfolio</h1>` i `index.html`.
2. I `script.js`: hämta elementet och ändra `textContent` till ditt namn när sidan laddas.

<details>
<summary>Lösningsförslag</summary>

```javascript
const title = document.querySelector("#main-title");
title.textContent = "Anna Andersson – Portfolio";
```
</details>

**Checkpoint:** Rubriken på sidan uppdateras utan att du ändrar HTML-texten manuellt.

---

## Övning 4: Enkel räknare

1. Lägg till i HTML: `<button id="countBtn">Besökare</button>` och `<span id="counter">0</span>`.
2. Öka räknaren med 1 vid varje klick på knappen.

<details>
<summary>Lösningsförslag</summary>

```javascript
const countBtn = document.querySelector("#countBtn");
const counterEl = document.querySelector("#counter");
let count = 0;

countBtn.addEventListener("click", () => {
  count++;
  counterEl.textContent = count;
});
```
</details>

**Checkpoint:** Varje klick ökar siffran med 1.

---

## Övning 5: Villkor – myndig eller inte

1. Skapa en funktion `checkAge(age)` som returnerar `"Myndig"` om åldern är 18 eller högre, annars `"Ej myndig"`.
2. Testa med `console.log(checkAge(17))` och `console.log(checkAge(20))`.

<details>
<summary>Lösningsförslag</summary>

```javascript
function checkAge(age) {
  if (age >= 18) {
    return "Myndig";
  } else {
    return "Ej myndig";
  }
}

console.log(checkAge(17)); // Ej myndig
console.log(checkAge(20)); // Myndig
```
</details>

**Checkpoint:** Funktionen returnerar rätt sträng för båda testvärdena.

---

## Övning 6: Loopa igenom en array

1. Skapa en array `skills` med minst tre färdigheter (t.ex. `"HTML"`, `"CSS"`, `"JavaScript"`).
2. Använd en `for`-loop för att skriva ut varje färdighet i konsolen.

<details>
<summary>Lösningsförslag</summary>

```javascript
const skills = ["HTML", "CSS", "JavaScript"];

for (let i = 0; i < skills.length; i++) {
  console.log(skills[i]);
}
```
</details>

**Checkpoint:** Alla färdigheter skrivs ut, en per rad.

---

## Övning 7: Funktion med return

Skapa en funktion `createProduct(productName, price)` som skriver ut `"Detta är: [namn]! Den kostar [pris] SEK."` i konsolen. Anropa den med två egna produkter.

<details>
<summary>Lösningsförslag</summary>

```javascript
function createProduct(productName, price) {
  console.log(`Detta är: ${productName}! Den kostar ${price} SEK.`);
}

createProduct("iPhone 13 Pro", 7500);
createProduct("LG TV 50\"", 3000);
```
</details>

**Checkpoint:** Båda anropen skriver ut namn och pris korrekt.

---

## Övning 8: Byt färg vid klick

1. Lägg till `<button id="themeBtn">Byt accentfärg</button>` och `<p id="tagline">Webbutvecklare</p>`.
2. Vid klick: ändra textfärgen på `tagline` (t.ex. till blå).

<details>
<summary>Lösningsförslag</summary>

```javascript
const themeBtn = document.querySelector("#themeBtn");
const tagline = document.querySelector("#tagline");

themeBtn.addEventListener("click", () => {
  tagline.style.color = "royalblue";
});
```
</details>

**Checkpoint:** Texten byter färg när du klickar på knappen.

---

## Övning 9: Formulärvalidering

1. Lägg till ett formulär med textfält `id="nameInput"` och knapp `type="submit"`.
2. Lägg till `<p id="formMessage"></p>`.
3. Vid submit: förhindra omladdning, visa hälsning om namnet inte är tomt, annars felmeddelande.

<details>
<summary>Lösningsförslag</summary>

```html
<form id="contactForm">
  <input type="text" id="nameInput" placeholder="Ditt namn">
  <button type="submit">Skicka</button>
</form>
<p id="formMessage"></p>
```

```javascript
const form = document.querySelector("#contactForm");
const nameInput = document.querySelector("#nameInput");
const formMessage = document.querySelector("#formMessage");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();

  if (name === "") {
    formMessage.textContent = "Du måste skriva in ett namn!";
    formMessage.style.color = "red";
  } else {
    formMessage.textContent = `Hej, ${name}!`;
    formMessage.style.color = "green";
  }
});
```
</details>

**Checkpoint:** Tomt namn ger felmeddelande; ifyllt namn ger hälsning – sidan laddas inte om.

---

## Övning 10: Lägg till listpunkter i DOM

1. Lägg till `<ul id="skillList"></ul>` och `<button id="addSkillBtn">Lägg till färdighet</button>`.
2. Vid klick: skapa ett nytt `<li>` med texten "Färdighet N" (öka N för varje klick) och lägg till i listan.

<details>
<summary>Lösningsförslag</summary>

```javascript
const addSkillBtn = document.querySelector("#addSkillBtn");
const skillList = document.querySelector("#skillList");
let skillCount = 1;

addSkillBtn.addEventListener("click", () => {
  const item = document.createElement("li");
  item.textContent = `Färdighet ${skillCount}`;
  skillList.appendChild(item);
  skillCount++;
});
```
</details>

**Checkpoint:** Varje klick lägger till en ny punkt i listan.

---

## Sammanfattning och nästa steg

Du har nu praktiserat:
- **Grundläggande JavaScript** (övning 1–2, 5–7): variabler, funktioner, villkor och loopar
- **DOM och händelser** (övning 3–4, 8–10): välja element, ändra innehåll och reagera på klick

Committa dina ändringar i `portfolio-site` med Git innan du går vidare.

I [nästa kapitel](../kapitel_5/index.md) lär du dig hämta data från API:er med async JavaScript, JSON och Fetch.
