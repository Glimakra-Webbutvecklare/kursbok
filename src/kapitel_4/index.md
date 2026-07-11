# Kapitel 4: JavaScript – Gör webben interaktiv

I de tidigare kapitlen har vi lärt oss att bygga upp webbsidor med HTML, ge dem struktur och semantik, samt styla dem med CSS. Men webben är mer än bara statiskt innehåll och utseende – det är interaktivitet, dynamik och möjligheten att reagera på användarens handlingar. Det är här **JavaScript** kommer in.

**JavaScript** är det språk som ger liv åt webbsidor. Med JavaScript kan du:
- Hantera händelser som en användare initierar.
- Ändra innehåll och stil på sidan utan att ladda om den.
- Hämta och visa data från andra tjänster (API:er).
- Skapa spel, animationer och mycket mer.

> **Så här lär du dig JavaScript i den här boken**  
> Varje lektion innehåller **interaktiva kodexempel** där du kan ändra koden och klicka på **Kör**. Efter varje övning finns en uppmaning att **göra samma sak i ditt eget projekt** – det är där kunskapen fastnar. Playgrounden i boken är uppvärmning, inte slutmålet.

---

## Vårt exempelprojekt: `portfolio-site`

Genom hela kapitlet fortsätter vi med samma projekt som i Git-kapitlet: en enkel portfoliosida med `index.html` (och eventuellt `about.html`). Du lägger till en fil `script.js` och gör sidan interaktiv steg för steg – räknare, formulär och mer.

Om du inte har `portfolio-site` än: skapa mappen och en enkel `index.html` (se [Git-kapitlet](../git/forsta-commits.md)).

---

## Vad kommer du att lära dig i detta kapitel?

- **Introduktion till JavaScript:** Vad är JavaScript och hur används det i webbläsaren?
- **Grunderna i programmering:** Variabler, datatyper, operatorer och uttryck.
- **Villkor och logik:** If-satser och jämförelser.
- **Loopar:** Hur du upprepar kod med for- och while-loopar.
- **Funktioner:** Hur du organiserar och återanvänder kod.
- **Interaktion med HTML (DOM):** Hur JavaScript kan läsa och ändra innehåll på sidan.
- **Händelser:** Hur du reagerar på användarens handlingar, t.ex. klick och tangenttryckningar.
- **Praktiska övningar:** Du bygger vidare på `portfolio-site` med JavaScript.

**Språkpolicy:**  
Svenska används i förklaringar, men engelska tekniska termer anges i parentes första gången de nämns. Variabel- och funktionsnamn skrivs på engelska.

---

Nu är det dags att ta steget från statiska sidor till program som kan reagera och förändras.
