# Introduktion till JavaScript

JavaScript är det programmeringsspråk som gör webbsidor interaktiva och dynamiska. Med JavaScript kan du reagera på användarens handlingar, ändra innehåll på sidan utan att ladda om den, skapa spel, animationer och mycket mer. Nästan alla moderna webbplatser använder JavaScript på något sätt.

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
import { minFunktion } from './utils.js';

minFunktion();
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
let namn = "Anna";
let alder = 25;
```

### Utskrift

- **Till konsolen:**  
  `console.log("Hej!");`
- **Som popup:**  
  `alert("Varning!");`

---

## Sammanfattning

- JavaScript gör webbsidor interaktiva och dynamiska.
- Det kan läggas till direkt i HTML eller i en extern fil.
- Med JavaScript kan du skapa allt från enkla effekter till avancerade webbapplikationer.
- Nästa steg är att lära dig grunderna i programmering med JavaScript: variabler, datatyper, operatorer och logik.

Nu är du redo att börja skriva din första JavaScript