# Praktiska övningar: JavaScript och interaktivitet

Att läsa teori är viktigt, men det är genom att skriva och testa kod som du verkligen lär dig JavaScript. Här hittar du övningar som hjälper dig att befästa kunskaperna från kapitlet om JavaScript, DOM-manipulation och händelser.

> **Mål:**  
> Träna på att använda JavaScript för att skapa interaktivitet, manipulera DOM och hantera händelser på webbsidor.

**Förutsättningar:**  
Du har en HTML-fil att arbeta med och kan lägga till eller länka en JavaScript-fil. Du kan öppna sidan i en webbläsare och se resultatet av din kod.

---

## Övning 1: Skriv ut meddelande i konsolen

1. Skapa en fil `script.js` och koppla den till din HTML-fil med `<script src="script.js"></script>`.
2. Skriv kod som skriver ut "Hello, JavaScript!" i webbläsarens konsol.
3. Öppna webbsidan och kontrollera i konsolen (F12) att meddelandet syns.

---

## Övning 2: Ändra text på sidan med JavaScript

1. Lägg till ett element i din HTML, t.ex. `<p id="message">Detta ska ändras</p>`.
2. Skriv JavaScript som ändrar texten i paragrafen till "Texten är nu ändrad!" när sidan laddas.

---

## Övning 3: Byt färg på ett element vid knapptryck

1. Lägg till en knapp: `<button id="colorBtn">Byt färg</button>` och ett text-element: `<p id="colorText">Färgtest</p>`.
2. Skriv JavaScript som gör att texten i `colorText` byter färg (t.ex. till blå) när du klickar på knappen.

---

## Övning 4: Lägg till nya element i DOM

1. Lägg till en tom lista i HTML: `<ul id="myList"></ul>` och en knapp: `<button id="addBtn">Lägg till punkt</button>`.
2. Skriv JavaScript som lägger till ett nytt `<li>`-element med valfri text i listan varje gång du klickar på knappen.

---

## Övning 5: Enkel räknare

1. Lägg till en knapp: `<button id="countBtn">Räkna</button>` och ett element för att visa räknaren: `<span id="counter">0</span>`.
2. Skriv JavaScript som ökar värdet i `counter` med 1 varje gång du klickar på knappen.

---

## Övning 6: Formulär och validering

1. Lägg till ett enkelt formulär i HTML:
   ```html
   <form id="myForm">
     <input type="text" id="nameInput" placeholder="Skriv ditt namn">
     <button type="submit">Skicka</button>
   </form>
   <p id="formMessage"></p>
   ```
2. Skriv JavaScript som:
   - Förhindrar att sidan laddas om när formuläret skickas.
   - Läser av värdet i `nameInput`.
   - Skriver ut ett meddelande i `formMessage`, t.ex. "Hej, [namn]!", om fältet inte är tomt. Om det är tomt, visa ett felmeddelande.

---

## Sammanfattning och nästa steg

Genom att göra dessa övningar får du praktisk erfarenhet av att använda JavaScript för att manipulera DOM och hantera händelser. Fortsätt experimentera – prova att lägga till fler funktioner, kombinera övningarna eller skapa egna små projekt!

I nästa kapitel lär du dig mer om hur du strukturerar och återanvänder kod med funktioner och moduler, samt hur du arbetar med mer avancerade datatyper och asynkrona operationer.