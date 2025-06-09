# Teknisk Intervju: Fullstack-utveckling med PHP

Detta avsnitt innehåller vanliga tekniska intervjufrågor för fullstack-utveckling med PHP och MySQL. Frågorna täcker grundläggande PHP-syntax, objektorienterad programmering, databasinteraktion, säkerhet och CRUD-operationer.

## Fråga 1: PHP Grundläggande Syntax och Variabler

**Intervjuare:** "Kan du förklara skillnaden mellan PHP och JavaScript när det gäller var koden exekveras? Visa också hur man deklarerar och använder variabler i PHP."

**Bra svar:**
```php
<?php
// PHP körs på SERVERN (server-side)
// JavaScript körs i WEBBLÄSAREN (client-side)

// PHP-variabler börjar alltid med $
$productName = "Laptop";
$productPrice = 999.50;

// Strängkonkatenering med punkt (.)
echo "Produkten " . $productName . " kostar " . $productPrice . " kr.";

// Alternativt med interpolering i dubbla citationstecken
echo "Produkten $productName kostar $productPrice kr.";
?>
```

**Förklaring:** PHP exekveras på servern innan HTML skickas till webbläsaren, medan JavaScript körs i användarens webbläsare. PHP-variabler börjar med `$` och använder `.` för strängkonkatenering.

**Intervjutips:** Betona skillnaden mellan server-side och client-side exekvering - detta är fundamentalt för fullstack-utveckling.

## Fråga 2: PHP Arrays och Loopar

**Intervjuare:** "Vad är skillnaden mellan indexerade och associativa arrays i PHP? Visa hur man använder foreach för båda typerna."

**Bra svar:**
```php
<?php
// Indexerad array (numeriska index)
$cities = ["Stockholm", "Göteborg", "Malmö"];

// Associativ array (namngivna nycklar)
$person = [
    "firstName" => "Anna",
    "lastName" => "Andersson",
    "age" => 30
];

// Foreach för indexerad array (endast värden)
foreach ($cities as $city) {
    echo $city . "<br>";
}

// Foreach för associativ array (nyckel och värde)
foreach ($person as $key => $value) {
    echo $key . ": " . $value . "<br>";
}

// Kontrollera om värde finns
if (in_array("Stockholm", $cities)) {
    echo "Stockholm finns i listan";
}

// Kontrollera om nyckel finns
if (isset($person["age"])) {
    echo "Ålder: " . $person["age"];
}
?>
```

**Förklaring:** Indexerade arrays använder numeriska index (0, 1, 2...), medan associativa arrays använder namngivna strängnycklar. Foreach är den mest idiomatiska loopen för arrays i PHP.

## Fråga 3: PHP Funktioner och Type Hinting

**Intervjuare:** "Skriv en funktion som beräknar rabatt på ett pris. Använd type hinting och förklara fördelarna med strict types."

**Bra svar:**
```php
<?php
declare(strict_types=1); // Aktiverar strikt typkontroll

function calculateDiscount(float $price, int $percentage): float {
    if ($percentage < 0 || $percentage > 100) {
        throw new InvalidArgumentException('Procentsats måste vara mellan 0-100');
    }
    
    $discountFactor = 1 - ($percentage / 100.0);
    return $price * $discountFactor;
}

// Användning
try {
    $originalPrice = 1000.0;
    $discountedPrice = calculateDiscount($originalPrice, 20);
    echo "Pris efter 20% rabatt: " . $discountedPrice . " kr";
} catch (InvalidArgumentException $e) {
    echo "Fel: " . $e->getMessage();
}
?>
```

**Förklaring:** Type hinting specificerar förväntade datatyper för parametrar och returvärden. `declare(strict_types=1)` förhindrar automatisk typkonvertering och fångar fel tidigare.

## Fråga 4: Objektorienterad Programmering i PHP

**Intervjuare:** "Skapa en enkel PHP-klass för en produkt med konstruktor, privata properties och getter/setter-metoder. Förklara fördelarna med inkapsling."

