# Kapitel 7: Praktiska Övningar

Dessa övningar är tänkta att hjälpa dig att befästa kunskaperna från kapitel 7. Försök att lösa dem själv först innan du tittar på lösningsförslagen.

---

## PHP Introduktion och Utvecklingsmiljö

### Övning 1: PHP vs JavaScript – var körs koden?

Beskriv kort: Var körs PHP-kod respektive JavaScript-kod (i webbläsaren) när en användare besöker en webbplats? Vilken typ av data är lämplig att hantera i PHP jämfört med JavaScript?

<details>
<summary>Lösningsförslag</summary>

**PHP** körs på **webbservern**. Den används för att hantera data, interagera med databaser, hantera sessioner och generera HTML innan det skickas till webbläsaren. Användaren ser aldrig PHP-koden.

**JavaScript** (i webbläsaren) körs på **klienten** (användarens dator). Den används för att göra sidor interaktiva, manipulera DOM, validera formulär och göra asynkrona anrop.

**Lämplig data:** PHP hanterar känslig data (lösenord, databasfrågor, sessionsdata). JavaScript hanterar användarinteraktioner och presentation på klientsidan.

**Förklaring:** Detta är grundläggande för att förstå fullstack-utveckling. PHP är ett serverspråk – all kod exekveras innan HTML skickas till användaren. JavaScript kan köras både på klienten (traditionellt) och på servern (Node.js).
</details>

---

### Övning 2: Docker Compose – PHP och MySQL

Vilka tjänster (services) behövs typiskt i en `docker-compose.yml` för att köra en PHP-webbapplikation med databas? Nämn minst tre och beskriv kort vad varje tjänst gör.

<details>
<summary>Lösningsförslag</summary>

1. **php** (eller webbserver + PHP): Kör PHP-tolken och webbservern (t.ex. Apache). Bearbetar `.php`-filer och serverar statiska filer.
2. **mysql** (eller mariadb): Databasservern som lagrar applikationens data.
3. **phpmyadmin** (valfritt): Webbgränssnitt för att administrera databasen under utveckling.

**Förklaring:** En typisk LAMP/LEMP-stack för PHP består av webbserver, PHP-tolk och databas. Docker Compose låter dig definiera dessa som separata tjänster som kan kommunicera med varandra.
</details>

---

## PHP Syntax och Grundläggande

### Övning 3: Hej Världen

Skriv ett PHP-skript som skriver ut texten "Hej Världen!" till webbläsaren.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
echo "Hej Världen!";
?>
```

eller med kort echo-tagg:

```php
<?= "Hej Världen!"; ?>
```

**Förklaring:** `echo` är den vanligaste funktionen för att skriva ut data. Den korta taggen `<?=` är en genväg för `<?php echo ... ?>` och används ofta för att skriva ut enstaka variabler eller uttryck i HTML.
</details>

---

### Övning 4: Variabler och Utskrift

Deklarera en variabel `$productName` med värdet "Laptop" och en variabel `$productPrice` med värdet `999.90`. Skriv ut en mening som "Produkten Laptop kostar 999.9 kr." med hjälp av dessa variabler och strängkonkatenering (`.`).

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$productName = "Laptop";
$productPrice = 999.90;
echo "Produkten " . $productName . " kostar " . $productPrice . " kr.";
?>
```

Alternativt med variabelinterpolering i dubbla citationstecken:

```php
echo "Produkten $productName kostar $productPrice kr.";
```

**Förklaring:** I PHP används `.` (punkt) för strängkonkatenering, till skillnad från JavaScript som använder `+`. Dubbla citationstecken tillåter variabelinterpolering – variablerna ersätts med sina värden direkt i strängen.
</details>

---

### Övning 5: if/else

Skriv en `if/else`-sats som kollar om variabeln `$productPrice` (från övning 4) är större än 500. Om den är det, skriv ut "Dyr produkt.", annars skriv ut "Billig produkt.".

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$productPrice = 999.90;
if ($productPrice > 500) {
    echo "Dyr produkt.";
} else {
    echo "Billig produkt.";
}
?>
```

**Förklaring:** PHP:s `if/else` fungerar som i de flesta språk. Jämförelseoperatorn `>` returnerar `true` eller `false`. Använd `===` för strikt jämförelse när du jämför värden som kan ha olika typer.
</details>

---

### Övning 6: Funktion med Type Hinting

Skapa en funktion `calculateDiscount($price, $percentage)` som tar ett pris och en procentsats (som heltal, t.ex. 10 för 10%) och returnerar det nya priset efter rabatten. Använd type hinting för parametrarna (`float` för pris, `int` för procent) och returvärdet (`float`).

<details>
<summary>Lösningsförslag</summary>

```php
<?php
declare(strict_types=1);
function calculateDiscount(float $price, int $percentage): float {
    if ($percentage < 0 || $percentage > 100) {
        throw new InvalidArgumentException('$percentage måste vara mellan 0-100');
    }
    $discountFactor = 1 - ($percentage / 100.0);
    return $price * $discountFactor;
}
?>
```

**Förklaring:** Type hinting gör koden tydligare och fångar fel tidigare. `declare(strict_types=1)` aktiverar strikt typläge. Rabatten beräknas genom att multiplicera priset med `(1 - procent/100)` – t.ex. 20% rabatt ger faktor 0.8.
</details>

---

### Övning 7: Anropa Funktion

Anropa funktionen `calculateDiscount` med priset `250.0` och procentsatsen `20`. Skriv ut resultatet.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$discountedPrice = calculateDiscount(250.0, 20);
echo "Pris efter 20% rabatt: " . $discountedPrice; // Output: Pris efter 20% rabatt: 200
?>
```

