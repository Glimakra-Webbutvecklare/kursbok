# Kontrollstrukturer och Loopar i JavaScript

Program behöver ofta fatta beslut baserat på olika villkor eller upprepa en viss handling flera gånger. För detta använder JavaScript **kontrollstrukturer** (som `if`/`else` och `switch`) och **loopar** (som `for` och `while`).

**Mål:** Lära oss använda `if`, `else if`, `else` för att köra kod villkorligt, använda `switch` för att hantera flera specifika fall, och använda olika typer av loopar (`for`, `for...of`, `while`, `do...while`) för att upprepa kod.

## Villkorssatser: Att Fatta Beslut

**1. `if`-satsen:**

*   Kör ett kodblock *endast* om ett specifikt villkor är `true`.
*   Villkoret skrivs inom parentes `()` och ska resultera i ett booleskt värde (`true` eller `false`).

    ```javascript
    let temperature = 15;

    if (temperature < 0) {
      console.log("Det är minusgrader!");
    }

    console.log("Programmet fortsätter...");
    // Output: Programmet fortsätter... (eftersom 15 inte är mindre än 0)
    ```

**2. `if...else`-satsen:**

*   Kör det första kodblocket om villkoret är `true`, annars körs kodblocket efter `else`.

    ```javascript
    let age = 17;

    if (age >= 18) {
      console.log("Du är myndig.");
    } else {
      console.log("Du är inte myndig än.");
    }
    // Output: Du är inte myndig än.
    ```

**3. `if...else if...else`-satsen:**

*   Testar flera villkor i följd. Så fort ett villkor är `true` körs dess kodblock, och resten av `else if`/`else`-kedjan ignoreras.
*   `else`-blocket (valfritt) körs om *inget* av de föregående `if`- eller `else if`-villkoren var `true`.

    ```javascript
    let score = 78;

    if (score >= 90) {
      console.log("Betyg: A");
    } else if (score >= 80) {
      console.log("Betyg: B");
    } else if (score >= 70) {
      console.log("Betyg: C"); // Detta villkor är sant
    } else if (score >= 60) {
      console.log("Betyg: D");
    } else {
      console.log("Betyg: F");
    }
    // Output: Betyg: C
    ```

**4. `switch`-satsen:**

*   Ett alternativ till långa `if...else if...else`-kedjor när man vill jämföra ett enda värde mot flera specifika *konstanta* värden (cases).
*   **Viktigt:** Använd `break;` efter varje `case`-block för att förhindra "fall-through" (att koden fortsätter exekvera i nästa `case`).
*   `default`-blocket (valfritt) körs om inget `case` matchar.

    ```javascript
    let dayOfWeek = 3; // 1 = Måndag, 2 = Tisdag, ...
    let dayName;

    switch (dayOfWeek) {
      case 1:
        dayName = "Måndag";
        break; // Hoppar ut ur switchen
      case 2:
        dayName = "Tisdag";
        break;
      case 3:
        dayName = "Onsdag";
        break;
      case 4:
        dayName = "Torsdag";
        break;
      case 5:
        dayName = "Fredag";
        break;
      case 6:
      case 7: // Fall-through: både 6 och 7 ger "Helg"
        dayName = "Helg";
        break;
      default:
        dayName = "Ogiltig dag";
    }

    console.log(dayName); // Output: Onsdag
    ```

## Loopar: Att Upprepa Kod

Loopar används för att köra samma kodblock flera gånger.

**1. `for`-loopen:**

*   Den vanligaste loopen när du vet (eller kan räkna ut) *hur många gånger* du vill upprepa.
*   Har tre delar inom parentesen, separerade med semikolon:
    1.  **Initiering:** Körs *en gång* innan loopen startar (oftast för att skapa en räknare, t.ex. `let i = 0`).
    2.  **Villkor:** Kontrolleras *före varje* iteration. Så länge villkoret är `true` körs loopen.
    3.  **Uppdatering:** Körs *efter varje* iteration (oftast för att öka räknaren, t.ex. `i++`).

    ```javascript
    // Skriver ut siffrorna 0 till 4
    for (let i = 0; i < 5; i++) {
      console.log("Iteration nummer:", i);
    }
    // Output:
    // Iteration nummer: 0
    // Iteration nummer: 1
    // Iteration nummer: 2
    // Iteration nummer: 3
    // Iteration nummer: 4
    ```

