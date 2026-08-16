# Introduktion till JavaScript

JavaScript är det programmeringsspråk som gör webbsidor interaktiva och dynamiska. Med JavaScript kan du reagera på användarens handlingar, ändra innehåll på sidan utan att ladda om den, skapa spel, animationer och mycket mer. Nästan alla moderna webbplatser använder JavaScript på något sätt.

> **Mål:**
> Förstå var JavaScript körs, hur det kopplas till en sida och hur du skriver ut ett första värde.

---

## Vad är JavaScript?

- **JavaScript** är ett skriptspråk som körs i webbläsaren (client-side), men kan även köras på servrar (t.ex. med Node.js).
- Det är ett av de tre grundläggande språken för webben:
  1. **HTML** – strukturen på sidan
  2. **CSS** – utseendet och layouten
  3. **JavaScript** – interaktivitet och logik

---

## Varför använda JavaScript?

- **Interaktivitet:** Gör det möjligt att reagera på klick, tangenttryckningar, formulär och andra händelser.
- **Dynamiskt innehåll:** Ändra text, bilder och layout utan att ladda om sidan.
- **Validering:** Kontrollera formulär innan de skickas till servern.
- **Animationer:** Skapa rörelse och effekter.
- **Kommunikation:** Hämta och skicka data till andra tjänster (API:er) utan att ladda om sidan.

---

## Hur lägger man till JavaScript i en webbsida?

JavaScript kan inkluderas på två huvudsakliga sätt:

### 1. Inbäddat i HTML-filen

```html
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <title>Min första JS-sida</title>
</head>
<body>
  <h1>Hej!</h1>
  <script>
    console.log("Sidan är laddad!");
    alert("Välkommen till min sida!");
  </script>
</body>
</html>
```

### 2. Extern JavaScript-fil

Det rekommenderas att lägga JavaScript i en separat fil för bättre struktur och återanvändbarhet.

```html
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <title>Extern JS</title>
</head>
<body>
  <h1>Exempel</h1>
  <script src="script.js"></script>
</body>
</html>
```

**I filen `script.js`:**
```javascript
console.log("Detta kommer från en extern fil!");
```

### 3. Importera JavaScript som modul

Du kan också inkludera JavaScript som en modul med attributet `type="module"`. Det gör det möjligt att använda `import` och `export` för att dela kod mellan filer.

```html
<script type="module" src="main.js"></script>
```

**I filen `main.js`:**
```javascript
import { greet } from './utils.js';

greet();
```

Detta är användbart för större projekt där du vill strukturera din kod i flera filer.

## Namngivning av JavaScript-filer

När du skapar JavaScript-filer är det viktigt att ge dem tydliga och beskrivande namn. Det gör det enklare att förstå vad filen innehåller och underlättar när projektet växer.

- **Korta filnamn:**  
    Används ofta för enklare eller generella skript.
    - `script.js`
    - `main.js`
    - `app.js`

- **Längre och mer beskrivande filnamn:**  
    För större projekt eller specifika funktioner är det vanligt att använda camelCase (små bokstäver och stor bokstav för varje nytt ord).
    - `userProfile.js`
    - `dataFetcher.js`
    - `formValidator.js`

Att använda beskrivande namn gör koden lättare att underhålla och förstå för både dig själv och andra utvecklare.

---

## Grunder: Variabler och utskrift

### Variabler

En variabel används för att spara data som kan användas senare.

```javascript
let name = "Anna";
let age = 25;
```

### Utskrift

- **Till konsolen:**  
  `console.log("Hej!");`
- **Som popup:**  
  `alert("Varning!");`

**Prova själv:** Klicka på **Kör** för att köra koden. Utskriften från `console.log` visas under editorn. Ändra gärna texten och kör igen.

<!-- playground -->
```js
console.log("Hej!");

const name = "Världen";
console.log("Hej, " + name + "!");

for (let i = 1; i <= 3; i++) {
  console.log("Räknar: " + i);
}
```

---

## Felsökning med konsolen

När något inte fungerar som förväntat är **webbläsarens konsol** (Developer Tools) ditt viktigaste verktyg.

1. Öppna konsolen med **F12** (eller högerklicka → *Inspektera* → fliken **Console**).
2. Använd `console.log()` för att skriva ut värden och se vad koden faktiskt gör.
3. Läs felmeddelanden – de visar ofta filnamn, radnummer och vad som gick fel.

```javascript
let score = 10;
console.log("Poäng före:", score);
score = score + 5;
console.log("Poäng efter:", score);
```

> **Vanliga misstag**
>
> - **Glömt att länka `script.js`** → inget händer. Kontrollera `<script src="script.js">` i HTML.
> - **Script före HTML-element** → `null` vid DOM-sökning. Placera `<script>` sist i `<body>`.
> - **Stavfel i variabelnamn** → `ReferenceError: x is not defined`.

> **Kör nu i din egen editor:** Öppna `portfolio-site/index.html` (från Git-kapitlet), lägg till `<script src="script.js"></script>` före `</body>` och skriv din första `console.log` i `script.js`. Bekräfta i konsolen att meddelandet syns.

---

## Sammanfattning

- JavaScript gör webbsidor interaktiva och dynamiska.
- Det kan läggas till direkt i HTML eller i en extern fil.
- Med JavaScript kan du skapa allt från enkla effekter till avancerade webbapplikationer.
- Nästa steg är att lära dig grunderna i programmering med JavaScript: variabler, datatyper, operatorer och logik.

Nu är du redo att börja skriva din första JavaScript-kod.
