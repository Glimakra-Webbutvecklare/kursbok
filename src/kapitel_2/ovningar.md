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

## Utmaning: Gör sidan mer tillgänglig

Gå igenom din ”Om mig”-sida och förbättra den:

1. Har bilden en alt-text som beskriver det viktiga i bilden? Om den bara är dekoration, använd `alt=""`.
2. Förstår man vart varje länk leder utan att läsa texten runt omkring?
3. Har sidan exakt en tydlig `<h1>` och logiska underrubriker?
4. Är sidans språk angivet med `<html lang="sv">`?

Be en klasskamrat läsa din HTML-kod, inte bara titta på sidan. Kan personen förstå sidans olika delar?

---

## Sammanfattning och nästa steg

Du har skapat en HTML-sida, sett resultatet i webbläsaren och förbättrat strukturen med semantiska element. I nästa kapitel lär du dig Git för att spara och följa dina ändringar. CSS kommer senare och ger HTML-sidan ett visuellt utseende.