**2. `for...of`-loopen (ES6):**

*   Ett enklare sätt att iterera (gå igenom) elementen i en **iterable** (som en array eller en sträng).
*   Du får direkt tillgång till *värdet* av varje element i turordning.

    ```javascript
    const colors = ["Röd", "Grön", "Blå"];

    for (const color of colors) {
      console.log(color);
    }
    // Output:
    // Röd
    // Grön
    // Blå

    const message = "Hej";
    for (const character of message) {
        console.log(character);
    }
    // Output:
    // H
    // e
    // j
    ```

**3. `while`-loopen:**

*   Kör ett kodblock *så länge* ett villkor är `true`.
*   Villkoret testas *före* varje iteration.
*   **Varning:** Var noga med att villkoret någon gång blir `false`, annars riskerar du en **oändlig loop** som låser webbläsaren! Se till att något inuti loopen påverkar villkoret (t.ex. en räknare som ökas).

    ```javascript
    let count = 0;
    while (count < 3) {
      console.log("Räknare är:", count);
      count++; // Viktigt att öka räknaren!
    }
    // Output:
    // Räknare är: 0
    // Räknare är: 1
    // Räknare är: 2
    ```

**4. `do...while`-loopen:**

*   Liknar `while`, men med en viktig skillnad: villkoret testas *efter* kodblocket har körts.
*   Detta garanterar att kodblocket körs **minst en gång**, även om villkoret är `false` från början.

    ```javascript
    let attempts = 5;
    do {
      console.log("Försöker ansluta... Försök kvar:", attempts);
      attempts--;
    } while (attempts > 3);
    // Output:
    // Försöker ansluta... Försök kvar: 5
    // Försöker ansluta... Försök kvar: 4
    ```

## `break` och `continue` i Loopar

*   `break;`: Avbryter loopen omedelbart och hoppar ut ur den.
*   `continue;`: Hoppar över resten av den *aktuella* iterationen och går direkt till nästa.

    ```javascript
    for (let i = 0; i < 10; i++) {
      if (i === 3) {
        continue; // Hoppar över när i är 3
      }
      if (i === 7) {
        break; // Avbryter loopen helt när i är 7
      }
      console.log(i);
    }
    // Output: 0, 1, 2, 4, 5, 6
    ```

## Sammanfattning

Kontrollstrukturer låter oss styra *om* och *hur* kod körs. `if`/`else if`/`else` används för att fatta beslut baserat på villkor. `switch` är användbart för att jämföra ett värde mot flera specifika fall. Loopar (`for`, `for...of`, `while`, `do...while`) används för att upprepa kod. `break` och `continue` kan användas för att kontrollera loopens flöde ytterligare.

Att kunna styra kodflödet är avgörande för att skriva program som gör mer än bara utför instruktioner i rak följd. I nästa avsnitt ska vi se hur JavaScript kan interagera med själva HTML-sidan.

## Övningar

### 1. While-loop
Skriv en while-loop som räknar ner från 10 till 0 och skriver ut varje tal.

```js
let count = 10;
// fortsätt med din lösning
```

### 2. Array-transformation
Skapa en array med temperaturer i Celsius och använd map för att konvertera dem till Fahrenheit.
(Formel: F = C * 9/5 + 32)

```js
// array med celsius temperaturer
let celsiusTemp = [0, 10, 20, 30, 40];
// fortsätt med din lösning
```

### 3. Filtrering med forEach
Använd forEach för att skriva ut alla jämna tal i en array.

```js
// array siffror
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// fortsätt med din lösning
```

### Lösningsförslag

#### Övning 1
```js
let count = 10;
while (count >= 0) {
    console.log(count);
    count--;
}
// Utskrift: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
```

#### Övning 2
```js
let celsiusTemp = [0, 10, 20, 30, 40];
let fahrenheitTemp = celsiusTemp.map(temp => temp * 9/5 + 32);
console.log(fahrenheitTemp);
// Utskrift: [32, 50, 68, 86, 104]
```

#### Övning 3
```js
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
numbers.forEach(num => {
    if (num % 2 === 0) {
        console.log(num);
    }
});
// Utskrift: 2, 4, 6, 8, 10
```