**Förklaring:** 250 * 0.8 = 200. Funktionen returnerar ett värde som kan lagras i en variabel eller skrivas ut direkt.
</details>

---

### Övning 8: match-uttryck

Skriv ett `match`-uttryck som tar en variabel `$statusCode` (anta att den innehåller ett heltal som 200, 404, eller 500) och returnerar en beskrivande sträng ("OK", "Not Found", "Server Error", eller "Unknown" för andra värden). Skriv ut den returnerade strängen.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$statusCode = 404;
$message = match ($statusCode) {
    200 => "OK",
    404 => "Not Found",
    500 => "Server Error",
    default => "Unknown",
};
echo "Status: " . $message; // Output: Status: Not Found
?>
```

**Förklaring:** `match` (PHP 8+) är ett uttryck som returnerar ett värde, till skillnad från `switch` som är en sats. Det använder strikt jämförelse (`===`) och kräver ett `default`-fall. Inga `break` behövs – det "faller inte igenom".
</details>

---

### Övning 9: Strikta Typer

Hur aktiverar du strikt typläge i en PHP-fil, och varför är det rekommenderat?

<details>
<summary>Lösningsförslag</summary>

Strikt typläge aktiveras med `declare(strict_types=1);` överst i PHP-filen (efter `<?php`-taggen).

**Varför rekommenderas det:** PHP försöker annars tvångsomvandla (coerce) datatyper vid funktionsanrop – t.ex. acceptera strängen `"10"` för en `int`-parameter. Detta kan dölja fel. Med strikta typer fångas typfel tidigt, koden blir mer förutsägbar och robust.

**Förklaring:** Strikta typer är särskilt viktigt när du använder type hinting. Utan det kan oväntade värden passera igenom och orsaka svårupptäckta buggar.
</details>

---

### Övning 10: Konstanter och Null Coalescing

Skapa en konstant `MAX_LOGIN_ATTEMPTS` med värdet 5. Skriv sedan kod som hämtar värdet från `$_GET['page']` – om det inte finns eller är null, använd defaultvärdet `"hem"`. Använd null coalescing-operatorn (`??`).

<details>
<summary>Lösningsförslag</summary>

```php
<?php
const MAX_LOGIN_ATTEMPTS = 5;

$page = $_GET['page'] ?? 'hem';
echo "Aktuell sida: " . $page;
?>
```

**Förklaring:** `const` definierar en konstant (utan `$`). Operatorn `??` returnerar vänster operand om den existerar och inte är `null`, annars höger operand. Det är säkrare än `isset() ? ... : ...` för att hantera superglobala variabler som kanske inte är satta.
</details>

---

## Arrayer och Loopar

### Övning 11: Indexerad Array

Skapa en indexerad array `$cities` som innehåller strängarna "Stockholm", "Göteborg", "Malmö".

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$cities = ["Stockholm", "Göteborg", "Malmö"];
// Eller äldre syntax: $cities = array("Stockholm", "Göteborg", "Malmö");
?>
```

**Förklaring:** Den korta array-syntaxen `[]` har varit standard sedan PHP 5.4. Indexerade arrayer har numeriska nycklar som börjar på 0.
</details>

---

### Övning 12: Åtkomst och Lägg till

Skriv ut den första staden från `$cities`. Lägg sedan till staden "Uppsala" i slutet av arrayen.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$cities = ["Stockholm", "Göteborg", "Malmö"];
echo $cities[0]; // Output: Stockholm
$cities[] = "Uppsala"; // Lägger till i slutet
?>
```

**Förklaring:** `$array[0]` ger första elementet. `$array[] = value` lägger till ett nytt element i slutet – PHP tilldelar automatiskt nästa tillgängliga index.
</details>

---

### Övning 13: Associativ Array

Skapa en associativ array `$car` med nycklarna `brand` (värde "Volvo") och `model` (värde "XC60"). Skriv ut bilens modell.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$car = [
    'brand' => 'Volvo',
    'model' => 'XC60'
];
echo $car['model']; // Output: XC60
?>
```

**Förklaring:** Associativa arrayer använder strängnycklar istället för numeriska index. Syntaxen `nyckel => värde` kopplar ihop dem. De liknar JavaScript-objekt men är fortfarande av typen `array` i PHP.
</details>

---

### Övning 14: foreach – Värden och Nyckel & Värde

