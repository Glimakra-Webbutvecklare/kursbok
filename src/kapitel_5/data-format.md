# Dataformat: JSON

När vi hämtar data från ett API med `fetch`, eller när vi vill skicka data till ett API, behöver vi ett standardiserat format för att representera den datan som text. Det absolut vanligaste formatet för detta på webben idag är **JSON (JavaScript Object Notation)**.

**Varför JSON?**

*   **Läsbart:** Det är relativt lätt för människor att läsa och skriva.
*   **Lättviktigt:** Det är ett kompakt textformat, vilket är effektivt för dataöverföring.
*   **JavaScript-vänligt:** Som namnet antyder är syntaxen väldigt lik JavaScripts objektsyntax, vilket gör det extremt enkelt att arbeta med i JavaScript.

**Alternativet: XML**

Tidigare var **XML (eXtensible Markup Language)** ett vanligt format för datautbyte. XML använder taggar, liknande HTML, för att strukturera data.

```xml
<!-- Exempel på data i XML-format -->
<post>
  <userId>1</userId>
  <id>1</id>
  <title>Detta är titeln</title>
  <body>Detta är innehållet.</body>
</post>
```

Även om du kan stöta på XML i vissa äldre system eller specifika branscher, är JSON det dominerande formatet för webb-API:er idag. Att parsa (tolka) XML i JavaScript kräver oftast separata bibliotek eller mer komplex kod än att hantera JSON.

## JSON Syntax

JSON-data representeras som text och följer några enkla regler:

*   **Objekt:** Representeras med krullparenteser `{}`. Innehåller nyckel-värde-par.
    *   Nycklar *måste* vara strängar inom dubbla citationstecken (`"key"`).
    *   Värden kan vara strängar, nummer, booleans (`true`/`false`), `null`, arrayer, eller andra JSON-objekt.
    *   Nyckel och värde separeras av ett kolon `:`. Paren separeras av kommatecken `,`.
*   **Arrayer:** Representeras med hakparenteser `[]`. Innehåller en ordnad lista av värden, separerade av kommatecken.
*   **Strängar:** *Måste* använda dubbla citationstecken (`"text"`).
*   **Nummer:** Vanliga tal (heltal eller decimaltal).
*   **Booleans:** `true` eller `false` (små bokstäver).
*   **Null:** `null` (små bokstäver).

**Viktigt:** JSON tillåter *inte* funktioner, `undefined`, kommentarer, eller avslutande kommatecken (trailing commas).

```json
// Exempel på JSON-data (som text)
{
  "userId": 1,
  "id": 1,
  "title": "Exempeltitel",
  "body": "Detta är innehållet i posten.",
  "tags": ["webbutveckling", "javascript", "json"],
  "metadata": {
    "published": true,
    "views": 1050,
    "author": null
  }
}
```

## Arbeta med JSON i JavaScript

JavaScript har ett inbyggt globalt `JSON`-objekt med två huvudsakliga metoder för att konvertera mellan JSON-text och JavaScript-objekt/-värden.

### `JSON.stringify()` - Från JavaScript till JSON-sträng

Denna metod tar ett JavaScript-värde (oftast ett objekt eller en array) och omvandlar det till en JSON-formaterad sträng. Detta används när du ska skicka data till ett API (t.ex. i `body` för en `fetch` POST-request).

```javascript
const postData = {
  title: "Min Nya Bloggpost",
  body: "Detta är innehållet.",
  userId: 1,
  published: false, // JavaScript boolean
  tags: ['ny', 'test'] // JavaScript array
};

// Konvertera till JSON-sträng
const jsonString = JSON.stringify(postData);

console.log(jsonString);
// Output: "{"title":"Min Nya Bloggpost","body":"Detta är innehållet.","userId":1,"published":false,"tags":["ny","test"]}"

// Snyggare formatering (indentering)
const prettyJsonString = JSON.stringify(postData, null, 2); // Använd 2 mellanslag för indentering
console.log("\nSnygg JSON:");
console.log(prettyJsonString);
/* Output:
{
  "title": "Min Nya Bloggpost",
  "body": "Detta är innehållet.",
  "userId": 1,
  "published": false,
  "tags": [
    "ny",
    "test"
  ]
}
*/

// Vad händer med otillåtna värden?
const complexObject = {
  name: "Test",
  id: 123,
  action: function() { console.log('Hej!'); }, // Funktioner ignoreras
  value: undefined // undefined blir ignorerat (eller null i arrayer)
};
console.log("\nKomplext objekt:", JSON.stringify(complexObject));
// Output: "{"name":"Test","id":123}"
```

### `JSON.parse()` - Från JSON-sträng till JavaScript

Denna metod tar en JSON-formaterad sträng och omvandlar den tillbaka till ett motsvarande JavaScript-värde (objekt, array, sträng, nummer, boolean, null). Detta används när du har tagit emot data från ett API (t.ex. resultatet från `response.json()` i `fetch`).

```javascript
const receivedJsonString = '{\n  "postId": 101,\n  "title": "Data från servern",\n  "tags": ["api", "data"],\n  "isPublic": true\n}';

try {
  // Försök att parsa JSON-strängen
  const jsObject = JSON.parse(receivedJsonString);

  console.log("Parsat objekt:", jsObject);
  console.log("Titel:", jsObject.title); // "Data från servern"
  console.log("Första taggen:", jsObject.tags[0]); // "api"
  console.log("Är publik:", jsObject.isPublic); // true

} catch (error) {
  // Felhantering om JSON-strängen är ogiltig
  console.error("Kunde inte parsa JSON:", error);
}

// Exempel med ogiltig JSON
const invalidJsonString = '{\n  "name": "Test",\n  "value": 123, // Ogiltigt: avslutande kommatecken
}';

try {
  const invalidObject = JSON.parse(invalidJsonString);
  console.log("Ogiltigt objekt:", invalidObject);
} catch (error) {
  console.error("\nFel vid parsning av ogiltig JSON:", error.message);
  // Output: Fel vid parsning av ogiltig JSON: Unexpected token } in JSON at position ...
}
```

**Viktigt med Felhantering:** Eftersom JSON-data ofta kommer från externa källor, kan den vara felaktigt formaterad. Det är därför viktigt att alltid omsluta `JSON.parse()` i ett `try...catch`-block för att hantera eventuella `SyntaxError` som kan kastas om parsningen misslyckas.

## Data Transformation och Validering

När du har parsat JSON-data till ett JavaScript-objekt, är det ofta bara det första steget. Därefter kan du behöva:

*   **Transformera datan:** Ändra strukturen, filtrera bort onödig information, kombinera med annan data, etc. Här kommer ofta de avancerade array-metoderna (som vi ska titta på härnäst) till stor nytta.
*   **Validera datan:** Kontrollera att datan du fick faktiskt innehåller de fält och datatyper du förväntar dig innan du använder den i din applikation. Detta skyddar mot oväntade fel om API:et ändras eller skickar oväntad data.

Att förstå JSON är fundamentalt för att kunna bygga webbapplikationer som kommunicerar med omvärlden.
