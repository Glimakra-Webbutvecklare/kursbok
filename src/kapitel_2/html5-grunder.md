# Grunderna i HTML5: Att Strukturera Webbens Innehåll

Som vi nämnde tidigare är HTML (HyperText Markup Language) skelettet i varje webbsida. Det är inte ett programmeringsspråk i traditionell mening (det har ingen logik), utan ett *märkspråk* (markup language). Det betyder att vi använder speciella koder, kallade **taggar**, för att berätta för webbläsaren hur innehållet ska struktureras och vad de olika delarna representerar.

**Mål:** Att förstå grundstrukturen i ett HTML-dokument och lära oss de vanligaste taggarna för att skapa grundläggande innehåll som text, rubriker, listor, länkar och bilder.

## HTML-Dokumentets Grundstruktur

Varje HTML-sida följer en grundläggande mall. Låt oss titta på ett minimalt exempel som vi såg i kapitel 1:

```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Min Första Webbsida</title>
</head>
<body>
    <h1>Hej världen!</h1>
    <p>Detta är min första webbsida.</p>
</body>
</html>
```

Låt oss bryta ner delarna:

*   `<!DOCTYPE html>`: Detta är ingen HTML-tagg, utan en **deklaration**. Den talar om för webbläsaren att dokumentet är skrivet i HTML5 (den moderna standarden). Den ska *alltid* vara först i dokumentet.
*   `<html>`: Detta är **rotelementet** som omsluter allt annat innehåll på sidan (förutom `DOCTYPE`). Attributet `lang="sv"` anger att sidans huvudsakliga språk är svenska, vilket är viktigt för sökmotorer och skärmläsare.
*   `<head>`: Innehåller **metadata** om HTML-dokumentet – information som inte visas direkt på sidan men som är viktig för webbläsaren och sökmotorer.
    *   `<meta charset="UTF-8">`: Anger teckenkodningen för dokumentet. `UTF-8` är standard och stöder de flesta tecken från världens språk (inklusive å, ä, ö). **Viktigt att inkludera!**
    *   `<title>`: Definierar titeln som visas i webbläsarens flik eller fönsterrubrik. Det är också den titel som oftast används av sökmotorer i sökresultaten.
*   `<body>`: Innehåller allt **synligt innehåll** på webbsidan – texter, rubriker, bilder, länkar, listor, etc.

## Taggar, Element och Attribut

*   **Taggar (Tags):** Koder som markerar början och slutet på ett element. De skrivs inom vinkelparenteser (`< >`). De flesta taggar kommer i par: en **starttagg** (t.ex. `<p>`) och en **sluttagg** (t.ex. `</p>`). Sluttaggen har ett snedstreck (`/`) före taggnamnet.
*   **Element:** Ett komplett HTML-element består vanligtvis av en starttagg, innehåll och en sluttagg. Exempel: `<p>Detta är en paragraf.</p>`.
    *   Vissa element är **tomma element** (empty elements) och har ingen sluttagg eftersom de inte omsluter något innehåll. Exempel: `<br>` (radbrytning), `<img>` (bild), `<meta>`.
*   **Attribut (Attributes):** Ger extra information om ett element. De anges *alltid* i starttaggen och består av ett namn och ett värde (inom citationstecken). Exempel: `<html lang="sv">`, `<img src="bild.jpg" alt="Beskrivning">`.
    *   `lang`: Anger språket för elementets innehåll.
    *   `src`: (Source) Anger källan (URL:en) till en bild.
    *   `alt`: (Alternative text) Ger en alternativ textbeskrivning för en bild (viktigt för tillgänglighet och om bilden inte kan laddas).
    *   `href`: (Hypertext Reference) Anger målet för en länk.

## Vanliga HTML-Element

Här är några av de mest grundläggande och vanliga elementen du kommer att använda:

*   **Rubriker:** `<h1>` till `<h6>`
    *   Används för att definiera rubriknivåer. `<h1>` är den högsta nivån (oftast sidans huvudrubrik) och `<h6>` den lägsta.
    *   Använd dem i hierarkisk ordning för att strukturera ditt innehåll.
    ```html
    <h1>Huvudrubrik</h1>
    <h2>Underrubrik</h2>
    <h3>Under-underrubrik</h3>
    ```

*   **Paragrafer (Stycken):** `<p>`
    *   Används för att gruppera text i stycken.
    ```html
    <p>Detta är det första stycket med text.</p>
    <p>Detta är ett andra stycke.</p>
    ```

*   **Länkar (Anchors):** `<a>`
    *   Används för att skapa hyperlänkar till andra webbsidor eller resurser.
    *   `href`-attributet är obligatoriskt och anger länkens destination.
    *   Innehållet mellan `<a ...>` och `</a>` blir den klickbara texten.
    ```html
    <a href="https://www.google.com">Sök på Google</a>
    <a href="annan_sida.html">Länk till en lokal sida</a>
    ```

*   **Bilder:** `<img>`
    *   Används för att bädda in bilder.
    *   Är ett tomt element (ingen sluttagg).
    *   `src`-attributet (source) anger sökvägen till bildfilen.
    *   `alt`-attributet (alternative text) är **mycket viktigt** för tillgänglighet (beskriver bilden för skärmläsare) och visas om bilden inte kan laddas.
    ```html
    <img src="bilder/logo.png" alt="Företagets logotyp">
    ```

*   **Listor:**
    *   **Oordnade listor (Unordered Lists):** `<ul>` (oftast punkter)
    *   **Ordnade listor (Ordered Lists):** `<ol>` (oftast numrerade)
    *   **Listelement (List Items):** `<li>` (används inuti `<ul>` eller `<ol>` för varje punkt i listan)
    ```html
    <ul>
        <li>Äpple</li>
        <li>Banan</li>
        <li>Päron</li>
    </ul>

    <ol>
        <li>Steg 1: Gör något</li>
        <li>Steg 2: Gör något annat</li>
        <li>Steg 3: Klart!</li>
    </ol>
    ```

*   **Radbrytning:** `<br>`
    *   Skapar en enkel radbrytning. Använd sparsamt – oftast är det bättre att strukturera med paragrafer eller andra element.

*   **Kommentarer:** `<!-- Din kommentar här -->`
    *   Kommentarer visas inte i webbläsaren men är användbara för att lämna anteckningar i koden till dig själv eller andra utvecklare.


## HTML - en standard

HTML fortsätter att utvecklas, och som webbutvecklare är det bra att använda den standard som är gällande - se https://html.spec.whatwg.org/multipage/


## Sammanfattning

HTML är grunden för allt webbinnehåll. Vi har sett den grundläggande strukturen i ett HTML-dokument (`<!DOCTYPE>`, `<html>`, `<head>`, `<body>`), förstått koncepten taggar, element och attribut, och lärt oss de vanligaste elementen för att skapa rubriker (`<h1>`-`<h6>`), paragrafer (`<p>`), länkar (`<a>`), bilder (`<img>`) och listor (`<ul>`, `<ol>`, `<li>`).

Att skriva ren och korrekt HTML är det första steget mot att bygga fungerande webbsidor. I nästa avsnitt ska vi titta närmare på hur vi kan använda HTML för att ge vårt innehåll mer mening och struktur – så kallad semantisk HTML.
