# Selektorer, Färger och Typografi i CSS

Nu när vi vet hur man skriver CSS-regler och kopplar dem till HTML, behöver vi lära oss *hur* vi väljer ut de specifika element vi vill styla. Detta görs med **selektorer**. Vi ska också titta på hur vi anger färger och kontrollerar textens utseende (typografi).

**Mål:** Förstå och kunna använda de vanligaste CSS-selektorerna, ange färger på olika sätt, och använda grundläggande typografiska egenskaper för att styla text.

## CSS-Selektorer: Att Sikta Rätt

Selektorer är mönster som matchar HTML-element. Här är några av de mest grundläggande och användbara:

**1. Elementselektor (Type Selector):**

*   **Syntax:** Elementets namn (t.ex. `p`, `h1`, `div`, `li`).
*   **Vad den gör:** Väljer *alla* element av den angivna typen.
    ```css
    p { /* Alla paragrafer */
      line-height: 1.6; /* Radavstånd */
    }
    h2 { /* Alla h2-rubriker */
      color: navy;
    }
    ```

**2. Klassselektor (Class Selector):**

*   **Syntax:** En punkt (`.`) följt av klassnamnet (t.ex. `.viktigt`, `.highlight`, `.knapp`).
*   **Vad den gör:** Väljer alla element som har det angivna `class`-attributet i HTML:en.
*   **Styrka:** Du kan ge samma klass till flera olika element och återanvända stilar. Ett element kan också ha flera klasser (separerade med mellanslag i `class`-attributet).

    *HTML:*
    ```html
    <p class="viktigt">Detta är viktigt.</p>
    <span class="viktigt highlight">Markerad text.</span>
    <button class="knapp">Klicka här</button>
    ```
    *CSS:*
    ```css
    .viktigt { /* Alla element med class="viktigt" */
      font-weight: bold;
    }
    .highlight { /* Alla element med class="highlight" */
      background-color: yellow;
    }
    .knapp {
        padding: 10px 15px;
        border: 1px solid gray;
    }
    ```

**3. ID-selektor (ID Selector):**

*   **Syntax:** En hash-symbol (`#`) följt av ID-namnet (t.ex. `#sidhuvud`, `#unikKnapp`).
*   **Vad den gör:** Väljer det *enda* element som har det angivna `id`-attributet i HTML:en.
*   **Viktigt:** Ett `id` måste vara **unikt** per HTML-sida. Du kan bara ha ett element med ett specifikt ID.
*   **Användning:** Används oftast för unika sidsektioner (som `<header id="main-header">`) eller för att identifiera element specifikt för JavaScript. På grund av hög specificitet (se nedan) bör ID-selektorer användas med viss försiktighet för generell styling.

    *HTML:*
    ```html
    <header id="sidhuvud">...</header>
    ```
    *CSS:*
    ```css
    #sidhuvud { /* Elementet med id="sidhuvud" */
      background-color: #f0f0f0; /* Ljusgrå bakgrund */
      padding: 20px;
    }
    ```

**4. Attributselektor (Attribute Selector):**

*   **Syntax:** Elementnamn följt av hakparenteser (`[]`) med attributet (och eventuellt dess värde).
*   **Vad den gör:** Väljer element baserat på närvaron eller värdet av ett attribut.
    ```css
    a[target="_blank"] { /* Alla länkar som öppnas i ny flik */
      color: green;
    }
    input[type="text"] { /* Alla textinmatningsfält */
      border: 1px solid #ccc;
    }
    ```

**5. Kombinatorer (Combinators):**

Du kan kombinera selektorer för att skapa mer specifika regler:

*   **Gruppering (Grouping):** Komma (`,`) separerar flera selektorer som ska ha samma regler.
    ```css
    h1, h2, h3 { /* Applicera på h1, h2 OCH h3 */
      font-family: Georgia, serif;
    }
    ```
*   **Ättlingselektor (Descendant Combinator):** Mellanslag (` `) väljer element som är ättlingar (barn, barnbarn, etc.) till ett annat element.
    ```css
    nav ul { /* Väljer alla ul-element som finns *inuti* ett nav-element */
      list-style: none; /* Tar bort punkterna */
    }
    ```
*   **Barnselektor (Child Combinator):** Större än-tecken (`>`) väljer element som är *direkta barn* till ett annat element.
    ```css
    ul > li { /* Väljer li-element som är *direkta* barn till ett ul-element */
        margin-bottom: 5px;
    }
    ```

**Specificitet igen:** Kom ihåg att ID-selektorer (`#id`) är mer specifika än klass- och attributselektorer (`.class`, `[attr]`), som i sin tur är mer specifika än elementselektorer (`p`). När du kombinerar selektorer ökar specificiteten.

