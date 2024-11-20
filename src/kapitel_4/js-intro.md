# Introduktion till JavaScript

## JavaScript i modern webbutveckling

JavaScript är det dominerande programmeringsspråket för webben och används för att skapa interaktiva och dynamiska webbapplikationer. Idag används JavaScript för:

- Frontend-utveckling (webbläsaren)
- Backend-utveckling (Node.js)
- Mobilappar (React Native, Ionic)
- Desktop-applikationer (Electron)
- Spelutveckling (Phaser, Three.js)

## Utvecklingsmiljö och verktyg

För att komma igång med JavaScript behöver du:

### Textredigerare
- Visual Studio Code (rekommenderas)
- Sublime Text
- Atom

### Webbläsare med utvecklarverktyg
- Chrome DevTools
- Firefox Developer Tools
- Safari Web Inspector

### Övriga verktyg
- Node.js - För att köra JavaScript utanför webbläsaren
- npm - Pakethanterare för JavaScript
- Git - Versionshantering

## JavaScript vs ECMAScript

ECMAScript är specifikationen som JavaScript bygger på:

- ECMAScript är standarden
- JavaScript är implementationen
- Moderna versioner:
  - ES6/ES2015 - Stor uppdatering med många nya funktioner
  - ES2016-2023 - Årliga uppdateringar med nya features

## Grundläggande syntax

### Kommentarer
```js
// Enkelradskommentar
/* 
  Flerradiga
  kommentarer 
*/
```

### Utskrifter och debugging
```js
console.log("Hej världen");
console.error("Ett fel har uppstått");
console.warn("Varning!");
```

### Kodstruktur
- JavaScript är case-sensitive
- Semikolon är valfritt men rekommenderas
- Indentering med 2 eller 4 mellanslag
- Camelcase är standard för namngivning


## Övningar
1. Sätt upp utvecklingsmiljön
- Starta VS Code
- Starta Live Server extension
- Skapa en HTML-fil med JavaScript-länk till script.js

2. Hello World
Lägg in följe kod i en fil `script.js``
```js
// Skapa en fil script.js
console.log("Hej världen!");
alert("Välkommen!");
```
3. Debugging
- Öppna utvecklarverktygen (F12)
- Testa olika console-metoder
- Sätt breakpoints

## Lösningsförslag
1. Utvecklingsmiljö
```html
<!DOCTYPE html>
<html>
<head>
    <title>JavaScript Intro</title>
</head>
<body>
    <h1>Min första JavaScript-sida</h1>
    <script src="script.js"></script>
</body>
</html>
```
2. Hello World
```js
// script.js
console.log("Hej världen!");
alert("Välkommen till JavaScript!");
document.body.innerHTML += "<p>Denna text kommer från JavaScript</p>";
```

3. Debugging
```js
// Olika typer av console-outputs
console.log("Normal logg");
console.info("Information");
console.warn("Varning");
console.error("Felmeddelande");

// Test av variabel
let test = "Debug denna variabel";
console.log("Variabelns värde:", test);
```