Använd `foreach` för att skriva ut varje stad från `$cities` på en ny rad. Använd sedan `foreach` för att skriva ut både nyckel och värde från `$car`-arrayen, t.ex. "brand: Volvo".

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$cities = ["Stockholm", "Göteborg", "Malmö", "Uppsala"];
foreach ($cities as $city) {
    echo $city . "\n";
}

$car = ['brand' => 'Volvo', 'model' => 'XC60'];
foreach ($car as $key => $value) {
    echo $key . ": " . $value . "\n";
}
?>
```

**Förklaring:** `foreach ($array as $value)` itererar över värdena. `foreach ($array as $key => $value)` ger tillgång till både nyckel och värde. Använd `<br>` istället för `\n` om output visas i webbläsaren.
</details>

---

### Övning 15: in_array och implode

Kontrollera om staden "Malmö" finns i `$cities` och skriv ut "Ja" eller "Nej". Skapa sedan en sträng från `$cities` där städerna är separerade med kommatecken och mellanslag.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$cities = ["Stockholm", "Göteborg", "Malmö", "Uppsala"];
if (in_array("Malmö", $cities)) {
    echo "Ja";
} else {
    echo "Nej";
}

$cityString = implode(", ", $cities);
echo "\n" . $cityString; // Stockholm, Göteborg, Malmö, Uppsala
?>
```

**Förklaring:** `in_array($needle, $haystack)` returnerar `true` om värdet finns. `implode($glue, $array)` fogar ihop arrayelement till en sträng med angiven avgränsare – motsvarar `join()` i JavaScript.
</details>

---

### Övning 16: explode och array-funktioner

Skapa en sträng `"äpple,banan,päron"` och använd `explode()` för att dela upp den till en array. Sortera sedan arrayen med `sort()` och skriv ut den med `implode()`.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$fruitString = "äpple,banan,päron";
$fruits = explode(",", $fruitString);
sort($fruits);
echo implode(", ", $fruits); // äpple, banan, päron
?>
```

**Förklaring:** `explode($delimiter, $string)` delar en sträng till en array – motsvarar `split()` i JavaScript. `sort()` modifierar arrayen på plats och sorterar i stigande ordning. Observera att `sort()` återställer numeriska nycklar (0, 1, 2...).
</details>

---

### Övning 17: array_keys och array_values

Skapa en associativ array `$user` med `name`, `email` och `city`. Använd `array_keys()` och `array_values()` för att hämta respektive nycklar och värden som separata arrayer. Skriv ut dem med `print_r()`.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$user = ['name' => 'Anna', 'email' => 'anna@example.com', 'city' => 'Stockholm'];
$keys = array_keys($user);
$values = array_values($user);
print_r($keys);   // Array ( [0] => name [1] => email [2] => city )
print_r($values); // Array ( [0] => Anna [1] => anna@example.com [2] => Stockholm )
?>
```

**Förklaring:** `array_keys()` returnerar alla nycklar som en indexerad array. `array_values()` returnerar alla värden och skapar nya numeriska index. Användbart när du behöver iterera över endast nycklar eller värden, eller konvertera till indexerad array.
</details>

---

## Funktionell PHP

### Övning 18: array_map

Använd `array_map` för att transformera arrayen `$prices = [100, 200, 300]` till en ny array där varje pris har lagts till med 25% moms. Använd en anonym funktion eller arrow-funktion.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$prices = [100, 200, 300];
$withTax = array_map(fn($price) => $price * 1.25, $prices);
// [125, 250, 375]

// Eller med anonym funktion:
$withTax = array_map(function($price) {
    return $price * 1.25;
}, $prices);
?>
```

**Förklaring:** `array_map` applicerar en callback på varje element och returnerar en ny array. Arrow-funktionen `fn($x) => uttryck` är koncis för enkla transformationer. Originalarrayen förändras inte.
</details>

---

### Övning 19: array_filter

Använd `array_filter` för att från arrayen `$numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]` plocka ut endast de jämna talen.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
$evens = array_filter($numbers, fn($n) => $n % 2 === 0);
// [2, 4, 6, 8, 10] – nycklarna 1, 3, 5, 7, 9 behålls

// Om du vill ha indexerade nycklar:
$evens = array_values(array_filter($numbers, fn($n) => $n % 2 === 0));
?>
```

**Förklaring:** `array_filter` behåller element där callback returnerar `true`. `array_values()` återställer numeriska index om du behöver en "ren" indexerad array.
</details>

---

### Övning 20: array_reduce

Använd `array_reduce` för att beräkna summan av alla tal i `$numbers = [10, 20, 30, 40]`. Använd sedan `array_reduce` för att bygga en sträng av alla tal separerade med " + " (t.ex. "10 + 20 + 30 + 40").

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$numbers = [10, 20, 30, 40];

$sum = array_reduce($numbers, fn($carry, $n) => $carry + $n, 0);
// 100

