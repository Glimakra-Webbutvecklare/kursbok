# Introduktion till SQL och Relationsdatabaser

När vi bygger webbapplikationer behöver vi nästan alltid ett sätt att lagra, organisera och hämta data på ett beständigt sätt. Det kan vara användarinformation, produktlistor, blogginlägg eller vad som helst som applikationen behöver komma ihåg mellan besök och över tid. Här kommer databaser in i bilden.

En **database** (databas) är en organiserad samling av data. Det finns olika typer av databaser, men för många traditionella webbapplikationer är **Relational Database Management Systems** (Relationsdatabashanteringssystem, RDBMS) det vanligaste valet. Exempel på populära RDBMS inkluderar MySQL, MariaDB, PostgreSQL, SQLite och Microsoft SQL Server. I det här kapitlet fokuserar vi på MariaDB (som är mycket likt MySQL), eftersom det fungerar bra ihop med PHP.

Kärnan i en relationsdatabas är konceptet med **tables** (tabeller). En tabell organiserar data i:
*   **Rows** (Rader): Varje rad representerar en enskild post eller ett objekt (t.ex. en specifik användare, en produkt).
*   **Columns** (Kolumner): Varje kolumn representerar ett specifikt attribut eller egenskap för posterna (t.ex. användarens namn, produktens pris).
*   **Relations** (Relationer): Data i olika tabeller kan kopplas samman baserat på gemensamma värden, vilket gör att vi kan kombinera information (t.ex. koppla en order till den användare som lade den).

För att kommunicera med ett RDBMS – för att definiera tabellstrukturer, lägga till, ändra, ta bort och hämta data – använder vi ett standardiserat språk som heter **SQL** (Structured Query Language, Uttalas ofta "Sequel" eller S-Q-L).

## Grundläggande SQL-Syntax

SQL består av olika **statements** (satser eller kommandon) som talar om för databasen vad den ska göra. Varje sats avslutas vanligtvis med ett semikolon (`;`), även om det ibland är valfritt beroende på verktyget man använder.

Viktiga nyckelord skrivs ofta med versaler av konvention (för läsbarhet), men SQL är generellt inte skiftlägeskänsligt för nyckelord. Tabell- och kolumnnamn kan dock vara skiftlägeskänsliga beroende på databasens konfiguration och operativsystemet.

Vanliga SQL-nyckelord inkluderar:

*   `SELECT`: Hämta data.
*   `INSERT INTO`: Lägga till nya rader.
*   `UPDATE`: Ändra befintliga rader.
*   `DELETE`: Ta bort rader.
*   `CREATE TABLE`: Skapa en ny tabell.
*   `ALTER TABLE`: Ändra en befintlig tabell.
*   `DROP TABLE`: Ta bort en tabell.
*   `FROM`: Anger vilken tabell data ska hämtas från.
*   `WHERE`: Filtrerar vilka rader som ska påverkas.
*   `VALUES`: Anger de värden som ska infogas.
*   `SET`: Anger vilka kolumner och värden som ska uppdateras.

Kommentarer i SQL skrivs antingen med två bindestreck (`--`) för en radskommentar, eller mellan `/*` och `*/` för flerradskommentarer.

```sql
-- Detta är en enradskommentar
SELECT name, email -- Hämta namn och e-post
FROM users
WHERE city = 'Stockholm'; /* Detta är en
   flerradskommentar */
```

## Datatyper i SQL

När vi skapar en tabell måste vi specificera vilken typ av data varje kolumn ska innehålla. Detta kallas **data type** (datatyp). Att välja rätt datatyp är viktigt för:

*   **Data Integrity** (Dataintegritet): Säkerställer att endast giltig data lagras (t.ex. inga bokstäver i en sifferkolumn).
*   **Storage Efficiency** (Lagringseffektivitet): Olika datatyper tar olika mycket plats.
*   **Performance** (Prestanda): Korrekta datatyper kan snabba upp sökningar och jämförelser.

