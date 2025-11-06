# Praktiska övningar: JavaScript och interaktivitet

Att läsa teori är viktigt, men det är genom att skriva och testa kod som du verkligen lär dig JavaScript. Här hittar du övningar som hjälper dig att befästa kunskaperna från kapitlet om JavaScript, DOM-manipulation och händelser.

> **Mål:**  
> Träna på att använda JavaScript för att skapa interaktivitet, manipulera DOM och hantera händelser på webbsidor.

**Förutsättningar:**  
Du har en HTML-fil att arbeta med och kan lägga till eller länka en JavaScript-fil. Du kan öppna sidan i en webbläsare och se resultatet av din kod.

---

## Övning 1: Skriv ut meddelande i konsolen

1. Skapa en fil `script.js` och koppla den till din HTML-fil med `<script src="script.js"></script>`.
2. Skriv kod som skriver ut "Hello, JavaScript!" i webbläsarens konsol.
3. Öppna webbsidan och kontrollera i konsolen (F12) att meddelandet syns.

<details>
<summary>Lösningsförslag</summary>

**HTML (index.html):**
```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>JavaScript Övning</title>
</head>
<body>
    <h1>Min första JavaScript-sida</h1>
    <!-- Kopplar JavaScript-filen till HTML-sidan -->
    <script src="script.js"></script>
</body>
</html>
```

**JavaScript (script.js):**
```javascript
// Skriver ut meddelandet i webbläsarens konsol
console.log("Hello, JavaScript!");
```

**Förklaring:**
- `<script src="script.js"></script>` läser in JavaScript-filen när sidan laddas
- `console.log()` är en funktion som skriver ut text i webbläsarens konsol
- Öppna konsolen med F12 (eller högerklicka → "Inspektera" → fliken "Console")
- Meddelandet "Hello, JavaScript!" kommer att synas i konsolen när sidan laddas
</details>

---

## Övning 2: Ändra text på sidan med JavaScript

1. Lägg till ett element i din HTML, t.ex. `<p id="message">Detta ska ändras</p>`.
2. Skriv JavaScript som ändrar texten i paragrafen till "Texten är nu ändrad!" när sidan laddas.

<details>
<summary>Lösningsförslag</summary>

**HTML:**
```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Ändra text</title>
</head>
<body>
    <!-- Elementet som ska ändras -->
    <p id="message">Detta ska ändras</p>
    
    <script src="script.js"></script>
</body>
</html>
```

**JavaScript (script.js):**
```javascript
// Hämtar elementet med id="message" från DOM
let messageElement = document.getElementById("message");

// Ändrar textinnehållet i elementet
messageElement.textContent = "Texten är nu ändrad!";
```

**Förklaring:**
- `document.getElementById("message")` hämtar elementet med id="message" från sidan
- Resultatet sparas i variabeln `messageElement`
- `textContent` är en egenskap som innehåller texten i elementet
- Genom att sätta `textContent = "Texten är nu ändrad!"` ändras texten i paragrafen
- Koden körs när sidan laddas eftersom script-taggen är längst ner i body
</details>

---

## Övning 3: Byt färg på ett element vid knapptryck

1. Lägg till en knapp: `<button id="colorBtn">Byt färg</button>` och ett text-element: `<p id="colorText">Färgtest</p>`.
2. Skriv JavaScript som gör att texten i `colorText` byter färg (t.ex. till blå) när du klickar på knappen.

<details>
<summary>Lösningsförslag</summary>

**HTML:**
```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Byt färg</title>
</head>
<body>
    <!-- Knappen som ska trigga färgbytet -->
    <button id="colorBtn">Byt färg</button>
    <!-- Text-elementet som ska ändra färg -->
    <p id="colorText">Färgtest</p>
    
    <script src="script.js"></script>
</body>
</html>
```

**JavaScript (script.js):**
```javascript
// Hämtar knappen och text-elementet från DOM
let colorBtn = document.getElementById("colorBtn");
let colorText = document.getElementById("colorText");

// Lägger till en event listener (lyssnare) på knappen
// När knappen klickas, körs funktionen
colorBtn.addEventListener("click", function() {
    // Ändrar färgen på texten till blå
    colorText.style.color = "blue";
});
```

