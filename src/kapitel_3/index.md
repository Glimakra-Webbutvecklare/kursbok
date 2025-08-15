# Kapitel 3: Grundläggande CSS – Ge Stil åt Webbens Struktur

I det föregående kapitlet lade vi grunden med HTML, webbsidornas skelett, och lärde oss hantera koden med Git. Men enbart HTML ger oss ganska tråkiga och ostrukturerade sidor. Hur får vi dem att se bra ut? Hur kontrollerar vi färger, typsnitt, layout och anpassar utseendet för olika skärmstorlekar?

Svaret är **CSS (Cascading Style Sheets)**. CSS är språket vi använder för att beskriva presentationen och stilen för HTML-dokument. Om HTML är skelettet, är CSS kläderna, sminket och frisyren – det som ger sidan dess visuella identitet.

> **Motivation:**  
> CSS gör det möjligt att separera struktur och utseende, vilket leder till renare kod, bättre underhåll och mer flexibla webbplatser. Med CSS kan du skapa allt från enkla färgändringar till avancerade, responsiva layouter.

---

## Varför är CSS viktigt?

- **Separation of Concerns:** CSS låter oss separera innehållets *struktur* (HTML) från dess *presentation* (CSS). Detta gör koden renare, lättare att underhålla och mer flexibel.
- **Visuell design:** CSS ger oss kontroll över allt från färger och typsnitt till komplexa layouter och animationer.
- **Responsivitet:** Med CSS kan vi skapa webbplatser som anpassar sig och ser bra ut på alla typer av enheter – från stora datorskärmar till mobiler och surfplattor.
- **Effektivitet:** Genom att definiera stilar på ett ställe och återanvända dem kan vi enkelt uppdatera utseendet på hela webbplatser med små ändringar.

---

## Vad kommer du att lära dig i detta kapitel?

- **Introduktion till CSS:** Vad CSS är och hur du kopplar det till HTML.
- **Selektorer, färger och typografi:** Hur du väljer ut HTML-element (selektorer) och applicerar grundläggande stilar som färger och typsnitt.
- **Box model och layout:** Hur varje HTML-element kan ses som en låda (box model) och hur du kan kontrollera dess dimensioner, marginaler (margin) och utfyllnad (padding) för att skapa layouter.
- **Responsiv design:** Grunderna i hur du använder Media Queries för att anpassa stilar baserat på skärmstorlek.
- **Mobile-first design:** Principen att designa för mobilen först och sedan skala upp för större skärmar.
- **Praktiska övningar:** Du får applicera CSS-regler för att styla den "Om Mig"-sida du skapade i förra kapitlet.

---

Låt oss börja ge våra HTML-sidor lite färg och form!