Här är några vanliga datatyper i SQL (specifika namn kan variera något mellan olika RDBMS, men koncepten är desamma):

*   **Heltal:**
    *   `INT` eller `INTEGER`: Standard heltal (ofta 4 bytes).
    *   `TINYINT`: Mycket litet heltal (ofta 1 byte, -128 till 127 eller 0 till 255).
    *   `BIGINT`: Stort heltal (ofta 8 bytes).
*   **Decimaltal:**
    *   `DECIMAL(precision, scale)`: För exakta tal med fast antal decimaler (t.ex. `DECIMAL(10, 2)` för valuta). `precision` är totalt antal siffror, `scale` är antal decimaler.
    *   `FLOAT`, `DOUBLE`: Flyttal för approximativa värden (undviks ofta för valuta).
*   **Strängar (Text):**
    *   `VARCHAR(n)`: Textsträng med variabel längd upp till `n` tecken.
    *   `TEXT`: För längre textstycken utan specifik maxlängd (men det finns gränser).
    *   `CHAR(n)`: Textsträng med fast längd på `n` tecken (fylls ut med mellanslag om kortare).
*   **Datum och Tid:**
    *   `DATE`: Endast datum (YYYY-MM-DD).
    *   `TIME`: Endast tid (HH:MM:SS).
    *   `DATETIME`: Både datum och tid (YYYY-MM-DD HH:MM:SS).
    *   `TIMESTAMP`: Liknar `DATETIME` men används ofta för att automatiskt spåra när en rad skapades eller senast ändrades.
*   **Boolean (Logiskt värde):** SQL har ingen standard `BOOLEAN`-typ. Istället används ofta `TINYINT(1)` där `0` representerar `false` och `1` representerar `true`.

En kolumn kan också tillåta **`NULL`**-värden, vilket betyder att värdet är okänt eller saknas. Motsatsen är att definiera kolumnen med `NOT NULL`, vilket kräver att ett värde alltid anges.

## Skapa och Hantera Tabeller (DDL - Data Definition Language)

SQL-satser som används för att definiera eller ändra strukturen på databasobjekt (som tabeller) kallas **DDL (Data Definition Language)**.

### `CREATE TABLE`

Används för att skapa en ny tabell.

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unik identifierare för varje användare
    name VARCHAR(100) NOT NULL,       -- Användarens namn (max 100 tecken, får ej vara tomt)
    email VARCHAR(150) NOT NULL UNIQUE, -- E-post (max 150 tecken, får ej vara tomt, måste vara unikt)
    city VARCHAR(50),                   -- Stad (max 50 tecken, får vara tomt - NULL tillåtet)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Tidsstämpel när raden skapades
);
```

**Förklaringar:**

*   `CREATE TABLE users (...)`: Startar definitionen av en tabell med namnet `users`.
*   `id INT AUTO_INCREMENT PRIMARY KEY`: Definierar en kolumn `id` av typen `INT`. `AUTO_INCREMENT` gör att databasen automatiskt tilldelar ett nytt, unikt nummer för varje ny rad. `PRIMARY KEY` (Primärnyckel) markerar denna kolumn som den unika identifieraren för varje rad i tabellen. Ingen rad får ha samma `id`, och `id` får inte vara `NULL`.
*   `name VARCHAR(100) NOT NULL`: En textkolumn för namn, max 100 tecken. `NOT NULL` betyder att denna kolumn måste ha ett värde.
*   `email VARCHAR(150) NOT NULL UNIQUE`: En textkolumn för e-post. `UNIQUE` säkerställer att ingen annan rad i tabellen kan ha samma e-postadress.
*   `city VARCHAR(50)`: En textkolumn för stad. Eftersom `NOT NULL` saknas, tillåts `NULL`-värden här.
*   `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`: En tidsstämpelkolumn. `DEFAULT CURRENT_TIMESTAMP` betyder att om inget värde anges vid `INSERT`, sätts kolumnen automatiskt till den aktuella tidpunkten.

### `ALTER TABLE`

Används för att modifiera en befintlig tabell.

```sql
-- Lägg till en ny kolumn 'phone_number'
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(20);