**Bra svar:**
```php
<?php
declare(strict_types=1);

class Product {
    private string $name;
    private float $price;
    private int $stock;

    public function __construct(string $name, float $price, int $stock = 0) {
        $this->name = $name;
        $this->setPrice($price); // Använd setter för validering
        $this->setStock($stock);
    }

    // Getters
    public function getName(): string {
        return $this->name;
    }

    public function getPrice(): float {
        return $this->price;
    }

    public function getStock(): int {
        return $this->stock;
    }

    // Setters med validering
    public function setPrice(float $price): void {
        if ($price < 0) {
            throw new InvalidArgumentException('Priset kan inte vara negativt');
        }
        $this->price = $price;
    }

    public function setStock(int $stock): void {
        if ($stock < 0) {
            throw new InvalidArgumentException('Lagersaldo kan inte vara negativt');
        }
        $this->stock = $stock;
    }

    public function isInStock(): bool {
        return $this->stock > 0;
    }
}

// Användning
$product = new Product("Laptop", 15999.0, 5);
echo $product->getName() . " kostar " . $product->getPrice() . " kr";
?>
```

**Förklaring:** Inkapsling (private properties + public methods) ger kontroll över hur data nås och modifieras, möjliggör validering och förhindrar direktmanipulation av objektets tillstånd.

## Fråga 5: SQL och Databasinteraktion

**Intervjuare:** "Skriv SQL-frågor för att skapa en users-tabell och visa hur man säkert hämtar användardata med PHP PDO."

**Bra svar:**
```sql
-- Skapa users-tabell
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hämta användare från specifik stad
SELECT id, username, email FROM users 
WHERE city = 'Stockholm' 
ORDER BY username ASC;
```

```php
<?php
// PHP PDO för säker databasinteraktion
function getUserByUsername(PDO $pdo, string $username): array|false {
    // Prepared statement förhindrar SQL injection
    $stmt = $pdo->prepare("SELECT id, username, email, created_at 
                           FROM users 
                           WHERE username = :username");
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Databasanslutning
try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=myapp;charset=utf8mb4',
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $user = getUserByUsername($pdo, 'kalleanka');
    if ($user) {
        echo "Användare: " . htmlspecialchars($user['username']);
    }
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo "Databasfel uppstod";
}
?>
```

**Förklaring:** Prepared statements är avgörande för att förhindra SQL injection. PDO ger ett konsekvent interface för olika databaser.

## Fråga 6: PHP Sessioner och Säkerhet

**Intervjuare:** "Förklara hur PHP-sessioner fungerar och visa hur man implementerar en säker inloggningsprocess."

**Bra svar:**
```php
<?php
// Starta session (alltid högst upp)
session_start();

function loginUser(PDO $pdo, string $username, string $password): bool {
    // Hämta användare från databas
    $stmt = $pdo->prepare("SELECT id, username, password_hash 
                           FROM users 
                           WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch();

    // Verifiera lösenord
    if ($user && password_verify($password, $user['password_hash'])) {
        // Regenerera session-ID för säkerhet
        session_regenerate_id(true);
        
        // Spara användarinfo i session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        
        return true;
    }
    
    return false;
}

function isLoggedIn(): bool {
    return isset($_SESSION['user_id']);
}

function requireLogin(): void {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

function logout(): void {
    $_SESSION = [];
    
    // Ta bort session cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    session_destroy();
}
?>
```

**Förklaring:** Sessioner lagrar data på servern och använder cookies för att identifiera användare. `password_verify()` och `session_regenerate_id()` är viktiga säkerhetsåtgärder.

## Fråga 7: CRUD Operations med PHP

**Intervjuare:** "Implementera grundläggande CRUD-operationer för en bloggpost med PHP och MySQL."

**Bra svar:**
```php
<?php
class PostRepository {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    // CREATE
    public function createPost(string $title, string $content, int $userId): int {
        $stmt = $this->pdo->prepare(
            "INSERT INTO posts (title, content, user_id, created_at) 
             VALUES (:title, :content, :user_id, NOW())"
        );
        
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        
        return (int)$this->pdo->lastInsertId();
    }

    // READ
    public function getPostById(int $id): array|false {
        $stmt = $this->pdo->prepare(
            "SELECT p.*, u.username 
             FROM posts p 
             JOIN users u ON p.user_id = u.id 
             WHERE p.id = :id"
        );
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // UPDATE
    public function updatePost(int $id, string $title, string $content, int $userId): bool {
        $stmt = $this->pdo->prepare(
            "UPDATE posts 
             SET title = :title, content = :content, updated_at = NOW()
             WHERE id = :id AND user_id = :user_id"
        );
        
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        
        return $stmt->execute() && $stmt->rowCount() > 0;
    }

    // DELETE
    public function deletePost(int $id, int $userId): bool {
        $stmt = $this->pdo->prepare(
            "DELETE FROM posts 
             WHERE id = :id AND user_id = :user_id"
        );
        
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        
        return $stmt->execute() && $stmt->rowCount() > 0;
    }
}
?>
```

