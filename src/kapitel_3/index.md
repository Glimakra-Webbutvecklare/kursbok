# Kapitel 3: Grundläggande CSS - Ge Stil åt Webbens Struktur

I det föregående kapitlet lade vi grunden med HTML, webbsidornas skelett, och lärde oss hantera koden med Git. Men enbart HTML ger oss ganska tråkiga och ostrukturerade sidor. Hur får vi dem att se bra ut? Hur kontrollerar vi färger, typsnitt, layout och anpassar utseendet för olika skärmstorlekar?

Svaret är **CSS (Cascading Style Sheets)**. CSS är språket vi använder för att beskriva presentationen och stilen för HTML-dokument. Om HTML är skelettet, är CSS kläderna, sminket och frisyren – det som ger sidan dess visuella identitet.

**Varför är CSS viktigt?**

*   **Separation of Concerns:** CSS låter oss separera innehållets *struktur* (HTML) från dess *presentation* (CSS). Detta gör koden renare, lättare att underhålla och mer flexibel.
*   **Visuell Design:** CSS ger oss kontroll över allt från färger och typsnitt till komplexa layouter och animationer.
*   **Responsivitet:** Med CSS kan vi skapa webbplatser som anpassar sig och ser bra ut på alla typer av enheter – från stora datorskärmar till mobiler och surfplattor.
*   **Effektivitet:** Genom att definiera stilar på ett ställe och återanvända dem kan vi enkelt uppdatera utseendet på hela webbplatser med små ändringar.

I detta kapitel kommer vi att:

*   **Introducera CSS:** Förstå vad CSS är och hur man kopplar det till HTML.
*   **Utforska Selektorer, Färger och Typografi:** Lära oss hur man väljer ut HTML-element (`selektorer`) och applicerar grundläggande stilar som färger och typsnitt.
*   **Förstå Boxmodellen och Layout:** Gå igenom hur varje HTML-element kan ses som en låda och hur vi kan kontrollera dess dimensioner, marginaler och utfyllnad (padding) för att skapa layouter.
*   **Introducera Responsiv Design:** Lära oss grunderna i hur man använder Media Queries för att anpassa stilar baserat på skärmstorlek.
*   **Diskutera Mobile-First Design:** Förstå principen att designa för mobilen först och sedan skala upp.
*   **Genomföra Praktiska Övningar:** Applicera CSS-regler för att styla den "Om Mig"-sida vi skapade i förra kapitlet.

Låt oss börja ge våra HTML-sidor lite färg och form!
