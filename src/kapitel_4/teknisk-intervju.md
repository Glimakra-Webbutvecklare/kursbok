# Tekniska Intervjufrågor: JavaScript och DOM-manipulation

Detta avsnitt innehåller exempel på tekniska intervjufrågor som kan dyka upp gällande JavaScript och frontend-programmering. Frågorna är utformade för att testa både teoretisk förståelse och praktisk kunskap.

Använd dessa frågor för att testa din kunskap och förbereda dig för tekniska intervjuer.

---

## Fråga 1: JavaScript Grundläggande och Inkludering

**Fråga:** "Förklara skillnaden mellan att inkludera JavaScript inline, internt och externt. Varför placeras `<script>`-taggar oftast före `</body>`?"

**Förslag till svar:**
- **Inline:** `onclick="alert('Klick')"` - Bör undvikas, blandar struktur och beteende
- **Internt:** `<script>`-taggar i HTML-dokumentet - OK för små tester
- **Externt:** Separat `.js`-fil länkad med `<script src="script.js">` - Rekommenderas

**Varför före `</body>`:**
- **DOM-laddning:** HTML-element måste finnas innan JavaScript kan manipulera dem
- **Prestanda:** Sidan kan börja renderas innan script laddas
- **Användarupplevelse:** Undviker att script blockerar sidladdningen

**Best practice:** Extern JS-fil precis före `</body>` för separation av concerns och bättre underhållbarhet.

---

## Fråga 2: Variabler och Deklarationer

**Fråga:** "Vad är skillnaden mellan `let`, `const` och `var`? När skulle du använda respektive?"

**Förslag till svar:**
- **`const`:** Konstant värde, kan inte tilldelas om, block-scope
  ```javascript
  const name = "Alice"; // Kan inte ändras
  ```
- **`let`:** Variabelt värde, kan tilldelas om, block-scope
  ```javascript
  let age = 25;
  age = 26; // OK
  ```
- **`var`:** Äldre syntax, function-scope (inte block-scope), hoisting-problem

**Best practice:**
1. **Använd `const` som standard** - signalerar att värdet inte ska ändras
2. **Använd `let` när du behöver ändra värdet**
3. **Undvik `var`** - orsakar förvirring med scope

**Block-scope exempel:**
```javascript
if (true) {
  let blockVar = "synlig här";
  const blockConst = "också synlig här";
}
// blockVar och blockConst är INTE synliga här
```

---

## Fråga 3: Datatyper och Typomvandling

**Fråga:** "Förklara JavaScripts primitiva datatyper. Vad händer i följande kod och varför?"
```javascript
console.log("5" + 3);
console.log("5" - 3);
console.log(true + 1);
```

**Förslag till svar:**
**Primitiva datatyper:**
- `string` - text: `"Hej"`
- `number` - tal: `42`, `3.14`
- `boolean` - sant/falskt: `true`, `false`
- `undefined` - ej tilldelat värde
- `null` - avsiktligt tomt värde
- `symbol` - unik identifierare
- `bigint` - mycket stora heltal

**Typomvandling (Type Coercion):**
```javascript
console.log("5" + 3);    // "53" - + konkatenerar strängar
console.log("5" - 3);    // 2 - konverterar "5" till number
console.log(true + 1);   // 2 - true blir 1
```

**Varför:** JavaScript försöker automatiskt konvertera typer, vilket kan ge oväntade resultat. Var försiktig med operatorer på olika typer.

---

## Fråga 4: Funktioner och Syntax

**Fråga:** "Visa tre olika sätt att skriva funktioner i JavaScript. Vad är skillnaderna mellan dem?"

**Förslag till svar:**
```javascript
// 1. Funktionsdeklaration
function add(a, b) {
  return a + b;
}

// 2. Funktionsuttryck
const multiply = function(a, b) {
  return a * b;
};

// 3. Arrow function (ES6)
const divide = (a, b) => a / b;

// Kort arrow function (en parameter)
const square = x => x * x;
```

**Skillnader:**
- **Deklaration:** Hoistas (kan anropas före deklaration)
- **Uttryck:** Hoistas inte, måste deklareras före anrop
- **Arrow:** Kortare syntax, annorlunda `this`-binding, hoistas inte

**När använda vad:**
- **Arrow functions:** För korta, enkla funktioner och callbacks
- **Deklarationer:** För huvudfunktioner i programmet
- **Uttryck:** När du vill tilldela funktion till variabel

---

## Fråga 5: Scope och Synlighet

**Fråga:** "Förklara skillnaden mellan globalt, lokalt och block-scope. Vad skrivs ut i denna kod?"
```javascript
const global = "Jag är global";

function testScope() {
  const local = "Jag är lokal";
  
  if (true) {
    const block = "Jag är i block";
    console.log(global); // ?
    console.log(local);  // ?
    console.log(block);  // ?
  }
  
  console.log(block); // ?
}
```

