# Tekniska intervjufrågor: CSS och responsiv design

Detta avsnitt innehåller exempel på tekniska intervjufrågor som kan dyka upp gällande CSS och responsiv webbutveckling. Frågorna är utformade för att testa både teoretisk förståelse och praktisk kunskap.

Använd dessa frågor för att testa din kunskap och förbereda dig för tekniska intervjuer.

---

## Fråga 1: CSS grundsyntax och inkludering

**Fråga:**  
Förklara skillnaden mellan inline CSS, intern CSS och extern CSS. Vilken metod rekommenderas och varför?

**Förslag till svar:**
- **Inline CSS:** `style`-attribut direkt på HTML-element, t.ex. `<p style="color: red;">Text</p>`.
- **Intern CSS:** CSS i `<style>`-taggar i HTML:s `<head>`.
- **Extern CSS:** Separat `.css`-fil länkad med `<link rel="stylesheet" href="style.css">`.

**Extern CSS rekommenderas eftersom:**
- **Separation:** Håller struktur (HTML) och stil (CSS) åtskilda.
- **Underhåll:** Enkelt att ändra hela webbplatsens utseende från en fil.
- **Prestanda:** Webbläsaren kan cacha (spara) CSS-filen.
- **Återanvändbarhet:** Samma stilar kan användas på flera sidor.

**Inline CSS bör undvikas** då det är svårt att underhålla och har högst specificitet.

---

## Fråga 2: CSS-selektorer

**Fråga:**  
Förklara skillnaden mellan dessa selektorer och ge exempel på när du skulle använda var och en:
```css
p { }
.highlight { }
#header { }
nav ul li { }
```

**Förslag till svar:**
- **`p`** – Elementselektor (type selector): Väljer alla `<p>`-element. Används för grundstilar på elementtyper.
- **`.highlight`** – Klassselektor (class selector): Väljer alla element med `class="highlight"`. Återanvändbar stil för flera element.
- **`#header`** – ID-selektor (ID selector): Väljer elementet med `id="header"`. Unikt per sida, högst specificitet.
- **`nav ul li`** – Selektor för ättling (descendant combinator): Väljer `<li>`-element inuti `<ul>` som är inuti `<nav>`. Specifik kontextuell styling.

**Bästa praxis:** Använd klasser för återanvändbara stilar, ID:n sparsamt för unika element, och elementselektorer för grundstilar.

---

## Fråga 3: Specificitet och kaskaden

**Fråga:**  
Vilken färg får texten i detta exempel och varför?
```html
<p id="viktigt" class="highlight">Text</p>
```
```css
p { color: black; }
.highlight { color: blue; }
#viktigt { color: red; }
p.highlight { color: green; }
```

**Förslag till svar:**  
Texten blir **röd** eftersom `#viktigt` (ID-selektor) har högst specificitet.

**Specificitetsordning (högst till lägst):**
1. Inline-stilar (`style`-attribut)
2. ID-selektorer (`#viktigt`)
3. Klass-, attribut- och pseudoselektorer (`.highlight`, `p.highlight`)
4. Elementselektorer (`p`)

`p.highlight` (kombinerad selektor) har högre specificitet än `.highlight` ensam, men lägre än `#viktigt`.

---

## Fråga 4: Box model

**Fråga:**  
Förklara CSS box model. Om ett element har `width: 200px`, `padding: 20px`, `border: 5px solid black` och `margin: 10px`, vad blir elementets totala bredd?

**Förslag till svar:**
**Box model består av (utifrån och in):**
1. **Margin:** Genomskinligt utrymme utanför elementet.
2. **Border:** Elementets kantlinje.
3. **Padding:** Genomskinligt utrymme mellan border och content.
4. **Content:** Själva innehållet.

**Standardberäkning (`box-sizing: content-box`):**
- Content: 200px
- Padding: 20px × 2 = 40px
- Border: 5px × 2 = 10px
- **Total bredd: 250px** (margin räknas inte in i elementets bredd, men påverkar avståndet till andra element)

**Med `box-sizing: border-box`:** Padding och border inkluderas i width, så content-området blir 150px bred.