$expression = array_reduce($numbers, fn($carry, $n) => $carry === '' ? $n : $carry . ' + ' . $n, '');
// "10 + 20 + 30 + 40"
?>
```

**Förklaring:** `array_reduce` tar en callback med två argument: `$carry` (ackumulatorn) och `$item` (aktuellt element). Det tredje argumentet är startvärdet. För strängen används tom sträng som start och första elementet läggs till direkt, sedan " + " + nästa.
</details>

---

### Övning 21: Closure och use

Skapa en funktion `makeMultiplier($factor)` som returnerar en anonym funktion. Den returnerade funktionen ska ta ett tal och returnera det multiplicerat med `$factor`. Använd `use` för att fånga `$factor`. Testa med `$double = makeMultiplier(2)` och `$triple = makeMultiplier(3)`.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
function makeMultiplier(int $factor): callable {
    return function($x) use ($factor) {
        return $x * $factor;
    };
}

$double = makeMultiplier(2);
$triple = makeMultiplier(3);

echo $double(5);  // 10
echo $triple(5);  // 15
?>
```

**Förklaring:** `use ($factor)` fångar variabeln från den omgivande scope:n när den anonyma funktionen skapas. Varje anrop till `makeMultiplier` skapar en ny closure med sitt eget "minne" av `$factor`. Detta kallas en "factory"-funktion.
</details>

---

### Övning 22: Pipeline – filter, map, reduce

Du har en array med produkter: `$products = [['name' => 'A', 'price' => 100], ['name' => 'B', 'price' => 50], ['name' => 'C', 'price' => 200]]`. Skriv en pipeline som: (1) filtrerar bort produkter med pris under 75, (2) plockar ut endast namnen, (3) reducerar till en kommaseparerad sträng. Resultatet ska bli `"A, C"`.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$products = [
    ['name' => 'A', 'price' => 100],
    ['name' => 'B', 'price' => 50],
    ['name' => 'C', 'price' => 200],
];

$filtered = array_filter($products, fn($p) => $p['price'] >= 75);
$names = array_map(fn($p) => $p['name'], $filtered);
$result = array_reduce($names, fn($c, $n) => $c === '' ? $n : $c . ', ' . $n, '');

echo $result; // "A, C"
?>
```

**Förklaring:** Varje steg returnerar en ny array (eller sträng) – originalet förändras inte. Detta är typiskt funktionell programmering: små, fokuserade operationer kedjade ihop. B (pris 50) filtreras bort, kvar blir A och C.
</details>

---

## SQL (Syntax)

Anta att du har en tabell `customers` med kolumnerna `id` (INT, PK), `name` (VARCHAR), `email` (VARCHAR), `city` (VARCHAR) och en tabell `orders` med kolumnerna `order_id` (INT, PK), `customer_id` (INT, FK till customers.id), `order_date` (DATE), `amount` (DECIMAL).

### Övning 23: SELECT och WHERE

Skriv SQL för att hämta alla kolumner för alla kunder. Skriv sedan SQL för att hämta `name` och `email` för kunder som bor i "Göteborg".

<details>
<summary>Lösningsförslag</summary>

```sql
SELECT * FROM customers;
```

```sql
SELECT name, email FROM customers WHERE city = 'Göteborg';
```

**Förklaring:** `SELECT *` hämtar alla kolumner. `WHERE` filtrerar rader – endast de som uppfyller villkoret inkluderas. Strängvärden omges av enkla citationstecken.
</details>

---

### Övning 24: ORDER BY och LIMIT

Skriv SQL för att hämta namnen på de 10 första kunderna sorterade i bokstavsordning (A-Ö).

<details>
<summary>Lösningsförslag</summary>

```sql
SELECT name FROM customers ORDER BY name ASC LIMIT 10;
```

**Förklaring:** `ORDER BY name ASC` sorterar stigande (A-Ö). `ASC` kan utelämnas då det är default. `LIMIT 10` begränsar resultatet till 10 rader – användbart för paginering.
</details>

---

### Övning 25: INSERT, UPDATE, DELETE

Skriv SQL för att: (a) lägga till en ny kund med namn "Lisa Berg" och e-post "lisa@example.com" som bor i "Malmö", (b) ändra staden till "Lund" för kunden med `id` 15, (c) ta bort kunden med `id` 20.

<details>
<summary>Lösningsförslag</summary>

```sql
INSERT INTO customers (name, email, city) VALUES ('Lisa Berg', 'lisa@example.com', 'Malmö');
```

```sql
UPDATE customers SET city = 'Lund' WHERE id = 15;
```

```sql
DELETE FROM customers WHERE id = 20;
```

**Förklaring:** `INSERT` anger kolumner och värden. `UPDATE` och `DELETE` **måste** ha en `WHERE`-klausul – annars påverkas alla rader! `WHERE id = 15` säkerställer att endast en specifik rad ändras.
</details>

---

### Övning 26: INNER JOIN

Skriv SQL för att hämta order-ID (`orders.order_id`) och kundens namn (`customers.name`) för alla ordrar.

<details>
<summary>Lösningsförslag</summary>

```sql
SELECT orders.order_id, customers.name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;
```

**Förklaring:** `INNER JOIN` kopplar ihop tabeller baserat på ett villkor. Endast rader med matchande värden i båda tabellerna inkluderas. `ON` anger vilka kolumner som ska matchas – här kopplar vi `customer_id` i orders till `id` i customers.
</details>

---

### Övning 27: CREATE TABLE och ALTER TABLE

Skriv SQL för att skapa en tabell `products` med kolumnerna `id` (INT, AUTO_INCREMENT, PRIMARY KEY), `name` (VARCHAR 100, NOT NULL) och `price` (DECIMAL 10,2). Lägg sedan till en kolumn `stock` (INT) till tabellen.

<details>
<summary>Lösningsförslag</summary>

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2)
);
```

