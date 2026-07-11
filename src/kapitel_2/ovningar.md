# Praktiska övningar: HTML

Nu är det dags att skriva HTML själv. Börja med övning 1 och öppna alltid din `index.html` i webbläsaren efter en ändring. Jämför vad du skrev med vad som faktiskt syns.

> **Mål:**  
> Skapa en enkel, semantisk HTML-sida med rubriker, text, listor, länkar och tillgänglighetsgrunder.

**Förutsättningar:**  
Du behöver en editor, till exempel VS Code, och en webbläsare. Git kommer i nästa kapitel.

---

## Övning 1: Skapa en enkel ”Om mig”-sida

1. **Skapa projektmapp:**  
   Skapa en ny mapp, t.ex. `om-mig-sida`.

2. **Skapa HTML-fil:**
   Skapa en fil med namnet `index.html` i mappen.

3. **Grundstruktur:**
   Lägg till grundläggande HTML5-struktur i `index.html`:
   - `<!DOCTYPE html>`
   - `<html lang="sv">`
   - `<head>` med `<meta charset="UTF-8">` och `<title>`
   - `<body>`

   Ge sidan en passande titel, t.ex. "Om [Ditt Namn]".

4. **Lägg till innehåll i `<body>`:**
   - En huvudrubrik (`<h1>`) med ditt namn.
   - En kort paragraf (`<p>`) som introducerar dig.
   - En underrubrik (`<h2>`) för "Mina intressen".
   - En oordnad lista (`<ul>`) med några av dina intressen (`<li>`).
   - En underrubrik (`<h2>`) för "Kontakt".
   - En paragraf (`<p>`) med en länk (`<a>`) till din (påhittade eller riktiga) e-postadress (`href="mailto:din.epost@example.com"`).
   - (Valfritt) En bild (`<img>`) på dig själv eller något relaterat. Glöm inte `alt`-attributet!

5. **Kontrollera resultatet:**
   Öppna `index.html` i din webbläsare. Kontrollera att du kan se rubrikerna, listan och länken. Prova länken.

6. **Validera (bonus):**
   Klistra in din HTML-kod i [W3C Markup Validation Service](https://validator.w3.org/) för att kontrollera att den är korrekt.

---

## Övning 2: Semantisk struktur och fler ändringar

1. **Fortsätt i samma projekt.**

2. **Lägg till semantiska element:**  
   - Omslut rubriken och introduktionen med `<header>`.
   - Omslut huvudinnehållet (intressen, kontakt) med `<main>`.
   - Lägg till en `<footer>` längst ner, t.ex. med copyright.
   - Om du har flera tydliga delar i `<main>`, omslut dem med `<section>` och ge varje sektion en egen rubrik (`<h2>`).

3. **Kontrollera din struktur:**
   Jämför din sida med trädet nedan. Är `<header>`, `<main>` och `<footer>` syskon? Ligger varje `<section>` i `<main>`?

   ```text
   body
   ├── header
   ├── main
   │   ├── section
   │   └── section
   └── footer
   ```

4. **Kontrollera resultatet:**
   Uppdatera sidan i webbläsaren. HTML ser kanske nästan likadan ut utan CSS – det är normalt. Vinsten här är en tydlig struktur för människor, skärmläsare och framtida CSS.

---

## Övning 3: Lägg till en tabell

Fortsätt på din ”Om mig”-sida och skapa en tabell med något som passar dina intressen: filmer du vill se, spel du spelar eller recept du vill laga.

1. Lägg till en `<section>` med rubriken “Min lista”.
2. Skapa en tabell med minst två kolumnrubriker i `<th>`.
3. Lägg till minst tre rader data med `<td>`.
4. Använd `<thead>` för rubrikraden, `<tbody>` för resten och `scope="col"` på varje kolumnrubrik.
5. Öppna sidan i webbläsaren. Går informationen att jämföra rad för rad?

> Kontrollfråga: Om du tog bort alla CSS-stilar, skulle informationen fortfarande vara lätt att läsa som en tabell? Om svaret är nej kanske det är layout, inte tabelldata.

---

## Övning 4: Lägg till ett kontaktformulär

Lägg till ett enkelt formulär i din kontaktsektion.

1. Lägg ett `<form>` runt fälten.
2. Skapa ett fält för namn och ett för e-postadress. Använd `type="email"` för e-postfältet.
3. Lägg till ett `<textarea>` för ett meddelande.
4. Ge varje fält en `<label>` och koppla den med `for` och `id`.
5. Lägg till ett `name` på varje fält och en knapp med `type="submit"`.
6. Testa att klicka på varje etikett. Hamnar markören i rätt fält?

Använd inte en riktig e-postadress eller känslig information. Formuläret behöver en server för att faktiskt kunna ta emot och hantera data – det lär du dig mer om senare.

---

## Utmaning: Gör sidan mer tillgänglig

Gå igenom din ”Om mig”-sida och förbättra den:

1. Har bilden en alt-text som beskriver det viktiga i bilden? Om den bara är dekoration, använd `alt=""`.
2. Förstår man vart varje länk leder utan att läsa texten runt omkring?
3. Har sidan exakt en tydlig `<h1>` och logiska underrubriker?
4. Är sidans språk angivet med `<html lang="sv">`?

Be en klasskamrat läsa din HTML-kod, inte bara titta på sidan. Kan personen förstå sidans olika delar?

---

## Sammanfattning och nästa steg

Du har skapat en HTML-sida, sett resultatet i webbläsaren, förbättrat strukturen och använt både tabell och formulär. I nästa kapitel lär du dig Git för att spara och följa ändringar. CSS kommer senare och ger HTML-sidan ett visuellt utseende.