---

## Fråga 5: Display-egenskaper

**Fråga:**  
Vad är skillnaden mellan `display: block`, `display: inline` och `display: inline-block`?

**Förslag till svar:**
- **`display: block`:**
  - Börjar på ny rad.
  - Tar hela tillgängliga bredden.
  - Respekterar `width`, `height`, alla `margin` och `padding`.
  - Exempel: `<div>`, `<p>`, `<h1>`.

- **`display: inline`:**
  - Flödar med texten (ingen ny rad).
  - Tar bara nödvändig bredd.
  - Ignorerar `width`, `height`, `margin-top/bottom`, `padding-top/bottom`.
  - Exempel: `<span>`, `<a>`, `<strong>`.

- **`display: inline-block`:**
  - Flödar som inline (ingen ny rad).
  - Men respekterar alla box model-egenskaper som block.
  - Perfekt för knappar eller element som ska vara bredvid varandra men ha specifika dimensioner.

---

## Fråga 6: CSS-positionering

**Fråga:**  
Förklara skillnaden mellan `position: relative`, `position: absolute` och `position: fixed`. Ge exempel på användningsfall för var och en.

**Förslag till svar:**
- **`position: relative`:**
  - Elementet följer normala flödet.
  - Kan förskjutas med `top`, `left` etc. relativt till ursprunglig position.
  - Lämnar tomt utrymme där det skulle ha varit.
  - **Användning:** Små justeringar, som positioneringskontext för absoluta barn.

- **`position: absolute`:**
  - Tas helt ur normala flödet.
  - Positioneras relativt till närmaste positionerade förälder.
  - **Användning:** Tooltips, dropdown-menyer, overlays.

- **`position: fixed`:**
  - Positioneras relativt till webbläsarfönstret.
  - Stannar kvar vid scrollning.
  - **Användning:** Fasta navigationsmenyer, "tillbaka till toppen"-knappar.

---

## Fråga 7: Färger och typografi

**Fråga:**  
Förklara skillnaden mellan dessa färgformat och när du skulle använda dem:
```css
color: red;
color: #FF0000;
color: rgb(255, 0, 0);
color: rgba(255, 0, 0, 0.5);
```

**Förslag till svar:**
- **`red`** – Namngiven färg: Enkelt för grundfärger, begränsat utbud.
- **`#FF0000`** – HEX: Vanligast för webben, exakt färgkontroll, används av designers.
- **`rgb(255, 0, 0)`** – RGB: Bra när man arbetar med RGB-värden från grafiska program.
- **`rgba(255, 0, 0, 0.5)`** – RGBA: Som RGB men med genomskinlighet (alpha). Perfekt för overlays och genomskinliga element.

**Rekommendation:** HEX för fasta färger, RGBA när genomskinlighet behövs.

---

## Fråga 8: Responsiv design – Media Queries

**Fråga:**  
Vad är skillnaden mellan dessa två Media Queries och vilken strategi representerar de?
```css
/* A */
@media (max-width: 768px) {
  .container { width: 100%; }
}

/* B */
@media (min-width: 768px) {
  .container { width: 80%; }
}
```

**Förslag till svar:**
- **A (`max-width`):** Desktop-first design
  - Skriver stilar för stora skärmar först.
  - Ändrar/tar bort stilar för mindre skärmar.
  - Regel gäller när skärmen är 768px eller *mindre*.

- **B (`min-width`):** Mobile-first design (rekommenderad)
  - Skriver grundstilar för mobil först.
  - Lägger till/förbättrar stilar för större skärmar.
  - Regel gäller när skärmen är 768px eller *större*.

**Mobile-first design är bättre** för prestanda och tvingar fram prioritering av kärninnehåll.

---

## Fråga 9: Mobile-first design

**Fråga:**  
Varför rekommenderas mobile-first design och hur implementerar du det i CSS?

**Förslag till svar:**
**Fördelar med mobile-first design:**
- **Prestanda:** Mobila enheter laddar enkla stilar först, komplexa läggs till progressivt.
- **Innehållsprioritet:** Tvingar fokus på viktigaste innehållet först.
- **Enklare CSS:** Lättare att lägga till än att ta bort/skriva över komplexa stilar.