-- Ändra datatypen för 'city'-kolumnen
ALTER TABLE users
MODIFY COLUMN city VARCHAR(60);

-- Ta bort 'phone_number'-kolumnen
ALTER TABLE users
DROP COLUMN phone_number;
```

### `DROP TABLE`

Används för att permanent ta bort en tabell och all dess data. **Använd med extrem försiktighet!**

```sql
DROP TABLE users;
```

*Not:* I moderna projekt används ofta **migrationsverktyg** (som Phinx, Doctrine Migrations, eller inbyggda i ramverk som Laravel) för att hantera databasstrukturförändringar på ett kontrollerat och versionshanterat sätt, istället för att köra `ALTER TABLE` manuellt.

## Hämta Data (`SELECT`)

Den absolut vanligaste SQL-satsen är `SELECT`, som används för att hämta data från en eller flera tabeller. Detta är en del av **DML (Data Manipulation Language)**.

### Grundläggande `SELECT`

```sql
-- Hämta specifika kolumner från tabellen 'users'
SELECT name, email
FROM users;

-- Hämta alla kolumner (* är en wildcard för alla)
SELECT *
FROM users;
```

### Filtrera Rader (`WHERE`)

`WHERE`-klausulen används för att specificera villkor som raderna måste uppfylla för att inkluderas i resultatet.

```sql
-- Hämta användare från Stockholm
SELECT name, email
FROM users
WHERE city = 'Stockholm';

-- Hämta användare som INTE är från Stockholm
SELECT name, email
FROM users
WHERE city != 'Stockholm'; -- Eller city <> 'Stockholm'

-- Hämta användare vars id är större än 10
SELECT id, name
FROM users
WHERE id > 10;

-- Hämta användare från Stockholm ELLER Göteborg
SELECT name, city
FROM users
WHERE city = 'Stockholm' OR city = 'Göteborg';

-- Alternativt med IN
SELECT name, city
FROM users
WHERE city IN ('Stockholm', 'Göteborg');

-- Hämta användare vars namn börjar på 'A'
-- % är en wildcard som matchar noll eller flera tecken
SELECT name
FROM users
WHERE name LIKE 'A%';

-- Hämta användare vars namn slutar på 'son'
SELECT name
FROM users
WHERE name LIKE '%son';

-- Hämta användare vars namn innehåller 'an'
SELECT name
FROM users
WHERE name LIKE '%an%';

-- Hämta användare där staden inte är angiven (är NULL)
SELECT name
FROM users
WHERE city IS NULL;

-- Hämta användare där staden ÄR angiven (inte NULL)
SELECT name, city
FROM users
WHERE city IS NOT NULL;

-- Hämta användare från Stockholm som heter Anna
SELECT name, email, city
FROM users
WHERE city = 'Stockholm' AND name = 'Anna';
```

### Sortera Resultat (`ORDER BY`)

`ORDER BY` används för att sortera resultatet baserat på en eller flera kolumner.

```sql
-- Hämta alla användare sorterade efter namn i bokstavsordning (stigande, ASC är default)
SELECT name, email
FROM users
ORDER BY name ASC; -- ASC kan utelämnas

-- Hämta alla användare sorterade efter id i fallande ordning (högst id först)
SELECT id, name
FROM users
ORDER BY id DESC;

-- Sortera först på stad, sedan på namn inom varje stad
SELECT name, city
FROM users
ORDER BY city, name;
```

### Begränsa Antal Rader (`LIMIT`)

`LIMIT` används för att begränsa antalet rader som returneras. Används ofta för paginering (att visa data sida för sida).

```sql
-- Hämta de 5 första användarna (baserat på default ordning eller ORDER BY)
SELECT id, name
FROM users
ORDER BY id
LIMIT 5;

