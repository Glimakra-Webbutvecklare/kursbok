# Kapitel 5: Fortsättning JavaScript - Asynkron Kod och Datahantering

I föregående kapitel lade vi grunden för JavaScript genom att manipulera DOM, hantera händelser och göra `portfolio-site` interaktiv. Nu är det dags att dyka djupare in i mer avancerade, men helt nödvändiga, koncept för modern webbutveckling.

> **Så här lär du dig async JavaScript i den här boken**  
> Lektionerna har **interaktiva kodexempel** där du kan experimentera direkt i boken. När vi hämtar data från API:er uppmanas du att **köra samma kod i `portfolio-site`** på din egen dator – där ser du riktiga nätverksanrop och DOM-uppdateringar.

---

## Vårt exempelprojekt: `portfolio-site` (datadrivet)

Vi bygger vidare på `portfolio-site` och gör den **datadrivet**: hämta användare, todos och bloggposter från det publika test-API:et [JSONPlaceholder](https://jsonplaceholder.typicode.com/) och visa dem på sidan. Varje lektion lägger till en bit av detta "portfolio-dashboard".

**Förutsättning:** Du har en fungerande `portfolio-site` med HTML, `script.js` och grundläggande DOM-kunskaper från kapitel 4.

---

## Vad vi kommer att gå igenom

1. **Asynkron programmering** – händelseloopen (event loop) och callbacks.
2. **Promises och async/await** – modern hantering av asynkron kod.
3. **JSON** – dataformatet som API:er använder.
4. **Array- och objektmetoder** – `map`, `filter`, `reduce` för att bearbeta data.
5. **Fetch API** – hämta data från externa tjänster.
6. **Praktiska övningar** – bygg ett komplett portfolio-dashboard.

Detta kapitel ger dig verktygen för att skapa dynamiska och datadrivna webbapplikationer.

När du kan hämta JSON med `fetch` är nästa steg att göra det i grupp: år 1 bygger frontend mot ett API som år 2 skriver. Handboken för det arbetet – issues, PR-review, Docker och kontrakt – finns i [Grupparbete: frontend och API](../grupparbete/index.md).