```sql
ALTER TABLE products ADD COLUMN stock INT;
```

**Förklaring:** `CREATE TABLE` definierar tabellstrukturen. `AUTO_INCREMENT` låter databasen generera unika ID automatiskt. `ALTER TABLE ADD COLUMN` lägger till en ny kolumn i en befintlig tabell.
</details>

---

### Övning 28: LIKE och NULL

Skriv SQL för att hämta kunder vars namn börjar med "Anders". Skriv sedan SQL för att hämta kunder där `city` inte är angiven (är NULL).

<details>
<summary>Lösningsförslag</summary>

```sql
SELECT * FROM customers WHERE name LIKE 'Anders%';
```

```sql
SELECT * FROM customers WHERE city IS NULL;
```

**Förklaring:** `LIKE` används för mönstermatchning. `%` matchar noll eller flera tecken. `Anders%` matchar "Andersson", "Anders" etc. För NULL använd `IS NULL` eller `IS NOT NULL` – inte `= NULL`.
</details>

---

## Sessioner och Säkerhet

### Övning 29: Starta Session och Lagra Data

Vilken PHP-funktion används för att starta en session, och var bör den placeras? Skriv sedan kod för att lagra värdet "dark" i sessionsvariabeln `theme`.

<details>
<summary>Lösningsförslag</summary>

Funktionen är `session_start()`. Den måste anropas **innan** någon output (HTML, echo, mellanslag) skickas – typiskt allra högst upp i skriptet.

```php
<?php
session_start();
$_SESSION['theme'] = 'dark';
?>
```

**Förklaring:** `session_start()` återupptar en befintlig session eller skapar en ny. Den måste anropas först eftersom den skickar HTTP-headers. `$_SESSION` är en superglobal array där sessionsdata lagras.
</details>

---

### Övning 30: Kontrollera Session

Skriv en `if`-sats i PHP som kontrollerar om sessionsvariabeln `user_id` är satt. Om den är satt, skriv "Inloggad", annars skriv "Ej inloggad".

<details>
<summary>Lösningsförslag</summary>

```php
<?php
session_start();
if (isset($_SESSION['user_id'])) {
    echo "Inloggad";
} else {
    echo "Ej inloggad";
}
?>
```

**Förklaring:** `isset()` returnerar `true` om variabeln existerar och inte är `null`. Det är standardmetoden för att kontrollera om en sessionsvariabel är satt innan man använder den.
</details>

---

### Övning 31: Cookies – Sätt och Läs

Skriv PHP-kod för att sätta en cookie `language` med värdet `sv` som är giltig i 7 dagar. Skriv sedan kod för att läsa cookien och skriva ut värdet (om den finns).

<details>
<summary>Lösningsförslag</summary>

```php
<?php
// Sätt cookie – måste vara innan output!
$expiry = time() + (86400 * 7); // 7 dagar
setcookie('language', 'sv', $expiry, '/');

// Läsa cookie
if (isset($_COOKIE['language'])) {
    echo "Språk: " . htmlspecialchars($_COOKIE['language']);
} else {
    echo "Ingen språkpreferens sparad.";
}
?>
```

**Förklaring:** `setcookie()` tar namn, värde och utgångstid (Unix timestamp). `time() + 86400*7` = nu + 7 dagar. `$_COOKIE` innehåller cookies som webbläsaren skickat. `setcookie()` måste anropas före all output.
</details>

---

### Övning 32: XSS-skydd

Vilken PHP-funktion bör du alltid använda när du skriver ut data som kan ha kommit från en användare i HTML? Ge ett exempel.

<details>
<summary>Lösningsförslag</summary>

Funktionen är `htmlspecialchars()`. Exempel:

```php
<?php
$userInput = "<script>alert('hack');</script>";
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');
// Output: &lt;script&gt;alert(&#039;hack&#039;);&lt;/script&gt;
?>
```

**Förklaring:** `htmlspecialchars()` konverterar `<`, `>`, `"`, `'` och `&` till HTML-entiteter så att de visas som text istället för att tolkas som HTML/JavaScript. `ENT_QUOTES` hanterar citationstecken. Detta skyddar mot XSS-attacker.
</details>

---

### Övning 33: SQL Injection-skydd

Vilken teknik ska du alltid använda när du bygger SQL-frågor med användarinput? Nämn den PHP/PDO-metod som initierar denna teknik.

<details>
<summary>Lösningsförslag</summary>

Tekniken är **Prepared Statements**. I PDO används `$pdo->prepare("SQL med :placeholders")` för att förbereda frågan. Parametrar bindas sedan med `bindParam()` eller skickas till `execute()`.