**Förklaring:**
- `getElementById()` hämtar elementen från sidan
- `addEventListener("click", function() {...})` lägger till en lyssnare som väntar på klick
- När knappen klickas, körs funktionen inuti `addEventListener`
- `style.color` ändrar textfärgen på elementet
- "blue" är en CSS-färg (kan också vara hex-kod som "#0000ff" eller rgb som "rgb(0, 0, 255)")
</details>

---

## Övning 4: Lägg till nya element i DOM

1. Lägg till en tom lista i HTML: `<ul id="myList"></ul>` och en knapp: `<button id="addBtn">Lägg till punkt</button>`.
2. Skriv JavaScript som lägger till ett nytt `<li>`-element med valfri text i listan varje gång du klickar på knappen.

<details>
<summary>Lösningsförslag</summary>

**HTML:**
```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Lägg till element</title>
</head>
<body>
    <!-- Tom lista som ska fyllas med element -->
    <ul id="myList"></ul>
    <!-- Knapp som lägger till nya element -->
    <button id="addBtn">Lägg till punkt</button>
    
    <script src="script.js"></script>
</body>
</html>
```

**JavaScript (script.js):**
```javascript
// Hämtar knappen och listan från DOM
let addBtn = document.getElementById("addBtn");
let myList = document.getElementById("myList");

// Räknare för att ge varje punkt ett unikt nummer
let counter = 1;

// Lägger till en event listener på knappen
addBtn.addEventListener("click", function() {
    // Skapar ett nytt <li>-element
    let newItem = document.createElement("li");
    
    // Sätter textinnehållet i det nya elementet
    newItem.textContent = "Punkt " + counter;
    
    // Lägger till det nya elementet i listan
    myList.appendChild(newItem);
    
    // Ökar räknaren för nästa punkt
    counter++;
});
```

**Förklaring:**
- `document.createElement("li")` skapar ett nytt `<li>`-element i minnet (syns inte på sidan än)
- `textContent` sätter textinnehållet i elementet
- `appendChild()` lägger till elementet som ett barn till listan (nu syns det på sidan)
- `counter` används för att ge varje punkt ett unikt nummer
- Varje gång knappen klickas, skapas ett nytt element och läggs till i listan
</details>

---

## Övning 5: Enkel räknare

1. Lägg till en knapp: `<button id="countBtn">Räkna</button>` och ett element för att visa räknaren: `<span id="counter">0</span>`.
2. Skriv JavaScript som ökar värdet i `counter` med 1 varje gång du klickar på knappen.

<details>
<summary>Lösningsförslag</summary>

**HTML:**
```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Räknare</title>
</head>
<body>
    <!-- Element som visar räknaren -->
    <p>Räknare: <span id="counter">0</span></p>
    <!-- Knapp som ökar räknaren -->
    <button id="countBtn">Räkna</button>
    
    <script src="script.js"></script>
</body>
</html>
```

**JavaScript (script.js):**
```javascript
// Hämtar knappen och räknare-elementet från DOM
let countBtn = document.getElementById("countBtn");
let counterElement = document.getElementById("counter");

// Startvärde för räknaren
let count = 0;

// Lägger till en event listener på knappen
countBtn.addEventListener("click", function() {
    // Ökar räknaren med 1
    count++;
    
    // Uppdaterar texten i elementet med det nya värdet
    counterElement.textContent = count;
});
```

**Förklaring:**
- `let count = 0` skapar en variabel som håller räknarens värde
- `count++` ökar värdet med 1 (samma som `count = count + 1`)
- `textContent` används för att uppdatera texten i `<span>`-elementet
- Varje gång knappen klickas ökas räknaren och texten uppdateras
- Variabeln `count` behåller sitt värde mellan klick eftersom den är deklarerad utanför funktionen
</details>

---

## Övning 6: Formulär och validering

1. Lägg till ett enkelt formulär i HTML:
   ```html
   <form id="myForm">
     <input type="text" id="nameInput" placeholder="Skriv ditt namn">
     <button type="submit">Skicka</button>
   </form>
   <p id="formMessage"></p>
   ```
