# Praktiska Övningar: Grundläggande JavaScript

Det är dags att omsätta våra JavaScript-kunskaper i praktiken! Vi fortsätter att bygga på "Om Mig"-sidan och lägger till lite enkel interaktivitet.

**Mål:**
*   Skapa och länka en extern JavaScript-fil.
*   Använda `console.log` för felsökning.
*   Använda variabler och grundläggande datatyper.
*   Skriva en enkel funktion.
*   Välja DOM-element med `querySelector`.
*   Manipulera textinnehåll (`textContent`).
*   Hantera en `click`-händelse med `addEventListener`.
*   Manipulera CSS-klasser med `classList`.

**Förutsättningar:** Projektet `om-mig-sida` från kapitel 3, med `index.html`, `style.css` och Git/GitHub-koppling.

## Övning 1: Koppla Script och Logga Meddelande

1.  **Skapa JS-fil:** I din `om-mig-sida`-mapp, skapa en ny fil som heter `script.js`.
2.  **Länka från HTML:** Öppna `index.html`. Lägg till en `<script>`-tagg precis **före** den avslutande `</body>`-taggen för att länka till din nya JS-fil:
    ```html
    <script src="script.js"></script>
    </body>
    ```
3.  **Logga till Konsolen (i `script.js`):**
    *   Lägg till en rad i `script.js` för att skriva ut ett meddelande till webbläsarens konsol:
        ```javascript
        console.log("Scriptet laddades!");
        ```
4.  **Commit:**
    *   `git status`
    *   `git add .`
    *   `git commit -m "Lägg till och länka extern script.js, logga meddelande"`
5.  **Visa och Kontrollera:** Öppna `index.html` i webbläsaren. Öppna sedan webbläsarens **utvecklarkonsol** (oftast genom att högerklicka -> Inspektera -> Console, eller trycka F12). Ser du meddelandet "Scriptet laddades!" där?

## Övning 2: Byt ut Rubrik med JavaScript

1.  **Välj Rubrik:** I `script.js`, använd `document.querySelector()` för att välja ut huvudsrubriken (`<h1>`). Spara referensen till elementet i en `const`-variabel.
    ```javascript
    console.log("Scriptet laddades!");

    const mainHeading = document.querySelector('h1');
    console.log(mainHeading); // Bra att logga för att se att du valt rätt element
    ```
2.  **Ändra Textinnehåll:** Ändra rubrikens `textContent` till något nytt, t.ex. "Välkommen till [Ditt Namn]s sida!".
    ```javascript
    // ... (koden från steg 1)

    if (mainHeading) { // Bra att kolla att elementet faktiskt hittades
      mainHeading.textContent = "Välkommen till Alices sida!"; // Byt ut Alice mot ditt namn
    } else {
      console.error("Kunde inte hitta huvudrubriken (h1)!");
    }
    ```
3.  **Commit:**
    *   `git add .`
    *   `git commit -m "Ändra huvudrubrikens text via JavaScript"`
4.  **Visa:** Ladda om `index.html` i webbläsaren. Har rubriken ändrats?

## Övning 3: Interaktiv Knapp - Växla Mörkt Läge

Vi ska lägga till en knapp som växlar en CSS-klass på `<body>` för att simulera ett mörkt/ljust läge.

1.  **Lägg till Knapp i HTML:** Lägg till en knapp någonstans i `index.html`, t.ex. i `<header>` eller i början av `<main>`. Ge den ett ID så att vi lätt kan hitta den.
    ```html
    <button id="toggle-theme-btn">Växla Tema</button>
    ```
2.  **Lägg till CSS-klass för Mörkt Läge:** I `style.css`, lägg till en klass för mörkt läge som ändrar bakgrunds- och textfärg på `body`. Lägg den *utanför* eventuella media queries.
    ```css
    /* ... annan css ... */

    body.dark-mode {
      background-color: #222;
      color: #eee;
    }

    /* Valfritt: Styla om rubriker/länkar i mörkt läge */
    body.dark-mode h1,
    body.dark-mode h2 {
      color: lightcyan;
    }
    body.dark-mode a {
      color: lightskyblue;
    }
    ```
3.  **JavaScript - Hitta Knapp och Lyssna på Klick:** I `script.js`:
    *   Välj knappen med `document.querySelector()` och dess ID.
    *   Välj `body`-elementet (du kan använda `document.body`).
    *   Lägg till en `addEventListener` för `'click'`-händelsen på knappen.
    *   Inuti händelsehanteraren (callback-funktionen), använd `body.classList.toggle('dark-mode')` för att lägga till klassen om den inte finns, eller ta bort den om den finns.

    ```javascript
    // ... (koden från övning 2)

    const themeButton = document.querySelector('#toggle-theme-btn');
    const bodyElement = document.body;

    if (themeButton && bodyElement) {
      themeButton.addEventListener('click', function() {
        console.log("Temaknapp klickad!");
        bodyElement.classList.toggle('dark-mode');
      });
    } else {
      console.error("Kunde inte hitta temaknappen eller body!");
    }
    ```
4.  **Commit:**
    *   `git status` (bör visa ändringar i `index.html`, `style.css`, `script.js`)
    *   `git add .`
    *   `git commit -m "Lägg till knapp och JS för att växla mörkt/ljust tema"`
5.  **Testa:** Ladda om sidan. Klicka på knappen "Växla Tema". Ändras utseendet mellan ljust och mörkt läge?

## Övning 4: Pusha till GitHub

Glöm inte att pusha dina senaste ändringar till GitHub!

1.  `git pull` (för säkerhets skull)
2.  `git push`
3.  Verifiera på GitHub.

## Sammanfattning och Nästa Steg

Du har nu lagt till din första interaktivitet med JavaScript! Du har länkat ett script, använt konsolen, valt och manipulerat DOM-element, och reagerat på en användarhändelse (`click`) för att ändra sidans utseende dynamiskt. Detta är grunderna för att bygga mer komplexa frontend-applikationer.

I nästa kapitel, "Fortsättning JavaScript", kommer vi att utforska mer avancerade koncept som asynkron programmering, hur man hämtar data från externa källor (API:er), och mer kraftfulla sätt att arbeta med arrayer och objekt.