**Förklaring:** CRUD-operationer (Create, Read, Update, Delete) är grundläggande för datahantering. Inkludera användar-ID i UPDATE/DELETE för säkerhet.

## Fråga 8: Formulärhantering och Validering

**Intervjuare:** "Visa hur man säkert hanterar formulärdata i PHP med validering och felhantering."

**Bra svar:**
```php
<?php
function handleContactForm(): array {
    $errors = [];
    $data = [];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Hämta och sanera input
        $data['name'] = trim($_POST['name'] ?? '');
        $data['email'] = trim($_POST['email'] ?? '');
        $data['message'] = trim($_POST['message'] ?? '');

        // Validering
        if (empty($data['name'])) {
            $errors[] = 'Namn är obligatoriskt';
        } elseif (strlen($data['name']) < 2) {
            $errors[] = 'Namnet måste vara minst 2 tecken';
        }

        if (empty($data['email'])) {
            $errors[] = 'E-post är obligatoriskt';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Ogiltig e-postadress';
        }

        if (empty($data['message'])) {
            $errors[] = 'Meddelande är obligatoriskt';
        } elseif (strlen($data['message']) < 10) {
            $errors[] = 'Meddelandet måste vara minst 10 tecken';
        }

        // Om inga fel, behandla formuläret
        if (empty($errors)) {
            // Spara till databas, skicka e-post etc.
            // Omdirigera för att förhindra dubbel inlämning
            header('Location: success.php');
            exit;
        }
    }

    return ['errors' => $errors, 'data' => $data];
}

// I HTML-templaten
$result = handleContactForm();
?>

<form method="post">
    <?php if (!empty($result['errors'])): ?>
        <div class="errors">
            <?php foreach ($result['errors'] as $error): ?>
                <p><?= htmlspecialchars($error) ?></p>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
    
    <input type="text" name="name" 
           value="<?= htmlspecialchars($result['data']['name'] ?? '') ?>">
    <input type="email" name="email" 
           value="<?= htmlspecialchars($result['data']['email'] ?? '') ?>">
    <textarea name="message"><?= htmlspecialchars($result['data']['message'] ?? '') ?></textarea>
    <button type="submit">Skicka</button>
</form>
```

**Förklaring:** Validera alltid användarinput på serversidan. Använd `htmlspecialchars()` för att förhindra XSS när data skrivs ut.

## Fråga 9: Filuppladdning och Säkerhet

**Intervjuare:** "Implementera säker filuppladdning för bilder i PHP. Vilka säkerhetsrisker finns?"

**Bra svar:**
```php
<?php
function handleImageUpload(array $file): array {
    $errors = [];
    $uploadPath = null;

    // Kontrollera att fil laddades upp utan fel
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Filuppladdning misslyckades';
        return ['errors' => $errors, 'path' => null];
    }

    // Validera filstorlek (max 5MB)
    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        $errors[] = 'Filen är för stor (max 5MB)';
    }

    // Validera filtyp (kontrollera MIME type OCH filändelse)
    $allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($mimeType, $allowedMimes) || !in_array($extension, $allowedExts)) {
        $errors[] = 'Endast JPG, PNG och GIF-filer tillåtna';
    }

    if (empty($errors)) {
        // Skapa säkert filnamn
        $safeName = uniqid('img_', true) . '.' . $extension;
        $uploadDir = __DIR__ . '/uploads/';
        $targetPath = $uploadDir . $safeName;

        // Skapa directory om det inte finns
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Flytta fil till slutgiltig plats
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $uploadPath = 'uploads/' . $safeName;
        } else {
            $errors[] = 'Kunde inte spara filen';
        }
    }

    return ['errors' => $errors, 'path' => $uploadPath];
}

// Användning
if (isset($_FILES['image'])) {
    $result = handleImageUpload($_FILES['image']);
    if (empty($result['errors'])) {
        echo "Fil uppladdad: " . htmlspecialchars($result['path']);
    }
}
?>
```