2. Skriv JavaScript som:
   - Förhindrar att sidan laddas om när formuläret skickas.
   - Läser av värdet i `nameInput`.
   - Skriver ut ett meddelande i `formMessage`, t.ex. "Hej, [namn]!", om fältet inte är tomt. Om det är tomt, visa ett felmeddelande.

<details>
<summary>Lösningsförslag</summary>

**HTML:**
```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Formulär</title>
</head>
<body>
    <!-- Formulär för namn -->
    <form id="myForm">
        <input type="text" id="nameInput" placeholder="Skriv ditt namn">
        <button type="submit">Skicka</button>
    </form>
    <!-- Element där meddelandet visas -->
    <p id="formMessage"></p>
    
    <script src="script.js"></script>
</body>
</html>
```

**JavaScript (script.js):**
```javascript
// Hämtar formuläret, input-fältet och meddelande-elementet
let myForm = document.getElementById("myForm");
let nameInput = document.getElementById("nameInput");
let formMessage = document.getElementById("formMessage");

// Lägger till en event listener på formuläret för submit-händelsen
myForm.addEventListener("submit", function(event) {
    // Förhindrar att sidan laddas om (standardbeteendet för formulär)
    event.preventDefault();
    
    // Hämtar värdet från input-fältet och trimmar bort mellanslag
    let name = nameInput.value.trim();
    
    // Kontrollerar om fältet är tomt
    if (name === "") {
        // Om fältet är tomt, visa felmeddelande
        formMessage.textContent = "Du måste skriva in ett namn!";
        formMessage.style.color = "red";
    } else {
        // Om fältet inte är tomt, visa hälsning
        formMessage.textContent = "Hej, " + name + "!";
        formMessage.style.color = "green";
    }
});
```

**Förklaring:**
- `addEventListener("submit", ...)` lyssnar på när formuläret skickas (submit)
- `event.preventDefault()` förhindrar att sidan laddas om (standardbeteendet för formulär)
- `nameInput.value` hämtar texten som användaren skrivit i input-fältet
- `.trim()` tar bort mellanslag i början och slutet av texten
- `if (name === "")` kontrollerar om fältet är tomt
- Om tomt: visar felmeddelande i röd färg
- Om inte tomt: visar hälsning i grön färg
- `style.color` ändrar textfärgen på meddelandet
</details>

---

## Övning 7: Enkel funktion

Skapa en funktion `greet` som tar emot ett namn som parameter och skriver ut "Hej, [namn]!" i konsolen. Anropa funktionen med ditt eget namn.

<details>
<summary>Lösningsförslag</summary>

```javascript
// Skapar en funktion som heter greet och tar emot en parameter 'name'
function greet(name) {
  // Skriver ut hälsningen med namnet som skickades in
  console.log("Hej, " + name + "!");
}

// Anropar funktionen med olika namn
greet("Anna");
greet("Erik");
greet("Sara");
```

**Förklaring:**
- `function greet(name)` deklarerar en funktion med namnet `greet` som tar en parameter `name`
- Inuti funktionen används `console.log()` för att skriva ut meddelandet
- Funktionen anropas genom att skriva `greet("Anna")` där "Anna" är argumentet som skickas in
</details>

---

## Övning 8: Funktion med return

Skapa en funktion `multiply` som tar två tal som parametrar och returnerar deras produkt. Använd funktionen för att beräkna 5 × 7 och skriv ut resultatet i konsolen.

<details>
<summary>Lösningsförslag</summary>

```javascript
// Skapar en funktion som multiplicerar två tal
function multiply(a, b) {
  // Returnerar produkten av a och b
  return a * b;
}

// Anropar funktionen med 5 och 7, sparar resultatet i variabeln result
let result = multiply(5, 7);

// Skriver ut resultatet
console.log(result); // Skriver ut: 35
```

**Förklaring:**
- `function multiply(a, b)` tar två parametrar: `a` och `b`
- `return a * b` returnerar produkten av de två talen
- När funktionen anropas med `multiply(5, 7)`, returneras värdet 35
- Det returnerade värdet kan sparas i en variabel eller användas direkt
</details>

---

