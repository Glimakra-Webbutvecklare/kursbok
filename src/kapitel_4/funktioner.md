# Funktioner och Scope i JavaScript

När vi skriver kod vill vi ofta kunna återanvända vissa kodstycken på flera ställen eller gruppera kod som utför en specifik uppgift. I JavaScript gör vi detta med **funktioner**. Funktioner är en av de mest fundamentala byggstenarna i språket.

Vi behöver också förstå **scope** (räckvidd eller omfång), som bestämmer var i koden våra variabler är tillgängliga.

**Mål:** Lära oss definiera och anropa funktioner på olika sätt (inklusive arrow functions), förstå skillnaden mellan parametrar och argument, och förstå hur globalt, lokalt och block-scope fungerar för variabler.

## Vad är en Funktion?

En funktion är ett namngivet block av kod som är designat för att utföra en specifik uppgift. Funktioner gör koden mer:

*   **Återanvändbar:** Istället för att skriva samma kod om och om igen, skriver du den en gång i en funktion och anropar sedan funktionen när du behöver den.
*   **Modulär:** Bryter ner komplexa problem i mindre, hanterbara delar.
*   **Läsbar:** Ger koden struktur och gör den lättare att följa.

Funktioner kan ta emot indata (via **parametrar**) och kan returnera ett värde (med `return`-nyckelordet).

## Funktionsdeklaration (Function Declaration)

Det klassiska sättet att definiera en funktion.

```javascript
// Deklaration av funktionen "add"
function add(num1, num2) { // num1 och num2 är parametrar
  const sum = num1 + num2;
  return sum; // Returnerar resultatet
}

// Anrop av funktionen med argument (5 och 3)
let result = add(5, 3);
console.log(result); // Output: 8

// Anropa igen med andra argument
console.log( add(10, -2) ); // Output: 8
```

*   **`function`:** Nyckelordet som startar deklarationen.
*   **`add`:** Funktionens namn.
*   **`(num1, num2)`:** Parameterlistan. Dessa är som lokala variabler inuti funktionen som tar emot värdena som skickas in när funktionen anropas.
*   **`{ ... }`:** Funktionskroppen, där koden som ska utföras finns.
*   **`return sum;`:** `return`-satsen specificerar vilket värde funktionen ska "skicka tillbaka" till den plats där den anropades. Om `return` saknas, returnerar funktionen automatiskt `undefined`.
*   **`add(5, 3)`:** Ett **funktionsanrop (function call)**. Värdena `5` och `3` kallas **argument** och tilldelas till parametrarna `num1` respektive `num2`.

## Funktionsuttryck (Function Expression)

Man kan också skapa en funktion och tilldela den till en variabel. Funktionen är då ofta **anonym** (saknar eget namn efter `function`-nyckelordet).

```javascript
const multiply = function(num1, num2) {
  return num1 * num2;
}; // Notera semikolon här eftersom det är en variabeltilldelning

let product = multiply(4, 6);
console.log(product); // Output: 24
```
Skillnaden mot funktionsdeklarationer är subtil och handlar främst om *hoisting* (se nedan). I många fall är de utbytbara.

## Arrow Functions (Pilfunktioner, ES6)

Ett modernare och oftast kortare sätt att skriva funktionsuttryck.

```javascript
// Lång form
const subtract = (num1, num2) => {
  return num1 - num2;
};

// Kort form (om funktionen bara har en return-sats)
const divide = (num1, num2) => num1 / num2;

// Ännu kortare form (om funktionen bara har EN parameter)
const square = num => num * num;

console.log(subtract(10, 7)); // Output: 3
console.log(divide(20, 4));   // Output: 5
console.log(square(9));     // Output: 81
```

*   Använder `=>` (pil) istället för `function`-nyckelordet.
*   Om det bara finns en parameter behövs inga parenteser runt den (`num => ...`).
*   Om funktionskroppen bara består av en enda `return`-sats kan måsvingarna `{}` och `return`-nyckelordet utelämnas.
*   Arrow functions har också en viktig skillnad i hur de hanterar `this`-nyckelordet (vilket vi utforskar i senare kapitel), men för enkla funktioner är de ofta ett smidigt alternativ.

## Scope: Var är Variabeln Tillgänglig?

Scope avgör varifrån i koden du kan komma åt en variabel.