**Säkerhetsrisker:**
- **Executable uploads:** Aldrig tillåt .php, .exe filer
- **Directory traversal:** Använd säkra filnamn
- **MIME type spoofing:** Kontrollera både MIME och filändelse
- **Filstorlek:** Begränsa för att förhindra DoS

## Fråga 10: XSS och CSRF-skydd

**Intervjuare:** "Förklara XSS och CSRF-attacker. Hur skyddar man sig i PHP?"

**Bra svar:**

**XSS (Cross-Site Scripting) Skydd:**
```php
<?php
// ALLTID sanera output med htmlspecialchars()
function safeOutput(string $data): string {
    return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
}

// Farlig kod (sårbar för XSS)
echo $_GET['message']; // ❌ Farligt!

// Säker kod
echo safeOutput($_GET['message']); // ✅ Säkert

// För HTML-innehåll, använd whitelist-baserad rensning
// t.ex. HTMLPurifier biblioteket
?>
```

**CSRF (Cross-Site Request Forgery) Skydd:**
```php
<?php
session_start();

function generateCSRFToken(): string {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCSRFToken(string $token): bool {
    return isset($_SESSION['csrf_token']) && 
           hash_equals($_SESSION['csrf_token'], $token);
}

// I formulär
$csrfToken = generateCSRFToken();
?>

<form method="post">
    <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
    <!-- Övriga formulärfält -->
    <button type="submit">Skicka</button>
</form>

<?php
// Vid formulärhantering
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCSRFToken($_POST['csrf_token'] ?? '')) {
        die('CSRF-token validation failed');
    }
    
    // Fortsätt med formulärbehandling...
}
?>
```

**Förklaring:** XSS förhindras genom att sanera all output. CSRF förhindras med unika tokens som valideras vid formulärinlämning.

## Fråga 11: Error Handling och Debugging

**Intervjuare:** "Visa hur man implementerar robust felhantering i en PHP-applikation."

**Bra svar:**
```php
<?php
// Aktivera strict types och error reporting för utveckling
declare(strict_types=1);
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Custom exception klasser
class ValidationException extends Exception {}
class DatabaseException extends Exception {}

class UserService {
    private PDO $pdo;
    private LoggerInterface $logger;

    public function createUser(array $userData): int {
        try {
            // Validering
            $this->validateUserData($userData);
            
            // Databasoperation
            $stmt = $this->pdo->prepare(
                "INSERT INTO users (username, email, password_hash) 
                 VALUES (:username, :email, :password)"
            );
            
            $passwordHash = password_hash($userData['password'], PASSWORD_DEFAULT);
            
            $stmt->execute([
                ':username' => $userData['username'],
                ':email' => $userData['email'],
                ':password' => $passwordHash
            ]);
            
            $userId = (int)$this->pdo->lastInsertId();
            $this->logger->info("User created", ['user_id' => $userId]);
            
            return $userId;
            
        } catch (ValidationException $e) {
            // Logga validering fel (för utveckling)
            $this->logger->warning("Validation failed", [
                'error' => $e->getMessage(),
                'data' => $userData
            ]);
            throw $e; // Re-throw för hantering i controller
            
        } catch (PDOException $e) {
            // Logga databasfel (känslig info)
            $this->logger->error("Database error creating user", [
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            
            // Kasta generellt fel till användaren
            throw new DatabaseException('Could not create user');
            
        } catch (Exception $e) {
            // Fånga oväntade fel
            $this->logger->critical("Unexpected error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw new Exception('An unexpected error occurred');
        }
    }

    private function validateUserData(array $data): void {
        if (empty($data['username'])) {
            throw new ValidationException('Username is required');
        }
        
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new ValidationException('Invalid email format');
        }
        
        if (strlen($data['password']) < 8) {
            throw new ValidationException('Password must be at least 8 characters');
        }
    }
}

// Global exception handler för produktion
set_exception_handler(function(Throwable $e) {
    error_log("Uncaught exception: " . $e->getMessage());
    
    // Visa användarvänligt meddelande
    http_response_code(500);
    echo "Something went wrong. Please try again later.";
});
?>
```