## Övning 9: If-else med ålder

Skapa en variabel `age` med ett värde. Skriv en if-else-sats som:
- Skriver ut "Du är myndig" om åldern är 18 eller högre
- Skriver ut "Du är inte myndig" om åldern är under 18

Testa med olika värden på `age`.

<details>
<summary>Lösningsförslag</summary>

```javascript
// Skapar en variabel med ålder
let age = 20;

// Kontrollerar om åldern är 18 eller högre
if (age >= 18) {
  // Om villkoret är sant (ålder >= 18)
  console.log("Du är myndig");
} else {
  // Om villkoret är falskt (ålder < 18)
  console.log("Du är inte myndig");
}

// Testa med olika värden:
// age = 18 → "Du är myndig"
// age = 17 → "Du är inte myndig"
// age = 25 → "Du är myndig"
```

**Förklaring:**
- `age >= 18` är ett villkor som kontrollerar om åldern är större än eller lika med 18
- Om villkoret är `true`, körs koden i if-blocket
- Om villkoret är `false`, körs koden i else-blocket
- `>=` betyder "större än eller lika med"
</details>

---

## Övning 10: If-else-if med betyg

Skapa en variabel `score` med ett värde mellan 0 och 100. Skriv en if-else-if-sats som ger betyg baserat på poängen:
- 90-100: "A"
- 80-89: "B"
- 70-79: "C"
- 60-69: "D"
- Under 60: "F"

Skriv ut betyget i konsolen.

<details>
<summary>Lösningsförslag</summary>

```javascript
// Skapar en variabel med poäng
let score = 85;

// Kontrollerar poängen och ger motsvarande betyg
if (score >= 90) {
  // Om poängen är 90 eller högre
  console.log("A");
} else if (score >= 80) {
  // Om poängen är 80-89 (kontrolleras bara om första villkoret var falskt)
  console.log("B");
} else if (score >= 70) {
  // Om poängen är 70-79
  console.log("C");
} else if (score >= 60) {
  // Om poängen är 60-69
  console.log("D");
} else {
  // Om poängen är under 60
  console.log("F");
}

// Exempel:
// score = 95 → "A"
// score = 85 → "B"
// score = 75 → "C"
// score = 65 → "D"
// score = 45 → "F"
```

**Förklaring:**
- `if-else-if` låter dig kontrollera flera villkor i sekvens
- Villkoren kontrolleras från topp till botten
- När ett villkor är sant, körs dess kod och resten hoppas över
- `else` är sista alternativet om inget av villkoren är sanna
</details>

---

## Övning 11: For-loop med räkning

Använd en for-loop för att skriva ut talen 1 till 10 i konsolen.

<details>
<summary>Lösningsförslag</summary>

```javascript
// For-loop som räknar från 1 till 10
for (let i = 1; i <= 10; i++) {
  // Skriver ut värdet av i för varje varv
  console.log(i);
}

// Utskrift:
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
// 10
```

**Förklaring:**
- `let i = 1` - Startvärde: räknaren börjar på 1
- `i <= 10` - Villkor: loopen fortsätter så länge i är mindre än eller lika med 10
- `i++` - Steg: ökar i med 1 efter varje varv
- `console.log(i)` - Körs för varje varv och skriver ut värdet av i
</details>

---

## Övning 12: For-loop med array

Skapa en array med namn: `["Anna", "Erik", "Sara", "Lars"]`. Använd en for-loop för att skriva ut varje namn i konsolen med texten "Hej, [namn]!".

<details>
<summary>Lösningsförslag</summary>

```javascript
// Skapar en array med namn
let names = ["Anna", "Erik", "Sara", "Lars"];

// For-loop som går igenom varje element i arrayen
for (let i = 0; i < names.length; i++) {
  // Skriver ut hälsning med varje namn
  console.log("Hej, " + names[i] + "!");
}

// Utskrift:
// Hej, Anna!
// Hej, Erik!
// Hej, Sara!
// Hej, Lars!
```

**Förklaring:**
- `names.length` ger antalet element i arrayen (4 i detta fall)
- `i < names.length` betyder att loopen går från 0 till 3 (index 0, 1, 2, 3)
- `names[i]` hämtar elementet på position i i arrayen
- Första varvet: i=0, names[0] = "Anna"
- Andra varvet: i=1, names[1] = "Erik", osv.
</details>