**Förklaring:** Prepared statements separerar SQL-strukturen från data. Databasen behandlar parametervärden som data, inte som SQL-kod – vilket förhindrar att angripare kan injicera skadlig SQL via formulärfält eller URL-parametrar.
</details>

---

### Övning 34: Lösenordshantering

Vilka två PHP-funktioner är standard för säker lösenordshantering? Vad gör var och en?

<details>
<summary>Lösningsförslag</summary>

- **`password_hash($password, PASSWORD_DEFAULT)`**: Skapar en stark, saltad hash av lösenordet. Använd vid registrering – spara hashen i databasen, aldrig lösenordet i klartext.

- **`password_verify($password, $hash)`**: Jämför ett inskickat lösenord med en lagrad hash på ett säkert sätt. Använd vid inloggning – returnerar `true` om lösenordet matchar.

**Förklaring:** `password_hash()` genererar automatiskt ett unikt salt och använder Bcrypt (eller bästa tillgängliga algoritm). `password_verify()` extraherar saltet från hashen och jämför säkert. Använd aldrig MD5 eller SHA1 för lösenord!
</details>

---

### Övning 35: CSRF-skydd

Beskriv kort hur anti-CSRF tokens (Synchronizer Token Pattern) fungerar för att skydda formulär.

<details>
<summary>Lösningsförslag</summary>

1. **Generera token**: Servern skapar en unik, slumpmässig token (t.ex. med `bin2hex(random_bytes(32))`).
2. **Lagra i session**: `$_SESSION['csrf_token'] = $token`
3. **Inkludera i formulär**: Ett dolt fält `<input type="hidden" name="csrf_token" value="...">`
4. **Vid POST**: Jämför `$_POST['csrf_token']` med `$_SESSION['csrf_token']` innan åtgärden utförs.
5. **Verifiera**: Använd `hash_equals($session_token, $submitted_token)` för säker jämförelse.

**Förklaring:** En angripare på en annan webbplats kan inte läsa eller gissa token eftersom den finns i användarens session. Därför kan de inte skicka en giltig token med en förfalskad förfrågan.
</details>

---

### Övning 36: Utloggning

Skriv PHP-kod för att logga ut en användare: töm sessionsvariablerna, ta bort session-cookien och förstör sessionen. Inkludera nödvändiga steg.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
session_start();

// 1. Töm sessionsvariabler
$_SESSION = [];

// 2. Ta bort session-cookien
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Förstör sessionen på servern
session_destroy();

header('Location: login.php');
exit;
?>
```

**Förklaring:** Alla tre steg behövs för fullständig utloggning. `session_destroy()` tar bort sessionfilen på servern men påverkar inte `$_SESSION` eller cookien – därför måste vi tömma och ta bort cookien manuellt. Omdirigering förhindrar att användaren stannar på utloggningssidan.
</details>

---

## PDO och Mini-CRUD

Anta att du har en PDO-anslutning i variabeln `$pdo` och en `tasks`-tabell med kolumnerna `id` (INT, PK, AUTO_INCREMENT) och `description` (TEXT).

### Övning 37: Hämta Input och INSERT

Skriv PHP-koden för att säkert hämta värdet från ett formulärfält med `name="task_description"` som skickats via POST. Skriv sedan kod som använder prepared statements för att infoga värdet i `tasks`-tabellens `description`-kolumn.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$description = trim($_POST['task_description'] ?? '');

if (!empty($description)) {
    try {
        $sql = "INSERT INTO tasks (description) VALUES (:desc)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':desc', $description, PDO::PARAM_STR);
        $stmt->execute();
        echo "Uppgift tillagd!";
    } catch (PDOException $e) {
        error_log("Insert Error: " . $e->getMessage());
        echo "Kunde inte lägga till uppgift.";
    }
}
?>
```

**Förklaring:** `$_POST['task_description'] ?? ''` använder null coalescing för att undvika "undefined index"-varningar. `trim()` tar bort onödiga mellanslag. Prepared statements med `:desc`-platshållare skyddar mot SQL injection.
</details>

---

### Övning 38: SELECT och fetchAll

Skriv PHP-koden som använder `$pdo` för att hämta alla rader från `tasks`-tabellen (endast `id` och `description`) och lagra resultatet i en array `$allTasks`.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$allTasks = [];
try {
    $sql = "SELECT id, description FROM tasks ORDER BY id";
    $stmt = $pdo->query($sql);
    $allTasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    error_log("Fetch Error: " . $e->getMessage());
}
?>
```

**Förklaring:** `query()` används för frågor utan användarinput – prepared statements behövs inte här. `fetchAll()` hämtar alla rader som en array av associativa arrayer. `PDO::FETCH_ASSOC` ger nycklar som kolumnnamn.
</details>

---

### Övning 39: UPDATE och DELETE med PDO

Skriv PHP-kod som uppdaterar `description` för uppgiften med `id` som kommer från `$_GET['id']`. Validera ID:t först. Skriv sedan kod för att radera uppgiften med det validerade ID:t.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) {
    die("Ogiltigt ID");
}

// UPDATE
$description = "Ny beskrivning";
$stmt = $pdo->prepare("UPDATE tasks SET description = :desc WHERE id = :id");
$stmt->bindParam(':desc', $description, PDO::PARAM_STR);
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$stmt->execute();

// DELETE
$stmt = $pdo->prepare("DELETE FROM tasks WHERE id = :id");
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$stmt->execute();
?>
```

