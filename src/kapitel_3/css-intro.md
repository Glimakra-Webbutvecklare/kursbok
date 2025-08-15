# Introduktion till CSS: Syntax och inkludering

CSS står för **Cascading Style Sheets**. Det är språket som webbläsare använder för att bestämma hur HTML-element ska visas visuellt. Utan CSS skulle webben vara en ganska monoton plats med bara svart text på vit bakgrund.

> **Motivation:**  
> CSS gör det möjligt att separera innehåll (HTML) från utseende (design). Det gör webbsidor snyggare, mer lättlästa och enklare att underhålla.

---

## CSS-syntax: Regler som styr utseendet

En CSS-regel består huvudsakligen av två delar:

1. **Selektor (selector):** Anger *vilket* eller *vilka* HTML-element som regeln ska appliceras på.
2. **Deklarationsblock (declaration block):** Innehåller en eller flera *deklarationer*, separerade med semikolon (`;`). Blocket omges av måsvingar (`{ }`).
    - **Deklaration (declaration):** Består av en **egenskap** (property) och ett **värde** (value), separerade med kolon (`:`). Egenskapen är det du vill ändra (t.ex. `color`, `font-size`, `background-color`), och värdet anger hur du vill ändra det (t.ex. `blue`, `16px`, `#FFFFFF`).

```css
/* Detta är en CSS-kommentar */

selector {
  property: value;
  another-property: another-value;
}
```

**Exempel:**  
Låt oss säga att vi vill att alla paragrafer (`<p>`) ska ha blå text och en textstorlek på 16 pixlar.

```css
p {
  color: blue;        /* Gör texten blå */
  font-size: 16px;    /* Sätter textstorleken till 16 pixlar */
}
```

- **Selektor:** `p` (väljer alla `<p>`-element)
- **Deklarationsblock:** `{ color: blue; font-size: 16px; }`
- **Deklarationer:** `color: blue;` och `font-size: 16px;`
- **Egenskaper:** `color` och `font-size`
- **Värden:** `blue` och `16px`

---

## Hur kopplar man CSS till HTML?

Det finns tre huvudsakliga sätt att applicera CSS-regler på ett HTML-dokument:

### 1. Extern CSS-fil (external stylesheet) – **Rekommenderat!**

Du skriver dina CSS-regler i en separat fil (t.ex. `style.css`) och länkar in den i HTML-filen:

```html
<link rel="stylesheet" href="style.css">
```

**Exempel på innehåll i `style.css`:**
```css
body {
  font-family: sans-serif;
}
p {
  color: #333;
}
h1 {
  color: darkcyan;
}
```

**Exempel på HTML:**
```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Min Sida</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Välkommen</h1>
    <p>Detta är min webbsida.</p>
</body>
</html>
```

**Fördelar:**
- **Separation:** Håller struktur (HTML) och stil (CSS) helt åtskilda.
- **Underhåll:** Lätt att ändra utseendet på hela webbplatsen genom att redigera en enda fil.
- **Prestanda:** Webbläsaren kan cacha (spara en lokal kopia av) `.css`-filen, vilket snabbar upp laddningen av efterföljande sidor.

**Nackdelar:** Kräver en extra fil och en extra HTTP-förfrågan (request) för att ladda CSS-filen (men detta vägs oftast upp av cachning).

---

### 2. Intern CSS (internal stylesheet)

Du skriver CSS-regler i en `<style>`-tagg i `<head>` på HTML-sidan:

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

**Fördelar:**  
Allt finns i en enda fil, kan vara användbart för små, enstaka sidor eller för att snabbt testa något.

**Nackdelar:**  
Blandar struktur och stil, svårare att underhålla på större webbplatser, ingen cachning av stilarna mellan olika sidor.

---

### 3. Inline CSS (inline styles)

Du skriver CSS direkt i HTML-elementets `style`-attribut:

```html
<p style="color: #333; font-size: 14px;">Detta är min webbsida med inline-stil.</p>
```

**Fördelar:**  
Kan snabbt applicera en unik stil på ett enda element.

