# Introduktion till CSS: Syntax och Inkludering

CSS står för **Cascading Style Sheets**. Det är språket som webbläsare använder för att bestämma hur HTML-element ska visas visuellt. Utan CSS skulle webben vara en ganska monoton plats med bara svart text på vit bakgrund.

**Mål:** Förstå den grundläggande syntaxen för CSS-regler och lära oss de olika sätten att applicera dessa regler på ett HTML-dokument.

## CSS-Syntax: Regler som Styr Utseendet

En CSS-regel består huvudsakligen av två delar:

1.  **Selektor (Selector):** Anger *vilket* eller *vilka* HTML-element som regeln ska appliceras på.
2.  **Deklarationsblock (Declaration Block):** Innehåller en eller flera *deklarationer*, separerade med semikolon (`;`). Blocket omges av måsvingar (`{ }`).
    *   **Deklaration (Declaration):** Består av en **egenskap** (property) och ett **värde** (value), separerade med kolon (`:`). Egenskapen är det du vill ändra (t.ex. `color`, `font-size`, `background-color`), och värdet anger hur du vill ändra det (t.ex. `blue`, `16px`, `#FFFFFF`).

```css
/* Detta är en CSS-kommentar */

selektor {
  egenskap: värde;
  annan-egenskap: annat-värde;
}
```

**Exempel:** Låt oss säga att vi vill att alla paragrafer (`<p>`) ska ha blå text och en textstorlek på 16 pixlar.

```css
p {
  color: blue; /* Gör texten blå */
  font-size: 16px; /* Sätter textstorleken till 16 pixlar */
}
```

*   **Selektor:** `p` (väljer alla `<p>`-element)
*   **Deklarationsblock:** `{ color: blue; font-size: 16px; }`
*   **Deklarationer:** `color: blue;` och `font-size: 16px;`
*   **Egenskaper:** `color` och `font-size`
*   **Värden:** `blue` och `16px`

## Hur kopplar man CSS till HTML?

Det finns tre huvudsakliga sätt att applicera CSS-regler på ett HTML-dokument:

**1. Extern CSS-fil (External Stylesheet) - Rekommenderat!**

*   **Hur:** Du skriver dina CSS-regler i en separat fil med filändelsen `.css` (t.ex. `style.css`). Sedan länkar du till denna fil från HTML-dokumentets `<head>`-sektion med hjälp av `<link>`-elementet.

    *Innehåll i `style.css`:*
    ```css
    body {
      font-family: sans-serif;
    }

    p {
      color: #333; /* Mörkgrå färg */
    }

    h1 {
        color: darkcyan;
    }
    ```

    *Innehåll i `index.html` (notera `<link>`-taggen i `<head>`):*
    ```html
    <!DOCTYPE html>
    <html lang="sv">
    <head>
        <meta charset="UTF-8">
        <title>Min Sida</title>
        <link rel="stylesheet" href="style.css"> <!-- Länkar till CSS-filen -->
    </head>
    <body>
        <h1>Välkommen</h1>
        <p>Detta är min webbsida.</p>
    </body>
    </html>
    ```

*   **Fördelar:**
    *   **Separation:** Håller struktur (HTML) och stil (CSS) helt åtskilda.
    *   **Underhåll:** Lätt att ändra utseendet på hela webbplatsen genom att redigera en enda fil.
    *   **Prestanda:** Webbläsaren kan cacha (spara en lokal kopia av) `.css`-filen, vilket snabbar upp laddningen av efterföljande sidor.
*   **Nackdelar:** Kräver en extra fil och en extra HTTP-förfrågan (request) för att ladda CSS-filen (men detta vägs oftast upp av cachning).
*   **Detta är den i särklass vanligaste och bästa metoden.**

**2. Intern CSS (Internal Stylesheet)**

*   **Hur:** Du skriver dina CSS-regler direkt inuti ett `<style>`-element, som placeras i HTML-dokumentets `<head>`-sektion.

    ```html
    <!DOCTYPE html>
    <html lang="sv">
    <head>
        <meta charset="UTF-8">
        <title>Min Sida</title>
        <style>
          body {
            font-family: sans-serif;
          }
          p {
            color: #333;
          }
           h1 {
               color: darkcyan;
           }
        </style>
    </head>
    <body>
        <h1>Välkommen</h1>
        <p>Detta är min webbsida.</p>
    </body>
    </html>
    ```

*   **Fördelar:** Allt finns i en enda fil, kan vara användbart för små, enstaka sidor eller för att snabbt testa något.
*   **Nackdelar:** Blandar struktur och stil, svårare att underhålla på större webbplatser, ingen cachning av stilarna mellan olika sidor.

**3. Inline CSS (Inline Styles)**