**1. Global Scope:**

*   Variabler deklarerade *utanför* alla funktioner och block (`{}`) är globala.
*   De kan nås från *var som helst* i din kod (i samma scriptfil eller HTML-sida).
*   **Undvik globala variabler så mycket som möjligt!** De kan lätt leda till namnkonflikter och göra koden svår att följa och felsöka.

    ```javascript
    const globalMessage = "Detta är globalt";

    function showMessage() {
      console.log(globalMessage); // Kan nås inuti funktionen
    }

    showMessage();
    console.log(globalMessage); // Kan nås även här
    ```

**2. Lokalt Scope (Funktionsscope):**

*   Variabler deklarerade *inuti* en funktion (med `let`, `const`, eller det äldre `var`) är lokala till den funktionen.
*   De kan **endast** nås inifrån den funktion där de skapades.

    ```javascript
    function calculate() {
      const localSecret = 42;
      let innerResult = localSecret * 2;
      console.log("Inuti calculate:", innerResult);
    }

    calculate(); // Output: Inuti calculate: 84
    // console.log(localSecret); // Fel! localSecret är inte definierad här.
    // console.log(innerResult); // Fel! innerResult är inte definierad här.
    ```

**3. Block Scope (för `let` och `const`):**

*   Variabler deklarerade med `let` och `const` *inuti* ett block (kod omgiven av måsvingar `{}`, t.ex. i en `if`-sats eller `for`-loop) är lokala till det blocket.
*   De kan **endast** nås inifrån det blocket.

    ```javascript
    if (true) {
      const blockVar = "Syns bara här";
      let anotherBlockVar = 100;
      console.log(blockVar); // Output: Syns bara här
    }

    // console.log(blockVar); // Fel! blockVar är inte definierad här.
    // console.log(anotherBlockVar); // Fel!

    // Variabel i loop
    for (let i = 0; i < 3; i++) {
      console.log(i); // i är bara tillgänglig här inne
    }
    // console.log(i); // Fel! i är inte definierad här.
    ```
*   Detta är en stor fördel med `let` och `const` jämfört med `var`, som *inte* har block scope.

## Hoisting (Lyftning)

JavaScript har ett beteende som kallas hoisting. Det innebär att *deklarationer* av variabler (med `var`) och funktioner (deklarerade med `function`) "flyttas" upp till toppen av sitt scope *innan* koden exekveras.

*   **Funktionsdeklarationer:** Hela funktionen hissas upp, vilket betyder att du kan anropa en funktion *innan* den är definierad i koden.
    ```javascript
    hoistedFunction(); // Fungerar!

    function hoistedFunction() {
      console.log("Jag blev hissad!");
    }
    ```
*   **`var`-variabler:** Endast *deklarationen* hissas, inte *tilldelningen*. Variabeln existerar från början av scopet, men dess värde är `undefined` tills tilldelningsraden nås.
    ```javascript
    console.log(myVar); // Output: undefined (inte fel!)
    var myVar = "Nu har jag ett värde";
    console.log(myVar); // Output: Nu har jag ett värde
    ```
*   **`let` och `const`:** Deklarationerna hissas också, men de initieras *inte*. Att försöka komma åt dem innan deklarationsraden resulterar i ett `ReferenceError` (detta kallas ibland Temporal Dead Zone - TDZ). Detta är oftast ett säkrare beteende än med `var`.
    ```javascript
    // console.log(myLet); // Fel! ReferenceError: Cannot access 'myLet' before initialization
    let myLet = "Värde";
    ```

**Slutsats om Hoisting:** Känn till att det finns, men skriv din kod som om det inte fanns – deklarera funktioner och variabler innan du använder dem för tydlighets skull. Förlita dig inte på hoisting för `var`.

## Sammanfattning

Funktioner (`function`, funktionsuttryck, arrow functions `=>`) är återanvändbara kodblock som kan ta parametrar och returnera värden. Scope (globalt, lokalt/funktions-, block-) bestämmer var variabler är tillgängliga. `let` och `const` har block scope och är att föredra framför `var`. Hoisting flyttar deklarationer uppåt, men `let` och `const` ger fel om de används före sin deklaration.

I nästa avsnitt tittar vi på hur vi styr kodens flöde med villkorssatser och loopar.

