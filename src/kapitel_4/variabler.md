# Variabler och Datatyper i JavaScript

För att kunna arbeta med information i ett program behöver vi ett sätt att lagra och referera till den. I JavaScript, precis som i de flesta programmeringsspråk, gör vi detta med **variabler**. En variabel är som en namngiven behållare där vi kan spara ett värde (som en siffra, en textsträng, etc.).

**Mål:** Lära oss hur man deklarerar variabler med `let` och `const`, förstå de grundläggande (primitiva) datatyperna i JavaScript, samt få en introduktion till de mer komplexa typerna Objekt och Arrayer.

## Deklarera Variabler: `let` och `const`

I modern JavaScript (ES6 och senare) använder vi främst två nyckelord för att skapa (deklarera) variabler:

**1. `let`:**

*   Används för att deklarera variabler vars värde **kan komma att ändras** senare i koden.
*   Har **block-scope**, vilket betyder att variabeln bara är tillgänglig inom det kodblock (`{ ... }`) där den deklareras (t.ex. inuti en `if`-sats eller en loop).

    ```javascript
    let age = 30;
    console.log("Ålder:", age); // Output: Ålder: 30

    age = 31; // Vi kan ändra värdet på en let-variabel
    console.log("Ny ålder:", age); // Output: Ny ålder: 31

    if (true) {
      let message = "Inuti blocket";
      console.log(message); // Output: Inuti blocket
    }
    // console.log(message); // Fel! message är inte tillgänglig här utanför blocket.
    ```

**2. `const` (Constant):**

*   Används för att deklarera variabler vars värde **inte ska ändras** efter att det har satts första gången. Man måste ge variabeln ett värde direkt vid deklarationen.
*   Har också **block-scope**.
*   **Använd `const` som standard!** Det gör din kod säkrare och lättare att förstå, eftersom det signalerar att värdet inte är tänkt att ändras. Använd bara `let` när du vet att du *behöver* kunna ändra värdet.

    ```javascript
    const name = "Alice";
    console.log("Namn:", name); // Output: Namn: Alice

    // name = "Bob"; // Fel! Försök att ändra en konstant ger ett TypeError.

    const PI = 3.14159;
    ```

**Vad hände med `var`?**

Du kanske ser äldre JavaScript-kod som använder `var` för att deklarera variabler. `var` fungerar annorlunda än `let` och `const` (den har *function-scope* eller global scope, inte block-scope, och har andra egenheter kring *hoisting*). **Undvik att använda `var` i ny kod.** Håll dig till `let` och `const`.

## Primitiva Datatyper

JavaScript har flera inbyggda, grundläggande (primitiva) datatyper som representerar olika sorters enkla värden:

1.  **`string` (Sträng):**
    *   Används för text.
    *   Skrivs inom enkla (`'`) eller dubbla (`"`) citationstecken.
    *   **Template Literals (Mallsträngar):** Använder backticks (`` ` ``) och tillåter enklare infogning av variabler (`${variabelNamn}`) och flerradig text.
        ```javascript
        let firstName = 'Bob';
        let lastName = "Smith";
        let greeting = `Hej, ${firstName} ${lastName}! 
Välkommen.`; // Använder template literal
        console.log(greeting);
        // Output:
        // Hej, Bob Smith! 
        // Välkommen.

        console.log(typeof greeting); // Output: string
        ```

2.  **`number` (Tal):**
    *   Används för alla typer av numeriska värden, både heltal och decimaltal.
    *   JavaScript skiljer inte på heltal (integers) och flyttal (floats) som vissa andra språk.
    *   Speciella talvärden: `Infinity`, `-Infinity`, `NaN` (Not a Number - resultat av ogiltiga matematiska operationer, t.ex. `0 / 0`).
        ```javascript
        let count = 10;
        let price = 99.50;
        let temperature = -5;
        console.log(typeof count); // Output: number
        console.log(10 / 0); // Output: Infinity
        console.log("text" * 2); // Output: NaN
        ```

3.  **`boolean` (Boolesk):**
    *   Representerar ett logiskt värde: antingen `true` (sant) eller `false` (falskt).
    *   Används ofta i villkorssatser (`if`) och loopar.
        ```javascript
        let isLoggedIn = true;
        let hasPermission = false;
        console.log(typeof isLoggedIn); // Output: boolean
        ```

4.  **`undefined`:**
    *   Representerar ett värde som **inte har tilldelats ännu**. Variabler som deklareras med `let` men inte får ett värde direkt blir automatiskt `undefined`.
        ```javascript
        let data;
        console.log(data); // Output: undefined
        console.log(typeof data); // Output: undefined
        ```

5.  **`null`:**
    *   Representerar avsiktlig **frånvaro av ett värde**. Det är ett värde man aktivt tilldelar för att indikera att en variabel inte har något (meningsfullt) värde just nu.
        ```javascript
        let error = null; // Inget fel har inträffat (än)
        console.log(error); // Output: null
        // OBS! typeof null ger "object" - detta är en historisk bugg i JS.
        console.log(typeof error); // Output: object
        ```

6.  **`symbol` (ES6):**
    *   Används för att skapa garanterat **unika identifierare**. Används mer sällan i vanlig applikationskod, oftare i bibliotek och ramverk för att undvika namnkonflikter.
        ```javascript
        const id1 = Symbol('desc');
        const id2 = Symbol('desc');
        console.log(id1 === id2); // Output: false (även om beskrivningen är samma)
        console.log(typeof id1); // Output: symbol
        ```

7.  **`bigint` (ES2020):**
    *   Används för att representera heltal som är för stora för att representeras säkert av den vanliga `number`-typen (större än \(2^{53}-1\)). Skapas genom att lägga till `n` i slutet av ett heltal eller använda `BigInt()`-funktionen.
        ```javascript
        const veryLargeNumber = 9007199254740991n;
        const anotherLarge = BigInt("9007199254740992");
        console.log(typeof veryLargeNumber); // Output: bigint
        ```

## Komplexa Datatyper: Objekt och Arrayer (Introduktion)

Utöver de primitiva typerna finns två viktiga komplexa datatyper:

**1. `object` (Objekt):**

*   En samling av **egenskaper (properties)**, där varje egenskap är ett **nyckel-värde-par**. Nycklarna är oftast strängar, och värdena kan vara vilken datatyp som helst (inklusive andra objekt eller funktioner).
*   Används för att representera mer komplexa entiteter med flera relaterade data.
*   Skapas med måsvingar `{}`.

    ```javascript
    const person = {
      firstName: "Carla", // Egenskap: nyckel='firstName', värde='Carla' (string)
      lastName: "Gustavsson",
      age: 28, // Egenskap: nyckel='age', värde=28 (number)
      isStudent: false, // Egenskap: nyckel='isStudent', värde=false (boolean)
      address: { // Egenskap: nyckel='address', värde=ett annat objekt
        street: "Storgatan 1",
        city: "Stockholm"
      }
    };

    // Åtkomst till egenskaper med punktnotation
    console.log(person.firstName); // Output: Carla
    console.log(person.address.city); // Output: Stockholm

    // Åtkomst med hakparentesnotation (användbart om nyckeln är en variabel)
    console.log(person["lastName"]); // Output: Gustavsson
    ```

**2. `array` (Array/Fält):**

*   En **ordnad lista** av värden. Varje värde i listan kallas ett **element**, och varje element har en **indexposition** (börjar från 0).
*   Kan innehålla värden av olika datatyper.
*   Används för att lagra sekvenser av data.
*   Skapas med hakparenteser `[]`.

    ```javascript
    const colors = ["Röd", "Grön", "Blå"]; // En array med tre strängar
    const mixedData = [10, "Text", true, null];

    // Åtkomst till element via index (börjar från 0)
    console.log(colors[0]); // Output: Röd
    console.log(colors[1]); // Output: Grön

    // Ändra ett element
    colors[1] = "Gul";
    console.log(colors); // Output: ["Röd", "Gul", "Blå"]

    // Hitta antal element
    console.log(colors.length); // Output: 3
    ```
*   Notera: `typeof` för en array ger också `"object"`. För att specifikt kolla om något är en array, använd `Array.isArray(dinVariabel)`.

## Typomvandling (Type Coercion)

JavaScript är ett *dynamiskt typat* språk, vilket betyder att du inte behöver specificera datatypen när du deklarerar en variabel. JavaScript försöker ofta automatiskt konvertera mellan datatyper när du använder operatorer, vilket kallas *typomvandling* (type coercion). Detta kan ibland leda till oväntade resultat.

```javascript
console.log("5" + 3); // Output: "53" (string - + fungerar som konkatenering)
console.log("5" - 3); // Output: 2 (number - - försöker göra matematisk subtraktion)
console.log("5" * 3); // Output: 15 (number)
console.log(5 + null); // Output: 5 (null omvandlas till 0)
console.log("hello" + undefined); // Output: "helloundefined"
```
Var medveten om detta och var försiktig när du blandar datatyper.

## Sammanfattning

Variabler (`let` och `const`) är namngivna behållare för data. `const` bör föredras. JavaScript har sju primitiva datatyper: `string`, `number`, `boolean`, `undefined`, `null`, `symbol` och `bigint`. För mer komplex data används `object` (nyckel-värde-par) och `array` (ordnade listor). JavaScript är dynamiskt typat och utför automatisk typomvandling, vilket man bör vara medveten om.

I nästa avsnitt ska vi titta på hur vi kan gruppera kod i återanvändbara block med hjälp av funktioner.