## Färger i CSS

Det finns flera sätt att ange färger:

*   **Namngivna färger (Named Colors):** Fördefinierade namn (ca 140 st). Enkelt men begränsat. Exempel: `red`, `blue`, `lightgray`, `papayawhip`.
    ```css
    body { background-color: lightgray; }
    ```
*   **Hexadecimala koder (HEX):** Vanligast för webben. Börjar med `#` följt av 6 (eller 3) hexadecimala tecken (0-9, A-F) som representerar Rött, Grönt och Blått (RGB). `#RRGGBB` eller `#RGB` (förkortning om RR, GG, BB är par). Exempel: `#FF0000` (röd), `#0000FF` (blå), `#333` (mörkgrå, samma som `#333333`).
    ```css
    h1 { color: #3A8DDE; } /* En specifik blå nyans */
    ```
*   **RGB / RGBA:** Anger Rött, Grönt och Blått med värden mellan 0-255. RGBA lägger till en **Alfa**-kanal (genomskinlighet) mellan 0 (helt genomskinlig) och 1 (helt opak).
    ```css
    p { color: rgb(51, 51, 51); } /* Samma som #333 */
    .overlay { background-color: rgba(0, 0, 0, 0.5); } /* Svart med 50% genomskinlighet */
    ```
*   **HSL / HSLA:** Anger färg baserat på Nyans (Hue, 0-360 grader på färgcirkeln), Mättnad (Saturation, 0-100%) och Ljushet (Lightness, 0-100%). HSLA lägger till Alfa-kanal.
    ```css
    button { background-color: hsl(210, 100%, 50%); } /* En klarblå färg */
    ```

## Grundläggande Typografi

Typografi handlar om textens utseende. Här är några viktiga CSS-egenskaper:

*   `font-family`: Anger vilket typsnitt (font) som ska användas. Ange flera alternativ (font stack) separerade med komma, där det första tillgängliga används. Avsluta alltid med en generisk familj (som `serif`, `sans-serif`, `monospace`).
    ```css
    body {
      font-family: "Helvetica Neue", Arial, sans-serif;
    }
    code {
        font-family: Consolas, Monaco, monospace;
    }
    ```
*   `font-size`: Anger textstorleken. Kan anges i pixlar (`px`), `em` (relativt till förälderelementets storlek), `rem` (relativt till rot-elementets storlek), procent (`%`) m.m. `px` är enkelt att börja med, `rem` är bra för skalbarhet.
    ```css
    p { font-size: 16px; }
    h1 { font-size: 2.5rem; } /* 2.5 gånger rot-elementets storlek */
    ```
*   `font-weight`: Anger textens tjocklek. Vanliga värden: `normal` (standard), `bold` (fet). Kan också vara numeriska värden (100-900).
    ```css
    strong { font-weight: bold; }
    .subtle { font-weight: 300; } /* Lättare vikt (om typsnittet stödjer det) */
    ```
*   `font-style`: Anger stil, oftast `normal` eller `italic` (kursiv).
    ```css
    em { font-style: italic; }
    ```
*   `color`: Anger textfärgen (använder färgformaten ovan).
    ```css
    a { color: #007bff; } /* Blå länkar */
    ```
*   `text-align`: Justerar texten horisontellt: `left` (standard), `right`, `center`, `justify`.
    ```css
    h1 { text-align: center; }
    ```
*   `line-height`: Anger avståndet mellan textrader. Anges ofta som ett enhetslöst tal (multipliceras med `font-size`) eller med en enhet (`px`, `em`, `rem`). Ett värde runt `1.5` eller `1.6` ger ofta bra läsbarhet för brödtext.
    ```css
    p { line-height: 1.6; }
    ```
*   `text-decoration`: Lägger till eller tar bort dekorationer som understrykning. Vanligt att ta bort understrykning på länkar.
    ```css
    a { text-decoration: none; } /* Tar bort understrykning */
    a:hover { text-decoration: underline; } /* Lägger till understrykning vid hover */
    ```

## Sammanfattning

CSS-selektorer (element, klass, ID, attribut, kombinatorer) låter oss välja vilka HTML-element vi vill styla. Vi kan ange färger med namn, HEX-koder, RGB(A) eller HSL(A). Med typografiska egenskaper som `font-family`, `font-size`, `font-weight`, `color` och `line-height` kan vi noggrant kontrollera textens utseende och läsbarhet.

Att behärska selektorer och grundläggande styling är fundamentalt för att kunna skapa visuellt tilltalande webbsidor. I nästa avsnitt tittar vi på Boxmodellen, som beskriver hur utrymme hanteras runt HTML-element.