**Förklaring:** `filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT)` validerar att ID är ett heltal – returnerar `false` för ogiltig input. Både UPDATE och DELETE använder prepared statements med namngivna platshållare. `WHERE id = :id` säkerställer att endast en specifik rad påverkas.
</details>

---

### Övning 40: PDO-anslutning

Skriv en funktion `connect_db()` som returnerar en PDO-anslutning till databasen `db_fullstack` på `mysql` med användare `db_user` och lösenord `db_password`. Sätt `ERRMODE_EXCEPTION` och `FETCH_ASSOC` som default. Hantera fel med try/catch.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
function connect_db(): PDO {
    $dsn = "mysql:host=mysql;dbname=db_fullstack;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    try {
        return new PDO($dsn, 'db_user', 'db_password', $options);
    } catch (PDOException $e) {
        throw new PDOException("Kunde inte ansluta: " . $e->getMessage(), (int) $e->getCode());
    }
}
?>
```

**Förklaring:** DSN (Data Source Name) anger värd, databas och teckenkodning. `ERRMODE_EXCEPTION` gör att PDO kastar undantag vid fel. `FETCH_ASSOC` ger associativa arrayer som standard vid fetch. `charset=utf8mb4` stödjer alla Unicode-tecken inklusive emojis.
</details>

---

## Klasser (OOP)

### Övning 41: Definiera Klass

Skapa en klass `Book` med två publika egenskaper: `$title` (string) och `$author` (string). Lägg till en publik metod `displayInfo()` som skriver ut "Title: [titel], Author: [författare]".

<details>
<summary>Lösningsförslag</summary>

```php
<?php
declare(strict_types=1);

class Book {
    public string $title;
    public string $author;

    public function displayInfo(): void {
        echo "Title: " . $this->title . ", Author: " . $this->author . "\n";
    }
}
?>
```

**Förklaring:** `$this` refererar till det aktuella objektet inuti en metod. `->` används för att nå egenskaper och metoder på ett objekt. `public` gör egenskaperna och metoden åtkomliga utifrån klassen.
</details>

---

### Övning 42: Konstruktor

Modifiera `Book`-klassen så att den har en konstruktor som tar emot titel och författare som argument och sätter egenskaperna. Skapa ett `Book`-objekt med konstruktorn och anropa `displayInfo()`.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
class Book {
    public string $title;
    public string $author;

    public function __construct(string $bookTitle, string $bookAuthor) {
        $this->title = $bookTitle;
        $this->author = $bookAuthor;
    }

    public function displayInfo(): void {
        echo "Title: " . $this->title . ", Author: " . $this->author . "\n";
    }
}

$book = new Book("Liftarens Guide till Galaxen", "Douglas Adams");
$book->displayInfo();
?>
```

**Förklaring:** `__construct` anropas automatiskt när `new Book(...)` körs. Konstruktorn gör det enkelt att skapa objekt med initiala värden i ett steg, istället för att sätta egenskaperna manuellt efteråt.
</details>

---

### Övning 43: Privata Egenskaper och Getters

Modifiera `Book`-klassen: gör `$title` och `$author` privata, lägg till `$pages` (int), uppdatera konstruktorn, och skapa getter-metoder `getTitle()`, `getAuthor()` och `getPages()`.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
declare(strict_types=1);

class Book {
    private string $title;
    private string $author;
    private int $pages;

    public function __construct(string $bookTitle, string $bookAuthor, int $numPages) {
        $this->title = $bookTitle;
        $this->author = $bookAuthor;
        $this->pages = $numPages;
    }

    public function getTitle(): string {
        return $this->title;
    }

    public function getAuthor(): string {
        return $this->author;
    }

    public function getPages(): int {
        return $this->pages;
    }

    public function displayInfo(): void {
        echo "Title: " . $this->getTitle() . ", Author: " . $this->getAuthor() . ", Pages: " . $this->getPages() . "\n";
    }
}
?>
```

**Förklaring:** `private` döljer egenskaperna från utsidan – de kan endast nås inifrån klassen. Getters ger kontrollerad åtkomst och möjliggör inkapsling. Metoder inuti klassen använder getters för konsekvens.
</details>

---

### Övning 44: Klass med Beteende (Setter med Validering)

Skapa en klass `BankAccount` med privat egenskap `$balance` (float). Konstruktorn tar initialt saldo. Lägg till metoder `deposit($amount)` och `withdraw($amount)` som validerar att beloppen är positiva och att uttag inte överstiger saldot. Lägg till `getBalance()`.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
declare(strict_types=1);

class BankAccount {
    private float $balance;

    public function __construct(float $initialBalance = 0.0) {
        $this->balance = max(0.0, $initialBalance);
    }

    public function deposit(float $amount): bool {
        if ($amount <= 0) return false;
        $this->balance += $amount;
        return true;
    }

    public function withdraw(float $amount): bool {
        if ($amount <= 0 || $amount > $this->balance) return false;
        $this->balance -= $amount;
        return true;
    }

    public function getBalance(): float {
        return $this->balance;
    }
}
?>
```

