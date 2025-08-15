# Selektorer, färger och typografi i CSS

Att kunna välja ut och styla rätt HTML-element är grunden i CSS. I detta kapitel lär du dig använda **selektorer** (selectors), ange färger på olika sätt och styra textens utseende (typografi).

> **Motivation:**  
> Med selektorer kan du styra exakt vilka delar av din webbsida som ska få särskild stil. Färg och typografi gör sidan mer läsbar och tilltalande.

**Språkpolicy:**  
Svenska används i förklaringar, men engelska tekniska termer anges i parentes första gången de nämns. Variabel- och klassnamn skrivs på engelska.

---

## CSS-selektorer: Att välja rätt element

Selektorer är mönster som matchar HTML-element. Här är de vanligaste:

### 1. Elementselektor (type selector)

- **Syntax:** Elementets namn, t.ex. `p`, `h1`, `div`.
- **Vad den gör:** Väljer *alla* element av den typen.

```css
p {
  line-height: 1.6;
}
h2 {
  color: navy;
}
```

### 2. Klassselektor (class selector)

- **Syntax:** Punkt (`.`) följt av klassnamnet, t.ex. `.important`.
- **Vad den gör:** Väljer alla element med angiven klass. Ett element kan ha flera klasser.

```html
<p class="important">Detta är viktigt.</p>
<span class="important highlight">Markerad text.</span>
<button class="button">Klicka här</button>
```
```css
.important {
  font-weight: bold;
}
.highlight {
  background-color: yellow;
}
.button {
  padding: 10px 15px;
  border: 1px solid gray;
}
```

### 3. ID-selektor (ID selector)

- **Syntax:** Hash (`#`) följt av ID-namnet, t.ex. `#header`.
- **Vad den gör:** Väljer det *enda* element med angivet ID.  
- **Viktigt:** Ett ID ska vara unikt på sidan.

```html
<header id="header">...</header>
```
```css
#header {
  background-color: #f0f0f0;
  padding: 20px;
}
```

### 4. Attributselektor (attribute selector)

- **Syntax:** Elementnamn följt av hakparenteser, t.ex. `a[target="_blank"]`.
- **Vad den gör:** Väljer element baserat på attribut och/eller värde.

```css
a[target="_blank"] {
  color: green;
}
input[type="text"] {
  border: 1px solid #ccc;
}
```

### 5. Kombinatorer (combinators)

Kombinera selektorer för mer specifika regler:

- **Gruppering (grouping):** Komma (`,`) för att ge flera selektorer samma stil.
    ```css
    h1, h2, h3 {
      font-family: Georgia, serif;
    }
    ```
- **Selektor för ättling (descendant combinator):** Mellanslag (` `) för att välja element som är ättlingar (barn, barnbarn, etc.) till ett annat element.
    ```css
    nav ul {
      list-style: none;
    }
    ```
- **Barnselektor (child combinator):** Större än-tecken (`>`) för att välja direkta barn.
    ```css
    ul > li {
      margin-bottom: 5px;
    }
    ```

> **Specificitet:**  
> ID-selektorer (`#id`) är starkare än klass- och attributselektorer (`.class`, `[attr]`), som är starkare än elementselektorer (`p`). När du kombinerar selektorer ökar specificiteten.

---

## Färger i CSS

Du kan ange färger på flera sätt:

- **Namngivna färger (named colors):** T.ex. `red`, `blue`, `lightgray`.
    ```css
    body { background-color: lightgray; }
    ```
- **Hexadecimala koder (HEX):** T.ex. `#FF0000` (röd), `#333` (mörkgrå).
    ```css
    h1 { color: #3A8DDE; }
    ```
- **RGB/RGBA:** T.ex. `rgb(51, 51, 51)`, `rgba(0, 0, 0, 0.5)`.
    ```css
    p { color: rgb(51, 51, 51); }
    .overlay { background-color: rgba(0, 0, 0, 0.5); }
    ```
- **HSL/HSLA:** T.ex. `hsl(210, 100%, 50%)`.
    ```css
    button { background-color: hsl(210, 100%, 50%); }
    ```

---

## Grundläggande typografi

Typografi handlar om textens utseende. Några viktiga egenskaper:

- `font-family`: Typsnitt. Ange gärna flera alternativ.
    ```css
    body {
      font-family: "Helvetica Neue", Arial, sans-serif;
    }
    code {
      font-family: Consolas, Monaco, monospace;
    }
    ```
- `font-size`: Textstorlek, t.ex. `16px`, `2rem`.
    ```css
    p { font-size: 16px; }
    h1 { font-size: 2.5rem; }
    ```
- `font-weight`: Tjocklek, t.ex. `normal`, `bold`, `300`.
    ```css
    strong { font-weight: bold; }
    .subtle { font-weight: 300; }
    ```
- `font-style`: Stil, t.ex. `normal`, `italic`.
    ```css
    em { font-style: italic; }
    ```
- `color`: Textfärg.
    ```css
    a { color: #007bff; }
    ```
- `text-align`: Justering, t.ex. `left`, `center`.
    ```css
    h1 { text-align: center; }
    ```
- `line-height`: Radavstånd, t.ex. `1.6`.
    ```css
    p { line-height: 1.6; }
    ```
- `text-decoration`: Dekoration, t.ex. understrykning.
    ```css
    a { text-decoration: none; }
    a:hover { text-decoration: underline; }
    ```

---

## Praktiska exempel

### Exempel: Kombinera selektorer och färg

```html
<ul>
  <li class="important">Viktigt</li>
  <li>Vanligt</li>
  <li class="highlight">Markerat</li>
</ul>
```
```css
li {
  color: #333;
}
.important {
  color: red;
  font-weight: bold;
}
.highlight {
  background: yellow;
}
```

### Exempel: Typografi och färg

```html
<p class="info">Informationstext</p>
```
```css
.info {
  font-family: Arial, sans-serif;
  font-size: 1.2rem;
  color: hsl(210, 100%, 40%);
  line-height: 1.5;
}
```

---

## Sammanfattning

- CSS-selektorer (element, klass, ID, attribut, kombinatorer) låter dig välja vilka HTML-element du vill styla.
- Färger kan anges med namn, HEX, RGB(A) eller HSL(A).
- Typografiska egenskaper styr textens utseende och läsbarhet.
- Att behärska selektorer och grundläggande styling är fundamentalt för att skapa visuellt tilltalande webbsidor.

---

*I nästa avsnitt tittar vi på box model, som beskriver hur utrymme hanteras runt HTML-element.*