**Förklaring:** Använd specifika exceptions, logga tekniska fel separat från användarmeddelanden, och ha en global exception handler som backup.

## Fråga 12: Performance och Optimering

**Intervjuare:** "Vilka tekniker kan du använda för att optimera prestanda i en PHP-applikation?"

**Bra svar:**

**1. Databas-optimering:**
```php
<?php
// Använd index på ofta söka kolumner
// CREATE INDEX idx_username ON users(username);
// CREATE INDEX idx_email ON users(email);

// Begränsa SELECT-kolumner
$stmt = $pdo->prepare("SELECT id, username FROM users WHERE active = 1");
// Istället för: SELECT * FROM users WHERE active = 1

// Använd LIMIT för paginering
$stmt = $pdo->prepare("SELECT * FROM posts ORDER BY created_at DESC LIMIT :offset, :limit");
$stmt->bindValue(':offset', ($page - 1) * $perPage, PDO::PARAM_INT);
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
?>
```

**2. Caching:**
```php
<?php
// APCu cache för smådata
function getCachedUserCount(): int {
    $key = 'user_count';
    $count = apcu_fetch($key);
    
    if ($count === false) {
        // Hämta från databas
        $stmt = $pdo->query("SELECT COUNT(*) FROM users");
        $count = (int)$stmt->fetchColumn();
        
        // Cache i 5 minuter
        apcu_store($key, $count, 300);
    }
    
    return $count;
}

// Filbaserad cache för komplexare data
function getCachedPosts(): array {
    $cacheFile = '/tmp/posts_cache.json';
    $cacheTime = 600; // 10 minuter
    
    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTime) {
        return json_decode(file_get_contents($cacheFile), true);
    }
    
    // Hämta från databas
    $posts = fetchPostsFromDatabase();
    file_put_contents($cacheFile, json_encode($posts));
    
    return $posts;
}
?>
```

**3. OPcache och autoloading:**
```php
<?php
// php.ini inställningar för OPcache
/*
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
*/

// Composer autoloader för effektiv class loading
require_once 'vendor/autoload.php';

// Lazy loading av tunga objekt
class Application {
    private ?DatabaseConnection $db = null;
    
    public function getDatabase(): DatabaseConnection {
        if ($this->db === null) {
            $this->db = new DatabaseConnection();
        }
        return $this->db;
    }
}
?>
```

**4. Memory och I/O optimering:**
```php
<?php
// Undvik minneskrävande operationer
// Istället för att ladda alla rader:
// $allUsers = $stmt->fetchAll(); // ❌ Kan använda mycket minne

// Använd generators för stora dataset:
function getUsersGenerator(PDO $pdo): Generator {
    $stmt = $pdo->query("SELECT * FROM users");
    while ($row = $stmt->fetch()) {
        yield $row;
    }
}

// Buffra output för bättre prestanda
ob_start();
foreach (getUsersGenerator($pdo) as $user) {
    echo "<div>" . htmlspecialchars($user['username']) . "</div>";
}
ob_end_flush();
?>
```

**Prestanda-tips:**
- Använd OPcache för att cacha kompilerad PHP-kod
- Implementera databas-indexering på ofta använda kolumner
- Cacha dyra operationer (API-anrop, komplexa beräkningar)
- Använd generators för stora dataset
- Minimera databas-queries med eager loading
- Komprimera CSS/JS och använd CDN för statiska tillgångar

**Intervjutips:** Diskutera olika nivåer av optimering - från kod-nivå till infrastruktur (load balancers, database replicas etc.).

---

## Sammanfattning

Dessa frågor täcker de viktigaste aspekterna av fullstack-utveckling med PHP:

- **Grundläggande PHP:** Syntax, variabler, funktioner
- **Datastrukturer:** Arrays, objekt, klasser
- **Databaser:** SQL, PDO, prepared statements
- **Säkerhet:** XSS, CSRF, lösenordshantering, filuppladdning
- **Arkitektur:** CRUD, error handling, prestanda

**Förberedelse-tips:**
1. Öva på att skriva PHP-kod utan IDE-hjälp
2. Memorera vanliga säkerhetsprinciper och best practices
3. Förstå skillnaden mellan server-side och client-side kod
4. Repetera SQL-grunderna och JOIN-operationer
5. Var beredd att diskutera prestanda-optimeringar