---

## Övning 13: While-loop

Använd en while-loop för att räkna ner från 10 till 1 och skriva ut varje tal i konsolen.

<details>
<summary>Lösningsförslag</summary>

```javascript
// Startar med värdet 10
let count = 10;

// While-loop som fortsätter så länge count är större än eller lika med 1
while (count >= 1) {
  // Skriver ut det aktuella värdet
  console.log(count);
  // Minskar count med 1 (räknar ner)
  count--;
}

// Utskrift:
// 10
// 9
// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
```

**Förklaring:**
- `let count = 10` - Startvärde för räknaren
- `while (count >= 1)` - Loopen fortsätter så länge count är större än eller lika med 1
- `console.log(count)` - Skriver ut värdet
- `count--` - Minskar count med 1 (samma som `count = count - 1`)
- Viktigt: Utan `count--` skulle loopen köra för evigt (oändlig loop)!
</details>

---

## Övning 14: Switch med veckodagar

Skapa en variabel `day` med en veckodag (t.ex. "måndag", "tisdag", etc.). Använd en switch-sats som skriver ut olika meddelanden beroende på vilken dag det är:
- "måndag": "Ny vecka börjar!"
- "fredag": "Snart helg!"
- "lördag" eller "söndag": "Helg!"
- Annat: "Vardag"

<details>
<summary>Lösningsförslag</summary>

```javascript
// Skapar en variabel med veckodag
let day = "fredag";

// Switch-sats som kontrollerar värdet på day
switch (day) {
  case "måndag":
    // Om day är "måndag"
    console.log("Ny vecka börjar!");
    break; // Avbryter switch-satsen
    
  case "fredag":
    // Om day är "fredag"
    console.log("Snart helg!");
    break;
    
  case "lördag":
  case "söndag":
    // Om day är "lördag" ELLER "söndag" (fall-through)
    console.log("Helg!");
    break;
    
  default:
    // Om inget av ovanstående matchar
    console.log("Vardag");
}

// Exempel:
// day = "måndag" → "Ny vecka börjar!"
// day = "fredag" → "Snart helg!"
// day = "lördag" → "Helg!"
// day = "tisdag" → "Vardag"
```

**Förklaring:**
- `switch (day)` kontrollerar värdet på variabeln `day`
- `case "måndag":` matchar om day är exakt "måndag"
- `break;` avbryter switch-satsen så att inga fler case körs
- Flera case kan köra samma kod genom att hoppa över break (fall-through)
- `default:` körs om inget case matchar
</details>

---

## Övning 15: Kombinera funktion och if-else

Skapa en funktion `checkNumber` som tar ett tal som parameter. Funktionen ska:
- Returnera "Positivt" om talet är större än 0
- Returnera "Negativt" om talet är mindre än 0
- Returnera "Noll" om talet är 0

Testa funktionen med olika tal och skriv ut resultatet.

<details>
<summary>Lösningsförslag</summary>

```javascript
// Funktion som kontrollerar om ett tal är positivt, negativt eller noll
function checkNumber(num) {
  // Kontrollerar om talet är större än 0
  if (num > 0) {
    return "Positivt";
  } 
  // Kontrollerar om talet är mindre än 0
  else if (num < 0) {
    return "Negativt";
  } 
  // Om talet varken är större eller mindre än 0, måste det vara 0
  else {
    return "Noll";
  }
}

// Testar funktionen med olika tal
console.log(checkNumber(5));   // Skriver ut: "Positivt"
console.log(checkNumber(-3));  // Skriver ut: "Negativt"
console.log(checkNumber(0));    // Skriver ut: "Noll"
```

**Förklaring:**
- Funktionen tar en parameter `num` (talet som ska kontrolleras)
- `if (num > 0)` kontrollerar om talet är större än 0
- `else if (num < 0)` kontrollerar om talet är mindre än 0
- `else` hanterar fallet när talet är exakt 0
- `return` skickar tillbaka resultatet till den som anropade funktionen
</details>