**Förslag till svar:**
**Scope-typer:**
- **Global scope:** Tillgänglig överallt i programmet
- **Funktions-scope (lokalt):** Tillgänglig endast inuti funktionen
- **Block-scope:** Tillgänglig endast inuti `{}` (för `let`/`const`)

**Utskrift:**
```javascript
console.log(global); // "Jag är global" - global variabel
console.log(local);  // "Jag är lokal" - lokal till funktionen  
console.log(block);  // "Jag är i block" - i samma block

console.log(block);  // ReferenceError! block finns inte här
```

**Princip:** Inre scope kan komma åt yttre scope, men inte tvärtom.

---

## Fråga 6: Kontrollstrukturer

**Fråga:** "Skriv kod som kontrollerar en användares ålder och ger olika meddelanden. Använd både `if/else` och `switch` för att visa skillnaden."

**Förslag till svar:**
```javascript
// Med if/else (för ranges/intervall)
function checkAgeIf(age) {
  if (age < 13) {
    return "Barn";
  } else if (age < 20) {
    return "Tonåring";
  } else if (age < 65) {
    return "Vuxen";
  } else {
    return "Senior";
  }
}

// Med switch (för specifika värden)
function checkDayType(dayNumber) {
  switch (dayNumber) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return "Vardag";
    case 6:
    case 7:
      return "Helg";
    default:
      return "Ogiltig dag";
  }
}
```

**När använda vad:**
- **`if/else`:** För intervall, komplexa villkor, booleans
- **`switch`:** För specifika värden, många exakta fall
- **Viktigt:** Glöm inte `break;` i switch-case (om du inte returnar)!

---

## Fråga 7: Loopar och Iteration

**Fråga:** "Visa olika sätt att iterera över en array. Vad är för- och nackdelarna med varje metod?"

**Förslag till svar:**
```javascript
const fruits = ["äpple", "banan", "apelsin"];

// 1. Traditional for-loop
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}
// Fördelar: Full kontroll över index, kan ändra loop-variabel
// Nackdelar: Mer kod, risk för off-by-one errors

// 2. for...of (ES6)
for (const fruit of fruits) {
  console.log(fruit);
}
// Fördelar: Ren syntax, direkt tillgång till värden
// Nackdelar: Ingen direkt tillgång till index

// 3. forEach (array method)
fruits.forEach((fruit, index) => {
  console.log(index, fruit);
});
// Fördelar: Funktionell stil, index som parameter
// Nackdelar: Kan inte break/continue

// 4. while loop
let i = 0;
while (i < fruits.length) {
  console.log(fruits[i]);
  i++;
}
// Fördelar: Flexibel, bra för okänt antal iterationer
// Nackdelar: Risk för oändlig loop om man glömmer öka i
```

---

## Fråga 8: DOM och Element-selektion

**Fråga:** "Vad är DOM? Visa olika sätt att välja element från DOM och när du skulle använda varje metod."

**Förslag till svar:**
**DOM (Document Object Model):**
- Webbläsarens representation av HTML-dokumentet som ett träd av objekt
- JavaScript kan manipulera detta träd för att ändra sidan dynamiskt
- Varje HTML-element blir ett objekt med egenskaper och metoder

**Element-selektion:**
```javascript
// Modern metod (rekommenderas)
const element = document.querySelector('#myId');
const elements = document.querySelectorAll('.myClass');

// Äldre metoder (fortfarande används)
const byId = document.getElementById('myId');
const byClass = document.getElementsByClassName('myClass');
const byTag = document.getElementsByTagName('p');
```

**Skillnader:**
- **`querySelector`:** Första matchning, CSS-selektor syntax
- **`querySelectorAll`:** Alla matchningar, returnerar NodeList
- **`getElementById`:** Snabbast för ID, bara ett element
- **`getElementsByClass/Tag`:** Returnerar HTMLCollection (live)

**Best practice:** Använd `querySelector`/`querySelectorAll` för flexibilitet.

---

## Fråga 9: DOM-manipulation

**Fråga:** "Hur ändrar du innehållet, attribut och stilar på ett HTML-element med JavaScript? Visa exempel."

**Förslag till svar:**
```javascript
const element = document.querySelector('#myElement');

// Ändra textinnehåll
element.textContent = "Ny text";          // Säker, bara text
element.innerHTML = "<strong>HTML</strong>"; // Osäker med user input!

// Ändra attribut
element.setAttribute('src', 'newimage.jpg');
element.src = 'newimage.jpg';             // Direktegenskap
const currentSrc = element.getAttribute('src');

// Ändra stilar (undvik för många ändringar)
element.style.backgroundColor = 'red';
element.style.fontSize = '20px';

// Bättre: Använd CSS-klasser
element.classList.add('highlight');       // Lägg till klass
element.classList.remove('old-style');   // Ta bort klass  
element.classList.toggle('active');      // Växla klass
const hasClass = element.classList.contains('highlight');

// Skapa och lägga till element
const newDiv = document.createElement('div');
newDiv.textContent = "Nytt element";
document.body.appendChild(newDiv);
```

