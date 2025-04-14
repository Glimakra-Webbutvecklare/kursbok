# Kontrollstrukturer och Loopar i JavaScript

Program behöver ofta fatta beslut baserat på olika villkor eller upprepa en viss handling flera gånger. För detta använder JavaScript **kontrollstrukturer** (som `if`/`else` och `switch`) och **loopar** (som `for` och `while`).\n\n**Mål:** Lära oss använda `if`, `else if`, `else` för att köra kod villkorligt, använda `switch` för att hantera flera specifika fall, och använda olika typer av loopar (`for`, `for...of`, `while`, `do...while`) för att upprepa kod.\n\n## Villkorssatser: Att Fatta Beslut\n\n**1. `if`-satsen:**\n\n*   Kör ett kodblock *endast* om ett specifikt villkor är `true`.\n*   Villkoret skrivs inom parentes `()` och ska resultera i ett booleskt värde (`true` eller `false`).\n\n    ```javascript\n    let temperature = 15;\n\n    if (temperature < 0) {\n      console.log(\"Det är minusgrader!\");\n    }\n\n    console.log(\"Programmet fortsätter...\");\n    // Output: Programmet fortsätter... (eftersom 15 inte är mindre än 0)\n    ```\n\n**2. `if...else`-satsen:**\n\n*   Kör det första kodblocket om villkoret är `true`, annars körs kodblocket efter `else`.\n\n    ```javascript\n    let age = 17;\n\n    if (age >= 18) {\n      console.log(\"Du är myndig.\");\n    } else {\n      console.log(\"Du är inte myndig än.\");\n    }\n    // Output: Du är inte myndig än.\n    ```\n\n**3. `if...else if...else`-satsen:**\n\n*   Testar flera villkor i följd. Så fort ett villkor är `true` körs dess kodblock, och resten av `else if`/`else`-kedjan ignoreras.\n*   `else`-blocket (valfritt) körs om *inget* av de föregående `if`- eller `else if`-villkoren var `true`.\n\n    ```javascript\n    let score = 78;\n\n    if (score >= 90) {\n      console.log(\"Betyg: A\");\n    } else if (score >= 80) {\n      console.log(\"Betyg: B\");\n    } else if (score >= 70) {\n      console.log(\"Betyg: C\"); // Detta villkor är sant\n    } else if (score >= 60) {\n      console.log(\"Betyg: D\");\n    } else {\n      console.log(\"Betyg: F\");\n    }\n    // Output: Betyg: C\n    ```\n\n**4. `switch`-satsen:**\n\n*   Ett alternativ till långa `if...else if...else`-kedjor när man vill jämföra ett enda värde mot flera specifika *konstanta* värden (cases).\n*   **Viktigt:** Använd `break;` efter varje `case`-block för att förhindra \"fall-through\" (att koden fortsätter exekvera i nästa `case`).\n*   `default`-blocket (valfritt) körs om inget `case` matchar.\n\n    ```javascript\n    let dayOfWeek = 3; // 1 = Måndag, 2 = Tisdag, ...\n    let dayName;\n\n    switch (dayOfWeek) {\n      case 1:\n        dayName = \"Måndag\";\n        break; // Hoppar ut ur switchen\n      case 2:\n        dayName = \"Tisdag\";\n        break;\n      case 3:\n        dayName = \"Onsdag\";\n        break;\n      case 4:\n        dayName = \"Torsdag\";\n        break;\n      case 5:\n        dayName = \"Fredag\";\n        break;\n      case 6:\n      case 7: // Fall-through: både 6 och 7 ger \"Helg\"\n        dayName = \"Helg\";\n        break;\n      default:\n        dayName = \"Ogiltig dag\";\n    }\n\n    console.log(dayName); // Output: Onsdag\n    ```\n\n## Loopar: Att Upprepa Kod\n\nLoopar används för att köra samma kodblock flera gånger.\n\n**1. `for`-loopen:**\n\n*   Den vanligaste loopen när du vet (eller kan räkna ut) *hur många gånger* du vill upprepa.\n*   Har tre delar inom parentesen, separerade med semikolon:\n    1.  **Initiering:** Körs *en gång* innan loopen startar (oftast för att skapa en räknare, t.ex. `let i = 0`).\n    2.  **Villkor:** Kontrolleras *före varje* iteration. Så länge villkoret är `true` körs loopen.\n    3.  **Uppdatering:** Körs *efter varje* iteration (oftast för att öka räknaren, t.ex. `i++`).\n\n    ```javascript\n    // Skriver ut siffrorna 0 till 4\n    for (let i = 0; i < 5; i++) {\n      console.log(\"Iteration nummer:\", i);\n    }\n    // Output:\n    // Iteration nummer: 0\n    // Iteration nummer: 1\n    // Iteration nummer: 2\n    // Iteration nummer: 3\n    // Iteration nummer: 4\n    ```\n\n**2. `for...of`-loopen (ES6):**\n\n*   Ett enklare sätt att iterera (gå igenom) elementen i en **iterable** (som en array eller en sträng).\n*   Du får direkt tillgång till *värdet* av varje element i turordning.\n\n    ```javascript\n    const colors = [\"Röd\", \"Grön\", \"Blå\"];\n\n    for (const color of colors) {\n      console.log(color);\n    }\n    // Output:\n    // Röd\n    // Grön\n    // Blå\n\n    const message = \"Hej\";\n    for (const character of message) {\n        console.log(character);\n    }\n    // Output:\n    // H\n    // e\n    // j\n    ```\n\n**3. `while`-loopen:**\n\n*   Kör ett kodblock *så länge* ett villkor är `true`.\n*   Villkoret testas *före* varje iteration.\n*   **Varning:** Var noga med att villkoret någon gång blir `false`, annars riskerar du en **oändlig loop** som låser webbläsaren! Se till att något inuti loopen påverkar villkoret (t.ex. en räknare som ökas).\n\n    ```javascript\n    let count = 0;\n    while (count < 3) {\n      console.log(\"Räknare är:\", count);\n      count++; // Viktigt att öka räknaren!\n    }\n    // Output:\n    // Räknare är: 0\n    // Räknare är: 1\n    // Räknare är: 2\n    ```\n\n**4. `do...while`-loopen:**\n\n*   Liknar `while`, men med en viktig skillnad: villkoret testas *efter* kodblocket har körts.\n*   Detta garanterar att kodblocket körs **minst en gång**, även om villkoret är `false` från början.\n\n    ```javascript\n    let attempts = 5;\n    do {\n      console.log(\"Försöker ansluta... Försök kvar:\", attempts);\n      attempts--;\n    } while (attempts > 3);\n    // Output:\n    // Försöker ansluta... Försök kvar: 5\n    // Försöker ansluta... Försök kvar: 4\n    ```\n\n## `break` och `continue` i Loopar\n\n*   `break;`: Avbryter loopen omedelbart och hoppar ut ur den.\n*   `continue;`: Hoppar över resten av den *aktuella* iterationen och går direkt till nästa.\n\n    ```javascript\n    for (let i = 0; i < 10; i++) {\n      if (i === 3) {\n        continue; // Hoppar över när i är 3\n      }\n      if (i === 7) {\n        break; // Avbryter loopen helt när i är 7\n      }\n      console.log(i);\n    }\n    // Output: 0, 1, 2, 4, 5, 6\n    ```\n\n## Sammanfattning\n\nKontrollstrukturer låter oss styra *om* och *hur* kod körs. `if`/`else if`/`else` används för att fatta beslut baserat på villkor. `switch` är användbart för att jämföra ett värde mot flera specifika fall. Loopar (`for`, `for...of`, `while`, `do...while`) används för att upprepa kod. `break` och `continue` kan användas för att kontrollera loopens flöde ytterligare.\n\nAtt kunna styra kodflödet är avgörande för att skriva program som gör mer än bara utför instruktioner i rak följd. I nästa avsnitt ska vi se hur JavaScript kan interagera med själva HTML-sidan.

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