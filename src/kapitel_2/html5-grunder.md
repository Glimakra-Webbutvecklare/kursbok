# Grunderna i HTML5: Att strukturera webbens innehåll

HTML (HyperText Markup Language) är skelettet i varje webbsida. Det är inte ett programmeringsspråk, utan ett **märkspråk** (markup language). Vi använder **taggar** (tags) för att berätta för webbläsaren hur innehållet ska struktureras och vad de olika delarna betyder.

> **Mål:**  
> Förstå grundstrukturen i ett HTML-dokument och lära dig de vanligaste taggarna för att skapa text, rubriker, listor, länkar och bilder.

---

## HTML-dokumentets grundstruktur

Varje HTML-sida följer en grundläggande mall. Här är ett minimalt exempel:

```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Min första webbsida</title>
</head>
<body>
    <h1>Hej världen!</h1>
    <p>Detta är min första webbsida.</p>
</body>
</html>
```

**Förklaring av delarna:**

- `<!DOCTYPE html>`: Deklaration som talar om för webbläsaren att dokumentet är HTML5. Ska alltid vara först.
- `<html>`: **Rotelementet** (root element) som omsluter allt innehåll på sidan (förutom `DOCTYPE`). Attributet `lang="sv"` anger att sidans språk är svenska.
- `<head>`: Innehåller **metadata** om dokumentet – information som inte visas direkt på sidan men är viktig för webbläsare och sökmotorer.
    - `<meta charset="UTF-8">`: Anger teckenkodningen. `UTF-8` stöder de flesta tecken (inklusive å, ä, ö).
    - `<title>`: Sidans titel, visas i webbläsarens flik och används av sökmotorer.
- `<body>`: Innehåller allt **synligt innehåll** på webbsidan – text, rubriker, bilder, länkar, listor, etc.

---

## Taggar, element och attribut

- **Taggar (tags):** Markerar början och slutet på ett element. Skrivs inom vinkelparenteser (`< >`). De flesta taggar kommer i par: en **starttagg** (t.ex. `<p>`) och en **sluttagg** (t.ex. `</p>`).
- **Element:** Ett komplett HTML-element består av en starttagg, innehåll och en sluttagg. Exempel: `<p>Detta är en paragraf.</p>`.
    - **Tomma element (empty elements):** Har ingen sluttagg, t.ex. `<br>`, `<img>`, `<meta>`.
- **Attribut (attributes):** Ger extra information om ett element. Skrivs i starttaggen och består av namn och värde (inom citationstecken). Exempel: `<img src="bild.jpg" alt="Beskrivning">`.
    - `lang`: Anger språk.
    - `src`: (source) Bildens källa.
    - `alt`: (alternative text) Alternativ text för bilder (viktigt för tillgänglighet).
    - `href`: (hypertext reference) Länkens mål.

---

## Vanliga HTML-element

### Rubriker (`<h1>` till `<h6>`)

Används för att definiera rubriknivåer. `<h1>` är viktigast (sidans huvudrubrik), `<h6>` minst viktig.

```html
<h1>Huvudrubrik</h1>
<h2>Underrubrik</h2>
<h3>Under-underrubrik</h3>
```

### Paragrafer (stycken) (`<p>`)

Används för att gruppera text i stycken.

```html
<p>Detta är det första stycket med text.</p>
<p>Detta är ett andra stycke.</p>
```

### Länkar (anchors) (`<a>`)

Skapar hyperlänkar till andra sidor eller resurser. `href` är obligatoriskt och anger destinationen.

```html
<a href="https://www.google.com">Sök på Google</a>
<a href="annan_sida.html">Länk till en lokal sida</a>
```

### Bilder (`<img>`)

Bäddar in bilder. Tomt element (ingen sluttagg). `src` anger bildens källa, `alt` är alternativ text.

```html
<img src="bilder/logo.png" alt="Företagets logotyp">
```

### Listor

- **Oordnade listor (unordered lists):** `<ul>` (punkter)
- **Ordnade listor (ordered lists):** `<ol>` (nummer)
- **Listelement (list items):** `<li>` (används i `<ul>` eller `<ol>`)

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

### Radbrytning (`<br>`)

Skapar en enkel radbrytning. Använd sparsamt – strukturera hellre med paragrafer.

### Kommentarer (`<!-- ... -->`)

Kommentarer syns inte i webbläsaren men är användbara för anteckningar i koden.

```html
<!-- Detta är en kommentar -->
```

---

## HTML – en standard

HTML utvecklas ständigt. Använd alltid den aktuella standarden:  
[https://html.spec.whatwg.org/multipage/](https://html.spec.whatwg.org/multipage/)

---

## Sammanfattning

- HTML är grunden för allt webbinnehåll.
- Ett HTML-dokument består av `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`.
- Taggar, element och attribut används för att strukturera och beskriva innehållet.
- Vanliga element: rubriker (`<h1>`–`<h6>`), paragrafer (`<p>`), länkar (`<a>`), bilder (`<img>`), listor (`<ul>`, `<ol>`, `<li>`).
- Skriv ren och korrekt HTML – det är första steget mot fungerande webbsidor.

I nästa avsnitt lär du dig hur semantisk HTML kan ge ditt innehåll ännu mer mening och struktur.
