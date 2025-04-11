# Kapitel 7: Praktiska Övningar

Dessa övningar är tänkta att hjälpa dig att befästa kunskaperna från kapitel 7. Försök att lösa dem själv först innan du tittar på lösningsförslagen.

## Övningar

### PHP Syntax och Grundläggande

1.  **Hej Världen:** Skriv ett PHP-skript som skriver ut texten "Hej Världen!" till webbläsaren.
2.  **Variabler och Utskrift:** Deklarera en variabel `$productName` med värdet "Laptop" och en variabel `$productPrice` med värdet `999.90`. Skriv ut en mening som "Produkten Laptop kostar 999.9 kr." med hjälp av dessa variabler och strängkonkatenering (`.`).
3.  **`if/else`:** Skriv en `if/else`-sats som kollar om variabeln `$productPrice` (från övning 2) är större än 500. Om den är det, skriv ut "Dyr produkt.", annars skriv ut "Billig produkt.".
4.  **Funktion:** Skapa en funktion `calculateDiscount($price, $percentage)` som tar ett pris och en procentsats (som heltal, t.ex. 10 för 10%) och returnerar det nya priset efter rabatten. Använd type hinting för parametrarna (`float` för pris, `int` för procent) och returvärdet (`float`).
5.  **Anropa Funktion:** Anropa funktionen `calculateDiscount` med priset `250.0` och procentsatsen `20`. Skriv ut resultatet.
6.  **`match`-uttryck:** Skriv ett `match`-uttryck som tar en variabel `$statusCode` (anta att den innehåller ett heltal som 200, 404, eller 500) och returnerar en beskrivande sträng ("OK", "Not Found", "Server Error", eller "Unknown" för andra värden). Skriv ut den returnerade strängen.
7.  **Strikta Typer:** Hur aktiverar du strikt typläge i en PHP-fil, och varför är det rekommenderat?

### Arrayer och Loopar

8.  **Indexerad Array:** Skapa en indexerad array `$cities` som innehåller strängarna "Stockholm", "Göteborg", "Malmö".
9.  **Åtkomst:** Skriv ut den första staden ("Stockholm") från arrayen `$cities`.
10. **Lägg till:** Lägg till staden "Uppsala" i slutet av `$cities`-arrayen.
11. **`count()`:** Skriv ut hur många städer som finns i `$cities`-arrayen.
12. **Associativ Array:** Skapa en associativ array `$car` med nycklarna `brand` (värde "Volvo") och `model` (värde "XC60").
13. **Åtkomst (Associativ):** Skriv ut bilens modell från `$car`-arrayen.
14. **`foreach` (Värden):** Använd en `foreach`-loop för att skriva ut varje stad från `$cities`-arrayen på en ny rad.
15. **`foreach` (Nyckel & Värde):** Använd en `foreach`-loop för att skriva ut både nyckel och värde från `$car`-arrayen, t.ex. "brand: Volvo".
16. **`in_array()`:** Kontrollera om staden "Malmö" finns i `$cities`-arrayen och skriv ut "Ja" eller "Nej".
17. **`implode()`:** Skapa en sträng från `$cities`-arrayen där städerna är separerade med kommatecken och mellanslag (", "). Skriv ut strängen.

### SQL (Syntax)

Anta att du har en tabell `customers` med kolumnerna `id` (INT, PK), `name` (VARCHAR), `email` (VARCHAR), `city` (VARCHAR) och en tabell `orders` med kolumnerna `order_id` (INT, PK), `customer_id` (INT, FK till customers.id), `order_date` (DATE), `amount` (DECIMAL).

18. **SELECT Alla:** Skriv SQL för att hämta alla kolumner för alla kunder.
19. **SELECT Specifika Kolumner & WHERE:** Skriv SQL för att hämta `name` och `email` för kunder som bor i "Göteborg".
20. **ORDER BY & LIMIT:** Skriv SQL för att hämta namnen på de 10 första kunderna sorterade i bokstavsordning (A-Ö).
21. **INSERT:** Skriv SQL för att lägga till en ny kund med namn "Lisa Berg" och e-post "lisa@example.com" som bor i "Malmö".
22. **UPDATE:** Skriv SQL för att ändra staden till "Lund" för kunden med `id` 15.
23. **DELETE:** Skriv SQL för att ta bort kunden med `id` 20.
24. **INNER JOIN:** Skriv SQL för att hämta order-ID (`orders.order_id`) och kundens namn (`customers.name`) för alla ordrar.

### Sessioner och Säkerhet (Koncept/PHP)