**Förklaring:** Inkapsling låter klassen kontrollera hur `$balance` ändras. `deposit` och `withdraw` validerar input och returnerar `true`/`false` för att indikera lyckad operation. `max(0.0, $initialBalance)` förhindrar negativt startsaldo.
</details>

---

## CRUD-applikation och Projektstruktur

### Övning 45: Projektstruktur

Vilka filer/mappar behövs typiskt i en enkel PHP CRUD-applikation (t.ex. blogg) för att separera konfiguration, databaslogik, admin-funktioner och uppladdade filer? Nämn minst fem.

<details>
<summary>Lösningsförslag</summary>

1. **includes/config.php** – Konfiguration, databasuppgifter, `session_start()`
2. **includes/database.php** – PDO-anslutning, `connect_db()`
3. **includes/functions.php** – Hjälpfunktioner (t.ex. sanering, CSRF)
4. **admin/** – Skyddade sidor för inloggade användare (create, edit, delete)
5. **uploads/** – Mapp för uppladdade filer (bilder etc.)
6. **index.php** – Hemsida/listning
7. **login.php**, **register.php** – Autentisering

**Förklaring:** Separation av concerns gör koden underhållbar. `includes/` återanvänds på flera sidor. `admin/` grupperar skyddade resurser. `uploads/` ska vara skrivbar för webbservern och bortom document root om möjligt av säkerhetsskäl.
</details>

---

### Övning 46: Filuppladdning – Säkerhetskontroller

Nämn minst fyra säkerhetsåtgärder du bör implementera när användare laddar upp filer (t.ex. bilder) till din webbapplikation.

<details>
<summary>Lösningsförslag</summary>

1. **Validera filtyp** – Kontrollera MIME-typ eller filinnehåll (`finfo_file`) mot en vitlista. Lita inte på `$_FILES['x']['name']` eller klientens angivna typ.
2. **Validera filstorlek** – Begränsa till rimlig maxstorlek (`$_FILES['x']['size']`).
3. **Byt filnamn** – Spara aldrig med användarens filnamn. Använd `uniqid()` eller liknande för unikt, slumpmässigt namn.
4. **Använd `move_uploaded_file()`** – Den enda säkra funktionen för att flytta uppladdad fil från temp till destination.
5. **Begränsa mapprättigheter** – Säkerställ att uploads-mappen inte tillåter exekvering av skript.

**Förklaring:** Filuppladdning är en vanlig attackvektor. Angripare kan försöka ladda upp PHP-filer som exekveras på servern, eller extremt stora filer. Alltid validera på serversidan – klientvalidering kan kringgås.
</details>

---

### Övning 47: Skydda Admin-sida

Skriv PHP-kod som ska placeras högst upp i en admin-sida. Koden ska kontrollera om användaren är inloggad (sessionsvariabeln `user_id` är satt). Om inte, omdirigera till `login.php` och avbryt.

<details>
<summary>Lösningsförslag</summary>

```php
<?php
require_once __DIR__ . '/../includes/config.php'; // Innehåller session_start()

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
?>
```

**Förklaring:** Denna "guard"-kod måste köras före all annan output. `header('Location: ...')` skickar en redirect. `exit` förhindrar att resten av skriptet körs efter redirect. `__DIR__` ger aktuell mapps sökväg för relativ inkludering.
</details>

---

## Sammanfattning

Dessa övningar täcker:

- **PHP intro**: Server vs klient, Docker-miljö
- **Syntax**: Variabler, funktioner, type hinting, match, konstanter
- **Arrayer**: Indexerade/associativa, foreach, in_array, implode, explode, sort, array_keys/values
- **Funktionell PHP**: array_map, array_filter, array_reduce, anonyma funktioner, closures, use, pipelines
- **SQL**: SELECT, WHERE, ORDER BY, LIMIT, INSERT, UPDATE, DELETE, JOIN, CREATE/ALTER TABLE, LIKE, NULL
- **Sessioner & Cookies**: session_start, $_SESSION, setcookie, $_COOKIE, utloggning
- **Säkerhet**: XSS (htmlspecialchars), SQL injection (prepared statements), lösenord (password_hash/verify), CSRF, filuppladdning
- **PDO**: Anslutning, prepare, bindParam, execute, fetch, fetchAll, INSERT, UPDATE, DELETE
- **OOP**: Klasser, egenskaper, metoder, konstruktor, private, getters
- **CRUD-app**: Projektstruktur, skydd av admin-sidor, filuppladdning

Fortsätt med [CRUD-applikationen](crud-app.md) för att sätta allt i praktik!