**Nackdelar:**  
- **Används sällan och bör undvikas!**
- Blandar struktur och stil maximalt.
- Mycket svårt att underhålla och återanvända stilar.
- Gör HTML-koden rörig.
- Har högst specificitet (se nedan), vilket kan göra det svårt att skriva över stilar i externa filer.
- **Säkerhetsaspekt:** Inline-stilar kan ibland utnyttjas för XSS-attacker (cross-site scripting) om användarinnehåll får skrivas direkt till `style`-attributet.

---

## Cascading och specificitet (kort introduktion)

Namnet "Cascading" Style Sheets antyder en viktig mekanism: **kaskaden**. Om flera CSS-regler matchar samma element och försöker sätta samma egenskap, hur bestämmer webbläsaren vilken regel som vinner?

Detta avgörs av en kombination av:

1. **Ursprung (origin):** Stilar från webbplatsens utvecklare (author stylesheets) väger tyngre än webbläsarens standardstilar (user-agent stylesheets).
2. **Specificitet (specificity):** Mer specifika selektorer väger tyngre än mindre specifika. T.ex. en regel för ett element med ett visst ID (`#myId`) är mer specifik än en regel för ett element med en viss klass (`.myClass`), som i sin tur är mer specifik än en regel för en elementtyp (`p`). Inline-stilar har högst specificitet.
3. **Ordning (order):** Om specificiteten är densamma, vinner den regel som definieras *senast* i koden eller i den senast inlänkade CSS-filen.

---

### Exempel: Hur cascading fungerar i praktiken

```html
<p id="important" class="highlight">Detta är en viktig paragraf.</p>
```

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
#important {
  color: red;
}

/* Regel 4: Samma ID-selektor, men definierad senare */
#important {
  color: green;
  text-decoration: underline;
}
```

**Resultat:**  
- **Färg: grön** (från regel 4 - samma specificitet som regel 3, men definierad senare)
- **Font-storlek: 14px** (från regel 1 - ingen annan regel definierar detta)
- **Font-vikt: bold** (från regel 2 - ingen regel med högre specificitet överskrider detta)
- **Text-decoration: underline** (från regel 4)

**Förklaring:**  
- Regel 1 (`p`) har lägst specificitet men bidrar med `font-size` eftersom ingen annan regel definierar detta.
- Regel 2 (`.highlight`) har högre specificitet än regel 1, så `color: blue` skulle vinna över `color: black`, men...
- Regel 3 och 4 (`#important`) har högst specificitet och överskrider både regel 1 och 2 för färg.
- Mellan regel 3 och 4 vinner regel 4 eftersom den definieras senare (samma specificitet).

**Inline-stil skulle vinna över allt:**  
Om vi hade `<p id="important" class="highlight" style="color: purple;">`, skulle texten bli lila eftersom inline-stilar har högst specificitet.

---

## Nyckelordet `!important`

I CSS kan du använda nyckelordet `!important` för att tvinga en deklaration att vinna över andra, oavsett specificitet och ordning (med undantag för inline-stilar som också använder `!important`). Det bör användas sparsamt, eftersom det kan göra koden svår att underhålla.

**Syntax:**
```css
property: value !important;
```

### Exempel 1: Överskrid en annan regel

```css
p {
  color: blue !important;
}

p {
  color: red;
}
```
Alla `<p>`-element får blå text, även om den röda regeln står sist, eftersom `!important` vinner.

### Exempel 2: Kombinera med inline-stil

```html
<p style="color: green;">Denna text är grön.</p>
```
```css
p {
  color: orange !important;
}
```
Texten blir orange, eftersom CSS-regeln med `!important` överskrider inline-stilen.

**Obs:**  
Överanvänd inte `!important`. Det är bättre att strukturera CSS:en så att specificitet och ordning räcker för att styra vilka regler som gäller.
---

## Sammanfattning

- CSS används för att definiera utseendet på HTML-element.
- Grundsyntaxen är `selektor { egenskap: värde; }`.
- Det bästa och mest rekommenderade sättet att inkludera CSS är via en **extern CSS-fil** länkad med `<link>` i HTML:s `<head>`.
- Intern CSS (`<style>`) och inline CSS (`style`-attribut) finns men bör användas sparsamt eller undvikas.
- Kaskaden och specificitetsregler avgör vilken stil som appliceras om flera regler matchar samma element.

---

*I nästa avsnitt dyker vi djupare ner i olika typer av selektorer.*