25. **Starta Session:** Vilken PHP-funktion används för att starta eller återuppta en session, och var i skriptet bör den placeras?
26. **Lagra i Session:** Skriv PHP-koden för att lagra värdet "dark" i sessionsvariabeln `theme`.
27. **Kontrollera Session:** Skriv en `if`-sats i PHP som kontrollerar om sessionsvariabeln `user_id` är satt.
28. **Förhindra XSS:** Vilken PHP-funktion bör du *alltid* använda när du skriver ut data som kan ha kommit från en användare i ett HTML-sammanhang? Ge ett exempel.
29. **Förhindra SQL Injection:** Vilken teknik bör du *alltid* använda när du bygger SQL-frågor som innehåller värden från användarinput? Nämn den PHP-funktion (i PDO) som initierar denna teknik.
30. **Lösenordshantering:** Vilka två PHP-funktioner (introducerade i PHP 5.5) är standard för att hantera lösenord säkert, och vad gör de?
31. **CSRF-skydd:** Vad är en vanlig metod för att skydda formulär mot Cross-Site Request Forgery (CSRF)-attacker?

### Mini-CRUD (PHP/PDO)

Anta att du har en PDO-anslutning i variabeln `$pdo` och en `tasks`-tabell med kolumnerna `id` (INT, PK, AUTO_INCREMENT) och `description` (TEXT).

32. **Hämta Input:** Skriv PHP-koden för att säkert hämta värdet från ett formulärfält med `name="task_description"` som skickats via POST.
33. **INSERT (PDO):** Skriv PHP-koden som använder `$pdo` och Prepared Statements för att infoga värdet från föregående uppgift (lagrat i en variabel `$description`) i `tasks`-tabellens `description`-kolumn.
34. **SELECT Alla (PDO):** Skriv PHP-koden som använder `$pdo` för att hämta alla rader från `tasks`-tabellen (endast `id` och `description`) och lagra resultatet i en array `$allTasks`.

### Klasser (OOP Grunderna)

35. **Definiera Klass:** Skapa en klass `Book` med två *publika* egenskaper: `$title` (string) och `$author` (string). Lägg till en *publik* metod `displayInfo()` som skriver ut "Title: [titel], Author: [författare]".
36. **Skapa Objekt:** Skapa två olika `Book`-objekt från klassen ovan. Sätt olika värden för `title` och `author` för varje objekt. Anropa `displayInfo()`-metoden på båda objekten.
37. **Konstruktor:** Modifiera `Book`-klassen så att den har en konstruktor (`__construct`) som tar emot titel och författare som argument och sätter egenskaperna direkt när objektet skapas. Skapa ett nytt `Book`-objekt med hjälp av konstruktorn och anropa `displayInfo()`.
38. **Synlighet & Getters:** Modifiera `Book`-klassen igen:
    *   Gör egenskaperna `$title` och `$author` *privata* (`private`).
    *   Lägg till en ny *publik* egenskap `$pages` (int).
    *   Uppdatera konstruktorn så att den även tar emot antal sidor (`$pages`) och sätter alla tre egenskaperna.
    *   Skapa *publika* "getter"-metoder: `getTitle()`, `getAuthor()`, och `getPages()` som returnerar värdet på respektive privat egenskap.
39. **Använda Getters:** Skapa ett `Book`-objekt från den modifierade klassen i föregående uppgift. Använd getter-metoderna för att hämta och skriva ut bokens titel, författare och antal sidor.

---

## Lösningsförslag

### PHP Syntax och Grundläggande

1.  ```php
    <?php
    echo "Hej Världen!";
    ?>
    ```
    eller
    ```php
    <?= "Hej Världen!"; ?>
    ```

2.  ```php
    <?php
    $productName = "Laptop";
    $productPrice = 999.90;
    echo "Produkten " . $productName . " kostar " . $productPrice . " kr.";
    // Alternativt med dubbla citationstecken för interpolering:
    // echo "Produkten $productName kostar $productPrice kr.";
    ?>
    ```

3.  ```php
    <?php
    $productPrice = 999.90; // Från övning 2
    if ($productPrice > 500) {
        echo "Dyr produkt.";
    } else {
        echo "Billig produkt.";
    }
    ?>
    ```

4.  ```php
    <?php
    declare(strict_types=1);
    function calculateDiscount(float $price, int $percentage): float {
        if ($percentage < 0 || $percentage > 100) {
            // Ohanterad procentsats, returnera ursprungspris eller kasta fel?
            throw new InvalidArugmentException('$percentage måste vara mellan 0-100')
        }
        $discountFactor = 1 - ($percentage / 100.0);
        return $price * $discountFactor;
    }
    ?>
    ```

5.  ```php
    <?php
    // Antag att funktionen från övning 4 finns
    $discountedPrice = calculateDiscount(250.0, 20);
    echo "Pris efter 20% rabatt: " . $discountedPrice; // Output: Pris efter 20% rabatt: 200
    ?>
    ```

