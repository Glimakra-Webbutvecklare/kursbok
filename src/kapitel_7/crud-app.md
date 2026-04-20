# Bygga en CRUD-applikation: Enkel Blogg

I detta avsnitt bygger vi en komplett men enkel bloggapplikation från grunden med PHP och MariaDB/MySQL. Målet är att praktiskt demonstrera **CRUD**-operationerna (Create, Read, Update, Delete) och integrera andra viktiga webbkoncept som databasinteraktion med PDO, användarautentisering, sessionshantering och filuppladdning.

Vi börjar med en mycket grundläggande struktur och kodstil för att sedan i slutet refaktorera och förbättra koden, bland annat genom att introducera type hinting. Varje del byggs steg för steg – du får inte hela lösningen på en gång utan bygger upp funktionaliteten inkrementellt.

**Applikationens Funktioner:**

*   Användare kan registrera sig och logga in.
*   Inloggade användare kan skapa, redigera och ta bort sina egna blogginlägg.
*   Användare kan ladda upp en bild till varje blogginlägg.
*   Alla besökare kan se listan över blogginlägg och läsa enskilda inlägg.
*   En enkel "admin"-sektion för inloggade användare att hantera sina inlägg.

## Läsordning

Lektionen är uppdelad i följande delar. Följ dem i ordning:

1.  **[Setup och databas](crud-app-1-setup.md)** – Databasdesign, projektstruktur, config och database.php
2.  **[Autentisering](crud-app-2-autentisering.md)** – Registrering, inloggning, sessioner och logout
3.  **[Skapa och läsa inlägg](crud-app-3-create-read.md)** – Create (formulär med bilduppladdning), Read (index, post)
4.  **[Uppdatera och radera](crud-app-4-update-delete.md)** – Edit, Delete, Admin-panel
5.  **[Refaktorering](crud-app-5-refaktorering.md)** – `Post`-modell, type hinting, förbättrad filstruktur

**Förutsättningar:** Du har läst [MySQL och databaser](sql.md) inklusive avsnittet om PHP och PDO.