-- Hämta 10 användare, men hoppa över de första 20 (används för paginering, sida 3 om 10 per sida)
-- LIMIT offset, count
SELECT id, name
FROM users
ORDER BY id
LIMIT 20, 10;
```

## Lägga till Data (`INSERT INTO`)

`INSERT INTO` används för att lägga till nya rader i en tabell.

```sql
-- Lägg till en ny användare, specificera kolumner
INSERT INTO users (name, email, city)
VALUES ('Kalle Anka', 'kalle@example.com', 'Ankeborg');

-- Lägg till en ny användare utan stad (om 'city' tillåter NULL)
INSERT INTO users (name, email)
VALUES ('Musse Pigg', 'musse@example.com');

-- Lägg till flera användare samtidigt (syntax kan variera lite)
INSERT INTO users (name, email, city)
VALUES
    ('Långben', 'langben@example.com', 'Ankeborg'),
    ('Joakim von Anka', 'joakim@example.com', NULL);
```

*Not:* Om du har en `AUTO_INCREMENT`-kolumn (som `id` i vårt exempel) behöver du inte (och ska oftast inte) ange den i `INSERT`-satsen. Databasen sköter det automatiskt.

## Uppdatera Data (`UPDATE`)

`UPDATE` används för att ändra data i befintliga rader.

```sql
-- Uppdatera staden för användaren med id 5
UPDATE users
SET city = 'Göteborg'
WHERE id = 5;

-- Uppdatera både namn och e-post för användaren med id 10
UPDATE users
SET name = 'Kajsa Anka', email = 'kajsa.anka@example.com'
WHERE id = 10;

-- Uppdatera ALLA användare (MYCKET FARLIGT UTAN WHERE!)
-- UPDATE users SET city = 'Okänd stad'; -- Gör INTE detta utan att vara säker!
```

**VARNING:** `WHERE`-klausulen i `UPDATE` är extremt viktig. Utan den kommer **alla** rader i tabellen att uppdateras!

## Ta bort Data (`DELETE`)

`DELETE` används för att ta bort rader från en tabell.

```sql
-- Ta bort användaren med id 15
DELETE FROM users
WHERE id = 15;

-- Ta bort alla användare från Ankeborg
DELETE FROM users
WHERE city = 'Ankeborg';

-- Ta bort ALLA användare (MYCKET FARLIGT UTAN WHERE!)
-- DELETE FROM users; -- Gör INTE detta utan att vara säker!
```

**VARNING:** Precis som med `UPDATE`, är `WHERE`-klausulen i `DELETE` kritisk. Utan den raderas **alla** rader i tabellen!

## Sammanfogning av Tabeller (`JOIN`)

Ofta är den data vi behöver spridd över flera relaterade tabeller. Till exempel kanske vi har en `users`-tabell och en `orders`-tabell, där `orders`-tabellen innehåller en referens till användaren som lade ordern.

För att kombinera data från flera tabeller i en enda fråga använder vi `JOIN`.

Låt oss anta att vi har tabellerna:

**`users`**
| id | name    |
|----|---------|
| 1  | Alice   |
| 2  | Bob     |
| 3  | Charlie |

**`orders`**
| order_id | user_id | product  |
|----------|---------|----------|
| 101      | 1       | Laptop   |
| 102      | 2       | Keyboard |
| 103      | 1       | Mouse    |
| 104      | 4       | Monitor  |

Observera att `orders.user_id` refererar till `users.id`. Användare med id `3` har inga ordrar, och order `104` tillhör en användare (`4`) som inte finns i `users`-tabellen (i detta exempel).

### `INNER JOIN`

Den vanligaste typen är `INNER JOIN`. Den returnerar endast rader där det finns en matchning i **båda** tabellerna baserat på `JOIN`-villkoret.

```sql
SELECT
    users.name,      -- Hämta användarens namn
    orders.product   -- Hämta produktnamnet från ordern
FROM
    users            -- Börja med users-tabellen
INNER JOIN
    orders           -- Koppla ihop med orders-tabellen
ON
    users.id = orders.user_id; -- Villkoret för kopplingen