6.  ```php
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

7.  Strikt typläge aktiveras med `declare(strict_types=1);` överst i PHP-filen (efter `<?php`-taggen). Det rekommenderas för att PHP inte ska försöka tvångsomvandla datatyper mellan inkompatibla typer vid funktionsanrop, vilket fångar fel tidigare och gör koden mer förutsägbar och robust.

### Arrayer och Loopar

8.  ```php
    <?php
    $cities = ["Stockholm", "Göteborg", "Malmö"];
    // Eller äldre syntax: $cities = array("Stockholm", "Göteborg", "Malmö");
    ?>
    ```

9.  ```php
    <?php
    $cities = ["Stockholm", "Göteborg", "Malmö"];
    echo $cities[0]; // Output: Stockholm
    ?>
    ```

10. ```php
    <?php
    $cities = ["Stockholm", "Göteborg", "Malmö"];
    $cities[] = "Uppsala"; // Lägger till i slutet
    // Alternativt: array_push($cities, "Uppsala");
    print_r($cities); // Visar hela arrayen för kontroll
    ?>
    ```

11. ```php
    <?php
    $cities = ["Stockholm", "Göteborg", "Malmö", "Uppsala"];
    echo count($cities); // Output: 4
    ?>
    ```

12. ```php
    <?php
    $car = [
        'brand' => 'Volvo',
        'model' => 'XC60'
    ];
    ?>
    ```

13. ```php
    <?php
    $car = ['brand' => 'Volvo', 'model' => 'XC60'];
    echo $car['model']; // Output: XC60
    ?>
    ```

14. ```php
    <?php
    $cities = ["Stockholm", "Göteborg", "Malmö", "Uppsala"];
    foreach ($cities as $city) {
        echo $city . "\n"; // \n för ny rad om det körs i terminalen, <br> för webbläsare
    }
    ?>
    ```

15. ```php
    <?php
    $car = ['brand' => 'Volvo', 'model' => 'XC60'];
    foreach ($car as $key => $value) {
        echo $key . ": " . $value . "\n";
    }
    ?>
    ```

16. ```php
    <?php
    $cities = ["Stockholm", "Göteborg", "Malmö", "Uppsala"];
    if (in_array("Malmö", $cities)) {
        echo "Ja";
    } else {
        echo "Nej";
    }
    ?>
    ```

17. ```php
    <?php
    $cities = ["Stockholm", "Göteborg", "Malmö", "Uppsala"];
    $cityString = implode(", ", $cities);
    echo $cityString; // Output: Stockholm, Göteborg, Malmö, Uppsala
    ?>
    ```

### SQL (Syntax)

18. `SELECT * FROM customers;`
19. `SELECT name, email FROM customers WHERE city = 'Göteborg';`
20. `SELECT name FROM customers ORDER BY name ASC LIMIT 10;`
21. `INSERT INTO customers (name, email, city) VALUES ('Lisa Berg', 'lisa@example.com', 'Malmö');`
22. `UPDATE customers SET city = 'Lund' WHERE id = 15;`
23. `DELETE FROM customers WHERE id = 20;`
24. `SELECT orders.order_id, customers.name FROM orders INNER JOIN customers ON orders.customer_id = customers.id;`

### Sessioner och Säkerhet (Koncept/PHP)

25. Funktionen är `session_start()`. Den bör placeras allra högst upp i PHP-skriptet, före *all* annan output (HTML, mellanslag, echo etc.).
26. ```php
    <?php
    session_start();
    $_SESSION['theme'] = 'dark';
    ?>
    ```
27. ```php
    <?php
    session_start();
    if (isset($_SESSION['user_id'])) {
        echo "Användaren är inloggad.";
    } else {
        echo "Användaren är inte inloggad.";
    }
    ?>
    ```
28. Funktionen är `htmlspecialchars()`. Exempel:
    ```php
    <?php 
    $userInput = "<script>alert('hack');</script>"; 
    echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8'); 
    // Output blir ofarlig text: &lt;script&gt;alert(&#039;hack&#039;);&lt;/script&gt;
    ?>
    ```
29. Tekniken är **Prepared Statements**. I PDO initieras detta med `$pdo->prepare("SQL med :placeholders...")`.
30. `password_hash()`: Skapar en stark, saltad hash av ett lösenord. `password_verify()`: Jämför ett inskickat lösenord mot en lagrad hash på ett säkert sätt.
31. **Anti-CSRF Tokens (Synchronizer Token Pattern):** Generera en unik token, lagra den i sessionen, inkludera den i formuläret, och verifiera att den inskickade token matchar sessionens token på serversidan innan åtgärden utförs.

### Mini-CRUD (PHP/PDO)

32. ```php
    <?php
    // Antag att formuläret skickats via POST
    $description = trim($_POST['task_description'] ?? '');
    // Ytterligare validering kan behövas (t.ex. kolla om tom)
    ?>
    ```
33. ```php
    <?php
    // Antag att $pdo är en giltig PDO-anslutning och $description har ett värde
    try {
        $sql = "INSERT INTO tasks (description) VALUES (:desc)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':desc', $description, PDO::PARAM_STR);
        $stmt->execute();
        echo "Uppgift tillagd!";
    } catch (PDOException $e) {
        error_log("Insert Task Error: " . $e->getMessage());
        echo "Kunde inte lägga till uppgift.";
    }
    ?>
    ```
34. ```php
    <?php
    // Antag att $pdo är en giltig PDO-anslutning
    $allTasks = [];
    try {
        $sql = "SELECT id, description FROM tasks ORDER BY id";
        $stmt = $pdo->query($sql); // Enkel query går bra här då ingen input finns
        $allTasks = $stmt->fetchAll(); 
    } catch (PDOException $e) {
        error_log("Fetch Tasks Error: " . $e->getMessage());
        echo "Kunde inte hämta uppgifter.";
    }
    // Nu innehåller $allTasks en array med alla uppgifter (eller är tom om fel)
    // print_r($allTasks);
    ?>
    ```

### Klasser (OOP Grunderna)

35. ```php
    <?php
    declare(strict_types=1);

    class Book 
    {
        public string $title;
        public string $author;

        public function displayInfo(): void 
        {
            echo "Title: " . $this->title . ", Author: " . $this->author . "\n";
        }
    }
    ?>
    ```

36. ```php
    <?php
    // Antag att Book-klassen från övning 35 finns

    $book1 = new Book();
    $book1->title = "Ronja Rövardotter";
    $book1->author = "Astrid Lindgren";

    $book2 = new Book();
    $book2->title = "Sagan om Ringen";
    $book2->author = "J.R.R. Tolkien";

    $book1->displayInfo(); // Output: Title: Ronja Rövardotter, Author: Astrid Lindgren
    $book2->displayInfo(); // Output: Title: Sagan om Ringen, Author: J.R.R. Tolkien
    ?>
    ```

37. ```php
    <?php
    declare(strict_types=1);

    class Book 
    {
        public string $title;
        public string $author;

        // Konstruktor
        public function __construct(string $bookTitle, string $bookAuthor)
        {
            $this->title = $bookTitle;
            $this->author = $bookAuthor;
        }

        public function displayInfo(): void 
        {
            echo "Title: " . $this->title . ", Author: " . $this->author . "\n";
        }
    }

    // Skapa objekt med konstruktor
    $book3 = new Book("Liftarens Guide till Galaxen", "Douglas Adams");
    $book3->displayInfo(); // Output: Title: Liftarens Guide till Galaxen, Author: Douglas Adams
    ?>
    ```

38. ```php
    <?php
    declare(strict_types=1);

    class Book 
    {
        private string $title;
        private string $author;
        public int $pages; // Lämnar denna publik som exempel

        public function __construct(string $bookTitle, string $bookAuthor, int $numPages)
        {
            $this->title = $bookTitle;
            $this->author = $bookAuthor;
            $this->pages = $numPages; // Sätter den publika egenskapen
        }

        // Getter för titel
        public function getTitle(): string 
        {
            return $this->title;
        }

        // Getter för författare
        public function getAuthor(): string 
        {
            return $this->author;
        }

        // Getter för sidantal (tekniskt sett inte nödvändig då pages är publik, men bra för konsekvens)
        public function getPages(): int 
        {
            return $this->pages;
        }

        // Vi kan behålla displayInfo om vi vill, men den behöver använda getters nu
        public function displayInfo(): void 
        {
            echo "Title: " . $this->getTitle() . ", Author: " . $this->getAuthor() . ", Pages: " . $this->getPages() . "\n";
        }
    }
    ?>
    ```

39. ```php
    <?php
    // Antag att den modifierade Book-klassen från övning 38 finns

    $book4 = new Book("Mio min Mio", "Astrid Lindgren", 180);

    // Hämta värden med getters
    $title = $book4->getTitle();
    $author = $book4->getAuthor();
    $pages = $book4->getPages(); // Kan också nås direkt: $book4->pages

    echo "Bok: " . $title . "\n";
    echo "Författare: " . $author . "\n";
    echo "Antal sidor: " . $pages . "\n";

    // Anropa displayInfo som nu använder getters internt
    $book4->displayInfo();
    ?>
    ```