---

## Övning 16: Funktion med loop

Skapa en funktion `printNumbers` som tar två parametrar: `start` och `end`. Funktionen ska använda en for-loop för att skriva ut alla tal från `start` till `end` (inklusive båda) i konsolen.

Anropa funktionen med `printNumbers(5, 10)` och kontrollera att den skriver ut 5, 6, 7, 8, 9, 10.

<details>
<summary>Lösningsförslag</summary>

```javascript
// Funktion som skriver ut alla tal från start till end
function printNumbers(start, end) {
  // For-loop som börjar på start och fortsätter till end (inklusive)
  for (let i = start; i <= end; i++) {
    // Skriver ut varje tal
    console.log(i);
  }
}

// Anropar funktionen med start=5 och end=10
printNumbers(5, 10);

// Utskrift:
// 5
// 6
// 7
// 8
// 9
// 10
```

**Förklaring:**
- Funktionen tar två parametrar: `start` (början) och `end` (slutet)
- `let i = start` - Loopen börjar på start-värdet
- `i <= end` - Loopen fortsätter så länge i är mindre än eller lika med end
- `i++` - Ökar i med 1 för varje varv
- Funktionen kan användas med vilka tal som helst: `printNumbers(1, 5)` eller `printNumbers(10, 15)`
</details>

---

## Övning 17: Loop med if-else

Skapa en for-loop som går från 1 till 20. För varje tal ska du:
- Skriva ut "Jämnt" om talet är jämnt
- Skriva ut "Udda" om talet är udda

Tips: Använd modulo-operatorn `%` för att kontrollera om ett tal är jämnt.

<details>
<summary>Lösningsförslag</summary>

```javascript
// For-loop som går från 1 till 20
for (let i = 1; i <= 20; i++) {
  // Kontrollerar om talet är jämnt med modulo-operatorn
  if (i % 2 === 0) {
    // Om resten vid division med 2 är 0, är talet jämnt
    console.log(i + " är jämnt");
  } else {
    // Om resten inte är 0, är talet udda
    console.log(i + " är udda");
  }
}

// Utskrift:
// 1 är udda
// 2 är jämnt
// 3 är udda
// 4 är jämnt
// ... (och så vidare)
```

**Förklaring:**
- `i % 2` ger resten när i delas med 2
- Om resten är 0 (`i % 2 === 0`), är talet jämnt (delbart med 2)
- Om resten är 1, är talet udda
- Exempel: 4 % 2 = 0 (jämnt), 5 % 2 = 1 (udda)
</details>

---

## Övning 18: Funktion med switch

Skapa en funktion `getDayType` som tar en veckodag som parameter och returnerar:
- "Vardag" för måndag-fredag
- "Helg" för lördag-söndag

Använd en switch-sats inuti funktionen. Testa funktionen med olika veckodagar.

<details>
<summary>Lösningsförslag</summary>

```javascript
// Funktion som returnerar om en dag är vardag eller helg
function getDayType(day) {
  // Switch-sats som kontrollerar veckodagen
  switch (day) {
    case "måndag":
    case "tisdag":
    case "onsdag":
    case "torsdag":
    case "fredag":
      // Alla vardagar returnerar "Vardag"
      return "Vardag";
      
    case "lördag":
    case "söndag":
      // Helgdagar returnerar "Helg"
      return "Helg";
      
    default:
      // Om dagen inte matchar något case
      return "Okänd dag";
  }
}

// Testar funktionen
console.log(getDayType("måndag"));  // Skriver ut: "Vardag"
console.log(getDayType("fredag"));  // Skriver ut: "Vardag"
console.log(getDayType("lördag"));  // Skriver ut: "Helg"
console.log(getDayType("söndag"));  // Skriver ut: "Helg"
```

**Förklaring:**
- Funktionen tar en parameter `day` (veckodagen)
- Switch-satsen kontrollerar värdet på `day`
- Flera case kan köra samma kod genom att "falla igenom" (fall-through) utan break
- Alla vardagar (måndag-fredag) returnerar "Vardag"
- Helgdagar (lördag-söndag) returnerar "Helg"
- `return` avslutar funktionen och skickar tillbaka värdet
</details>