```

**Resultat:**

| name  | product  |
|-------|----------|
| Alice | Laptop   |
| Bob   | Keyboard |
| Alice | Mouse    |

*   Alice (id 1) finns i båda tabellerna via `user_id` 1 i `orders` (två gånger).
*   Bob (id 2) finns i båda tabellerna via `user_id` 2 i `orders`.
*   Charlie (id 3) finns bara i `users`, så han inkluderas inte.
*   Order 104 (user_id 4) har ingen matchande användare i `users`, så den inkluderas inte.

**Visualisering av `INNER JOIN`:**

```mermaid
graph LR
    subgraph Users Table
        U1["id: 1<br>name: 'Alice'"]
        U2["id: 2<br>name: 'Bob'"]
        U3["id: 3<br>name: 'Charlie'"]
    end
    subgraph Orders Table
        O1["id: 101<br>user_id: 1<br>product: 'Laptop'"]
        O2["id: 102<br>user_id: 2<br>product: 'Keyboard'"]
        O3["id: 103<br>user_id: 1<br>product: 'Mouse'"]
        O4["id: 104<br>user_id: 4<br>product: 'Monitor'"]
    end
    subgraph INNER JOIN Result (on users.id = orders.user_id)
        R1["user.name: 'Alice'<br>order.product: 'Laptop'"]
        R2["user.name: 'Bob'<br>order.product: 'Keyboard'"]
        R3["user.name: 'Alice'<br>order.product: 'Mouse'"]
    end

    U1 -- "match" --> R1
    U1 -- "match" --> R3
    U2 -- "match" --> R2
    O1 -- "match" --> R1
    O2 -- "match" --> R2
    O3 -- "match" --> R3

    style U3 fill:#f9f,stroke:#333,stroke-width:2px
    style O4 fill:#f9f,stroke:#333,stroke-width:2px
```
(De rosa noderna representerar rader som inte inkluderas i `INNER JOIN`-resultatet.)

### Andra `JOIN`-typer (Kort)

*   `LEFT JOIN`: Returnerar alla rader från den *vänstra* tabellen (`users` i exemplet ovan) och matchande rader från den högra (`orders`). Om ingen matchning finns i den högra tabellen, fylls dess kolumner ut med `NULL`. (Charlie skulle komma med, men med `NULL` i produktkolumnen).
*   `RIGHT JOIN`: Motsatsen till `LEFT JOIN`. Returnerar alla rader från den *högra* tabellen och matchande från vänstra. (Order 104 skulle komma med, men med `NULL` i namnkolumnen).
*   `FULL OUTER JOIN`: Returnerar alla rader från båda tabellerna. Om matchning saknas fylls kolumnerna från den andra tabellen ut med `NULL`. (Stöds inte direkt av MySQL/MariaDB, men kan simuleras).

## SQL och PHP (Förhandstitt)

Nu när du har en grundläggande förståelse för SQL-satser är nästa steg att se hur vi kan exekvera dessa från vår PHP-kod. PHP erbjuder olika sätt att ansluta till och interagera med databaser som MariaDB/MySQL:

1.  **PDO (PHP Data Objects):** Ett databasabstraktionslager som ger ett konsekvent gränssnitt för att arbeta med olika databastyper.
2.  **MySQLi (MySQL Improved Extension):** En specifik extension för att arbeta med MySQL och MariaDB.

_Vi kommer jobba främst med PDO._

I de kommande avsnittet `crud-app.md` kommer vi att dyka djupare in i hur man använder PDO för att:

*   Ansluta till databasen från PHP.
*   Skicka SQL-frågor (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) till databasen.
*   Hantera resultaten från `SELECT`-frågor.
*   Skydda sig mot **SQL Injection** (SQL-injektion), en allvarlig säkerhetsrisk, med hjälp av **Prepared Statements** (förberedda uttryck).

Att kunna SQL är en grundläggande färdighet för fullstack-utveckling, eftersom det låter dig interagera med den data som driver din applikation.