**Implementation:**
```css
/* Grundstilar för mobil (ingen media query) */
.container {
  width: 100%;
  padding: 10px;
}

/* Tablet och uppåt */
@media (min-width: 768px) {
  .container {
    width: 80%;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

**Viktigt:** Alltid inkludera viewport meta-tag:  
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## Fråga 10: Flexibla enheter

**Fråga:**  
Förklara skillnaden mellan `px`, `em`, `rem` och `%`. När skulle du använda respektive enhet?

**Förslag till svar:**
- **`px`** – Absolut enhet: Exakt storlek, alltid samma.
  - **Använd för:** Borders, små detaljer som ska vara konstanta.

- **`em`** – Relativt till förälderns `font-size`.
  - **Problem:** Kan ge komplexa beräkningar vid nesting.
  - **Använd för:** Padding/margin som ska skala med textstorlek.

- **`rem`** – Relativt till rot-elementets `font-size`.
  - **Fördelar:** Förutsägbar skalning, respekterar användarinställningar.
  - **Använd för:** Font-storlekar, padding, margin.

- **`%`** – Relativt till förälderns motsvarande egenskap.
  - **Använd för:** Bredder i responsiva layouter.

**Modern best practice:** `rem` för typografi och spacing, `%` för layouter, `px` för borders.

---

## Fråga 11: Flexbox layout

**Fråga:**  
Förklara hur Flexbox fungerar. Vad är skillnaden mellan `justify-content` och `align-items`? Ge ett exempel på när du skulle använda Flexbox.

**Förslag till svar:**
**Flexbox (Flexible Box Layout):**
- **Endimensionell layout** – arbetar med antingen rader eller kolumner.
- **Flex container** (förälder) och **flex items** (barn).
- Aktiveras med `display: flex;` eller `display: inline-flex;`.

**Viktiga egenskaper:**
- **`justify-content`:** Justerar items längs **huvudaxeln** (main axis).
  - Värden: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`.
- **`align-items`:** Justerar items längs **tväraxeln** (cross axis).
  - Värden: `stretch`, `flex-start`, `flex-end`, `center`, `baseline`.

**Exempel – Centrera innehåll:**
```css
.container {
  display: flex;
  justify-content: center; /* Centrerar horisontellt */
  align-items: center;     /* Centrerar vertikalt */
  height: 100vh;
}
```

**Användningsfall:** Navigationsmenyer, centrering av innehåll, fördelning av utrymme mellan element.

---

## Fråga 12: CSS Grid layout

**Fråga:**  
Vad är skillnaden mellan CSS Grid och Flexbox? Visa hur du skulle skapa en enkel 3-kolumns layout med Grid.

**Förslag till svar:**
**CSS Grid vs Flexbox:**
- **Grid:** Tvådimensionell layout (rader och kolumner samtidigt).
- **Flexbox:** Endimensionell layout (antingen rad eller kolumn).

**Grid för komplexa layouter, Flexbox för enklare komponenter.**

**Exempel – 3-kolumns layout:**
```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* 3 kolumner */
  gap: 20px; /* Avstånd mellan items */
}

/* Responsiv variant */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr; /* En kolumn på mobil */
  }
}
```

**Grid-terminologi:**
- `grid-template-columns/rows`: Definierar kolumn/rad-storlekar.
- `fr` (fraction): Tar en andel av tillgängligt utrymme.
- `gap`: Avstånd mellan grid-items.
- `grid-area`: Placerar items på specifika positioner.

**Användningsfall:** Sidlayouter, kort-layouts, komplexa responsiva designs.

---

## Tips för tekniska intervjuer

- **Visa dina kunskaper visuellt** – rita box model eller beskriv layout-flöde.
- **Förklara trade-offs** – diskutera för- och nackdelar med olika tillvägagångssätt.
- **Ge praktiska exempel** från projekt du arbetat på.
- **Fråga om kontext** – olika lösningar passar olika situationer.
- **Visa problemlösningsförmåga** – förklara hur du skulle felsöka CSS-problem.