---

## Övning 19: Nästlade loopar

Använd två nästlade for-loopar för att skapa en multiplikationstabell. Den yttre loopen ska gå från 1 till 5, och den inre loopen ska också gå från 1 till 5. För varje kombination, skriv ut "[tal1] × [tal2] = [resultat]" i konsolen.

<details>
<summary>Lösningsförslag</summary>

```javascript
// Yttre loop som går från 1 till 5
for (let i = 1; i <= 5; i++) {
  // Inre loop som också går från 1 till 5
  for (let j = 1; j <= 5; j++) {
    // Beräknar produkten av i och j
    let result = i * j;
    // Skriver ut multiplikationen
    console.log(i + " × " + j + " = " + result);
  }
}

// Utskrift:
// 1 × 1 = 1
// 1 × 2 = 2
// 1 × 3 = 3
// 1 × 4 = 4
// 1 × 5 = 5
// 2 × 1 = 2
// 2 × 2 = 4
// ... (och så vidare)
```

**Förklaring:**
- Nästlade loopar betyder en loop inuti en annan loop
- Den yttre loopen (`i`) körs 5 gånger (1, 2, 3, 4, 5)
- För varje varv i den yttre loopen, körs den inre loopen (`j`) 5 gånger
- Totalt körs den inre loopen 5 × 5 = 25 gånger
- `i` och `j` används för att beräkna produkten
- Varje kombination av i och j skrivs ut
</details>

---

## Övning 20: Funktion som använder loop och if-else

Skapa en funktion `findMax` som tar en array med tal som parameter. Funktionen ska använda en loop för att hitta det största talet i arrayen och returnera det.

Testa med: `findMax([3, 7, 2, 9, 1, 5])` – ska returnera 9.

<details>
<summary>Lösningsförslag</summary>

```javascript
// Funktion som hittar det största talet i en array
function findMax(numbers) {
  // Startar med första talet i arrayen som största hittills
  let max = numbers[0];
  
  // Loopar igenom alla tal i arrayen (börjar på index 1 eftersom vi redan har index 0)
  for (let i = 1; i < numbers.length; i++) {
    // Kontrollerar om det aktuella talet är större än max
    if (numbers[i] > max) {
      // Om det är större, uppdatera max till det nya värdet
      max = numbers[i];
    }
  }
  
  // Returnera det största talet
  return max;
}

// Testar funktionen
let result = findMax([3, 7, 2, 9, 1, 5]);
console.log(result); // Skriver ut: 9

// Ytterligare exempel:
console.log(findMax([1, 5, 3]));        // Skriver ut: 5
console.log(findMax([-5, -2, -10]));   // Skriver ut: -2
```

**Förklaring:**
- Funktionen tar en array med tal som parameter
- `let max = numbers[0]` startar med första talet som största hittills
- Loopen går igenom resten av arrayen (från index 1)
- `if (numbers[i] > max)` kontrollerar om det aktuella talet är större
- Om det är större, uppdateras `max` till det nya värdet
- Efter loopen returneras det största talet som hittades
- Algoritmen jämför varje tal med det största hittills och uppdaterar vid behov
</details>

---

## Sammanfattning och nästa steg

Genom att göra dessa övningar får du praktisk erfarenhet av:
- **DOM-manipulation och händelser** (övning 1-6): Att ändra innehåll på webbsidor och hantera användarinteraktioner
- **Funktioner** (övning 7-8, 15-16, 18, 20): Att skapa återanvändbar kod och strukturera ditt program
- **Villkorssatser** (övning 9-10, 14-15, 17-18, 20): Att använda if-else och switch för att fatta beslut
- **Loopar** (övning 11-13, 16-17, 19-20): Att upprepa kod med for och while
- **Kombinationer** (övning 15-20): Att kombinera olika koncept för att lösa mer komplexa problem

Fortsätt experimentera – prova att lägga till fler funktioner, kombinera övningarna eller skapa egna små projekt!

I nästa kapitel lär du dig mer om hur du strukturerar och återanvänder kod med funktioner och moduler, samt hur du arbetar med mer avancerade datatyper och asynkrona operationer.