**Best practice:** Använd `classList` för stiländringar istället för `style`.

---

## Fråga 10: Event Handling

**Fråga:** "Förklara hur händelsehantering fungerar i JavaScript. Skriv kod som hanterar en knappklickning och visa vad event-objektet innehåller."

**Förslag till svar:**
```javascript
// HTML: <button id="myButton">Klicka mig</button>

const button = document.querySelector('#myButton');

// Modern metod (rekommenderas)
button.addEventListener('click', handleClick);

function handleClick(event) {
  console.log('Knapp klickad!');
  
  // Event-objektet innehåller:
  console.log('Event type:', event.type);        // 'click'
  console.log('Target element:', event.target);  // Knappen som klickades
  console.log('Mouse position:', event.clientX, event.clientY);
  
  // Förhindra standardbeteende (t.ex. för formulär)
  event.preventDefault();
  
  // Ändra knappens utseende
  event.target.textContent = 'Klickad!';
  event.target.classList.add('clicked');
}

// Alternativ: arrow function direkt
button.addEventListener('click', (event) => {
  console.log('Klick med arrow function!');
});
```

**Vanliga events:** `click`, `submit`, `input`, `mouseover`, `keydown`, `load`

**Viktigt:** Använd `addEventListener` istället för `onclick`-attribut för separation of concerns.

---

## Fråga 11: Formulärhantering och Validering

**Fråga:** "Hur hanterar du formulärinskickning med JavaScript? Visa hur du förhindrar standardbeteendet och validerar input."

**Förslag till svar:**
```html
// HTML: 
<form id="myForm">
   <input type="email" id="email" required>
   <button type="submit">Skicka</button>
</form>
```
```javascript

const form = document.querySelector('#myForm');
const emailInput = document.querySelector('#email');

form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault(); // Stoppa normal formulärinskickning
  
  // Hämta värden
  const email = emailInput.value.trim();
  
  // Enkel validering
  if (!email) {
    showError('E-post krävs');
    return;
  }
  
  if (!isValidEmail(email)) {
    showError('Ogiltig e-postadress');
    return;
  }
  
  // Skicka data (t.ex. till server)
  console.log('Skickar:', { email });
  showSuccess('Formulär skickat!');
}

function isValidEmail(email) {
  return email.includes('@') && email.includes('.');
}

function showError(message) {
  console.error(message);
  // Visa felmeddelande i UI
}

function showSuccess(message) {
  console.log(message);
  // Visa framgångsmeddelande i UI
}
```

**Viktigt:** Alltid validera på server också - klientvalidering är bara för användarupplevelse.

---

## Fråga 12: Felsökning och Debug-tekniker

**Fråga:** "Vilka verktyg och tekniker använder du för att felsöka JavaScript-kod? Visa praktiska exempel."

**Förslag till svar:**
**Felsökningsverktyg:**

1. **Console.log()** - Grundläggande utskrifter
```javascript
const data = { name: "Alice", age: 25 };
console.log('Data:', data);
console.log('Endast namnet:', data.name);

// Andra console-metoder
console.error('Detta är ett fel');
console.warn('Detta är en varning');
console.table(data); // Visa objekt som tabell
```

2. **Browser Developer Tools**
```javascript
// Sätt breakpoints i koden
function calculateTotal(price, tax) {
  debugger; // Pausar exekvering här
  const total = price + (price * tax);
  return total;
}
```

3. **Defensive Programming**
```javascript
function processUser(user) {
  // Kontrollera input
  if (!user) {
    console.error('User is null or undefined');
    return;
  }
  
  if (typeof user.age !== 'number') {
    console.warn('User age is not a number:', user.age);
  }
  
  // Fortsätt med logik...
}
```

4. **Try-Catch för felhantering**
```javascript
try {
  const result = riskyOperation();
  console.log('Success:', result);
} catch (error) {
  console.error('Something went wrong:', error.message);
}
```

**Best practices:** Använd console.log strategiskt, lär dig utvecklarverktygen, skriv defensiv kod.

---

## Tips för Tekniska Intervjuer

- **Skriv kod på whiteboard/papper** - träna på att skriva JavaScript utan editor
- **Förklara din tankeprocess** - prata igenom vad du gör steg för steg
- **Testa din kod mentalt** - gå igenom koden rad för rad
- **Fråga om krav** - klargör vad som förväntas innan du börjar koda
- **Börja enkelt** - löss grundproblemet först, lägg till features sedan
- **Hantera edge cases** - diskutera vad som händer med oväntad input