*   **Hur:** Du applicerar CSS-regler direkt på ett specifikt HTML-element med hjälp av `style`-attributet.

    ```html
    <!DOCTYPE html>
    <html lang="sv">
    <head>
        <meta charset="UTF-8">
        <title>Min Sida</title>
    </head>
    <body>
        <h1 style="color: darkcyan;">Välkommen</h1>
        <p style="color: #333; font-size: 14px;">Detta är min webbsida med inline-stil.</p>
    </body>
    </html>
    ```

*   **Fördelar:** Kan snabbt applicera en unik stil på ett enda element.
*   **Nackdelar:**
    *   **Används sällan och bör undvikas!**
    *   Blandar struktur och stil maximalt.
    *   Mycket svårt att underhålla och återanvända stilar.
    *   Gör HTML-koden rörig.
    *   Har högst specificitet (se nedan), vilket kan göra det svårt att skriva över stilar i externa filer.

## Cascading och Specificitet (Kort introduktion)

Namnet "Cascading" Style Sheets antyder en viktig mekanism: **kaskaden**. Om flera CSS-regler matchar samma element och försöker sätta samma egenskap, hur bestämmer webbläsaren vilken regel som vinner?

Detta avgörs av en kombination av:

1.  **Ursprung (Origin):** Stilar från webbplatsens utvecklare (author stylesheets) väger tyngre än webbläsarens standardstilar (user-agent stylesheets).
2.  **Specificitet (Specificity):** Mer specifika selektorer väger tyngre än mindre specifika. T.ex. en regel för ett element med ett visst ID (`#mittId`) är mer specifik än en regel för ett element med en viss klass (`.minKlass`), som i sin tur är mer specifik än en regel för en elementtyp (`p`). Inline-stilar har högst specificitet.
3.  **Ordning (Order):** Om specificiteten är densamma, vinner den regel som definieras *senast* i koden eller i den senast inlänkade CSS-filen.


### Exempel: Hur Cascading Fungerar i Praktiken

Låt oss titta på ett exempel där flera CSS-regler matchar samma element:

**HTML:**
```html
<p id="viktigt" class="highlight">Detta är en viktig paragraf.</p>
```

**CSS:**
```css
/* Regel 1: Elementtyp-selektor (lägst specificitet) */
p {
  color: black;
  font-size: 14px;
}

/* Regel 2: Klass-selektor (högre specificitet) */
.highlight {
  color: blue;
  font-weight: bold;
}

/* Regel 3: ID-selektor (ännu högre specificitet) */
#viktigt {
  color: red;
}

/* Regel 4: Samma ID-selektor, men definierad senare */
#viktigt {
  color: green;
  text-decoration: underline;
}
```

<style>
#css-example-1 {
    padding: 20px 30px;
    text-align: center;
}

#css-example-1 p {
  color: black;
  font-size: 14px;
}

/* Regel 2: Klass-selektor (högre specificitet) */
#css-example-1 .highlight {
  color: blue;
  font-weight: bold;
}

/* Regel 3: ID-selektor (ännu högre specificitet) */
#css-example-1 #viktigt {
  color: red;
}

/* Regel 4: Samma ID-selektor, men definierad senare */
#css-example-1 #viktigt {
  color: green;
  text-decoration: underline;
}
</style>

<div id="css-example-1">
    <p id="viktigt" class="highlight">Detta är en viktig paragraf.</p>
</div>

**Resultat:** 
- **Färg: grön** (från regel 4 - samma specificitet som regel 3, men definierad senare)
- **Font-storlek: 14px** (från regel 1 - ingen annan regel definierar detta)
- **Font-vikt: bold** (från regel 2 - ingen regel med högre specificitet överskrider detta)
- **Text-decoration: underline** (från regel 4)

**Förklaring:**
- Regel 1 (`p`) har lägst specificitet men bidrar med `font-size` eftersom ingen annan regel definierar detta.
- Regel 2 (`.highlight`) har högre specificitet än regel 1, så `color: blue` skulle vinna över `color: black`, men...
- Regel 3 och 4 (`#viktigt`) har högst specificitet och överskrider både regel 1 och 2 för färg.
- Mellan regel 3 och 4 vinner regel 4 eftersom den definieras senare (samma specificitet).

**Inline-stil skulle vinna över allt:** Om vi hade `<p id="viktigt" class="highlight" style="color: purple;">`, skulle texten bli lila eftersom inline-stilar har högst specificitet.

Vi kommer titta mer på selektorer och specificitet i nästa avsnitt, men det är bra att känna till att denna "kaskad" finns och att det finns regler för hur konflikter löses.
## Sammanfattning

CSS används för att definiera utseendet på HTML-element. Grundsyntaxen är `selektor { egenskap: värde; }`. Det bästa och mest rekommenderade sättet att inkludera CSS är via en **extern CSS-fil** länkad med `<link>` i HTML:s `<head>`. Intern CSS (`<style>`) och inline CSS (`style`-attribut) finns men bör användas sparsamt eller undvikas. Kaskaden och specificitetsregler avgör vilken stil som appliceras om flera regler matchar samma element.

I nästa avsnitt dyker vi djupare ner i olika typer av selektorer.
