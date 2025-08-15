# HTML och tillgänglighet (accessibility)

Vi har pratat om semantisk HTML och hur det hjälper maskiner (som sökmotorer och skärmläsare) att förstå vårt innehåll. En av de absolut viktigaste anledningarna till att använda korrekt, semantisk HTML är **webbtillgänglighet** (ofta förkortat **a11y** – 'a' följt av 11 bokstäver och ett 'y').

> **Vad är webbtillgänglighet?**  
> Det handlar om att designa och utveckla webbplatser och applikationer så att de kan användas av *alla* människor, oavsett deras förmågor eller funktionsvariationer. Detta inkluderar personer med:
> - Synnedsättningar (blinda, svagsynta, färgblinda)
> - Hörselnedsättningar
> - Motoriska funktionsnedsättningar (svårt att använda mus eller tangentbord)
> - Kognitiva funktionsnedsättningar (inlärningssvårigheter, minnesproblem)

**Varför är det viktigt?**

1. **Mänskliga rättigheter:** Alla har rätt att ta del av information och tjänster online.
2. **Lagar och regler:** Många länder (inklusive inom EU) har lagkrav på att offentliga och vissa privata webbplatser ska vara tillgängliga (t.ex. [Webbtillgänglighetsdirektivet](https://www.digg.se/webbriktlinjer/lagar-och-standarder/webbtillganglighetsdirektivet)).
3. **Bättre användarupplevelse för alla:** Principer för god tillgänglighet leder ofta till en bättre och tydligare upplevelse för *samtliga* användare.
4. **SEO:** God tillgänglighet och god SEO går ofta hand i hand, eftersom båda gynnas av tydlig struktur och semantik.

---

## Hur HTML bidrar till tillgänglighet

Att använda HTML korrekt är grunden för en tillgänglig webbplats. Här är några nyckelområden där HTML spelar en avgörande roll:

### 1. Semantisk struktur

- Använd semantiska element som `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` för att definiera sidans regioner. Detta gör det möjligt för skärmläsaranvändare att snabbt hoppa mellan olika delar av sidan.
- Använd rubriktaggar (`<h1>`–`<h6>`) i korrekt hierarkisk ordning för att skapa en logisk disposition.
- Använd listor (`<ul>`, `<ol>`, `<li>`) för att gruppera relaterade objekt.

### 2. Alternativtext för bilder (`alt`-attributet)

- **ALLTID** inkludera ett meningsfullt `alt`-attribut på `<img>`-taggar.
- Beskriv *syftet* eller *innehållet* i bilden kortfattat.
- Om bilden är dekorativ (inte förmedlar information), använd ett tomt alt-attribut: `alt=""`. Då ignoreras bilden av skärmläsare.

```html
<!-- Bra alt-text -->
<img src="hund.jpg" alt="En glad golden retriever som leker i parken">

<!-- Dekorativ bild -->
<img src="gra_linje.png" alt="">
```

### 3. Beskrivande länktexter

- Undvik vaga länktexter som "Klicka här" eller "Läs mer".
- Länktexten ska tydligt beskriva vart länken leder, även när den läses utanför sitt sammanhang.

```html
<!-- Undvik -->
<p>För mer information, <a href="rapport.pdf">klicka här</a>.</p>

<!-- Föredra -->
<p>Läs hela <a href="rapport.pdf">årsrapporten för 2023 (PDF)</a>.</p>
```

### 4. Formuläretiketter (`<label>`)

- Alla formulärkontroller (`<input>`, `<textarea>`, `<select>`) måste ha en associerad `<label>`.
- Labeln beskriver vad fältet är till för.
- Använd `for`-attributet på `<label>` för att koppla det till `id`-attributet på formulärkontrollen. Detta gör att skärmläsare kan läsa upp etiketten när fältet fokuseras, och användare kan klicka på etiketten för att aktivera fältet.

```html
<label for="user_email">E-postadress:</label>
<input type="email" id="user_email" name="email">
```

### 5. Språkattribut (`lang`)

- Ange sidans huvudsakliga språk på `<html>`-taggen (`<html lang="sv">`).
- Om en del av innehållet är på ett annat språk, ange det med `lang`-attributet på det omslutande elementet. Detta hjälper skärmläsare att använda korrekt uttal.

```html
<p>Han sa <span lang="en">"Hello world"</span>.</p>
```

### 6. Tabeller för data

- Använd tabeller (`<table>`) endast för att presentera tabulär data, inte för layout.
- Använd `<thead>` för tabellrubriker, `<tbody>` för tabelldata, och `<th>` (table header) för rubrikceller. Använd `scope`-attributet (`scope="col"` för kolumnrubriker, `scope="row"` för radrubriker) för att tydligt koppla dataceller till sina rubriker.

```html
<table>
  <thead>
    <tr>
      <th scope="col">Produkt</th>
      <th scope="col">Pris</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Äpple</td>
      <td>5 kr</td>
    </tr>
  </tbody>
</table>
```

---

## Kort om WAI-ARIA

För mer komplexa komponenter och interaktioner (som ofta skapas med JavaScript) räcker ibland inte vanlig HTML till för att förmedla all nödvändig information till hjälpmedel. Då kan **WAI-ARIA** (Web Accessibility Initiative – Accessible Rich Internet Applications) användas. ARIA är en uppsättning speciella attribut som kan läggas till i HTML för att förbättra tillgängligheten, t.ex. för att beskriva roller (`role="button"`), tillstånd (`aria-pressed="true"`) och egenskaper hos dynamiska komponenter.

Vi går inte djupt in på ARIA i denna grundkurs, men det är bra att känna till att det finns för mer avancerade behov.

---

## Sammanfattning

Webbtillgänglighet handlar om att skapa webbplatser som fungerar för alla. Korrekt och semantisk HTML är grunden för detta. Genom att använda semantiska strukturelement, meningsfulla `alt`-texter för bilder, beskrivande länktexter, korrekta formuläretiketter (`<label>`), och ange språk (`lang`), skapar vi en mer robust och tillgänglig upplevelse. Att tänka på tillgänglighet från början är inte bara en god praxis, utan ofta också ett lagkrav och gynnar alla användare.

Nu när vi har en god grund i HTML är det dags att titta på det andra viktiga verktyget i detta kapitel: Git.
