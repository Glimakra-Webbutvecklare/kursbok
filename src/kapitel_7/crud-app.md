# Bygga en CRUD-applikation: Enkel Blogg

I detta avsnitt bygger vi en komplett men enkel bloggapplikation från grunden med PHP och MariaDB/MySQL. Målet är att praktiskt demonstrera **CRUD**-operationerna (Create, Read, Update, Delete) och integrera andra viktiga webbkoncept som databasinteraktion med PDO, användarautentisering, sessionshantering och filuppladdning.

Vi börjar med en mycket grundläggande struktur och kodstil för att sedan i slutet refaktorera och förbättra koden, bland annat genom att introducera type hinting.

**Applikationens Funktioner:**

*   Användare kan registrera sig och logga in.
*   Inloggade användare kan skapa, redigera och ta bort sina egna blogginlägg.
*   Användare kan ladda upp en bild till varje blogginlägg.
*   Alla besökare kan se listan över blogginlägg och läsa enskilda inlägg.
*   En enkel "admin"-sektion för inloggade användare att hantera sina inlägg.

## 1. Databasdesign

Vi behöver två huvudtabeller: en för användare (`users`) och en för blogginlägg (`posts`).

**`users` tabell:**

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Lagrar hashat lösenord
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

*   `id`: Unik identifierare för användaren.
*   `username`: Användarnamn för inloggning (unikt).
*   `email`: Användarens e-post (unik).
*   `password_hash`: Lagrar det säkert hashade lösenordet (inte lösenordet i klartext!).
*   `created_at`: När användarkontot skapades.

**`posts` tabell:**

```sql
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,             -- Vem som skrev inlägget
    title VARCHAR(255) NOT NULL,      -- Inläggets titel
    body TEXT NOT NULL,               -- Innehållet i inlägget
    image_path VARCHAR(255) NULL,     -- Sökväg till uppladdad bild (valfritt)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- När inlägget senast ändrades
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Koppling till users. Om användaren raderas, raderas även hens inlägg.
);
```

*   `id`: Unik identifierare för inlägget.
*   `user_id`: Referens till `id` i `users`-tabellen. Visar vem som äger inlägget.
*   `title`: Inläggets rubrik.
*   `body`: Brödtexten i inlägget.
*   `image_path`: Sökvägen till den associerade bilden (om någon laddats upp). `NULL` om ingen bild finns.
*   `created_at`: När inlägget skapades.
*   `updated_at`: Uppdateras automatiskt när inlägget ändras.
*   `FOREIGN KEY ...`: Definierar en relation mellan `posts.user_id` och `users.id`. `ON DELETE CASCADE` betyder att om en användare tas bort, tas alla dennes inlägg också bort automatiskt.

Skapa dessa tabeller i din MariaDB/MySQL-databas (t.ex. via phpMyAdmin eller kommandoraden). Vi antar att databasen heter `db_fullstack` som i tidigare exempel.

## 2. Projektstruktur (Initial)

Vi börjar med en väldigt platt och enkel filstruktur. Skapa följande filer och mappar i roten av ditt projekt (t.ex. i `app/public` om du följer `docker-compose`-exemplet):

```
.
├── admin/
│   ├── index.php         # Admin dashboard (lista inlägg, länkar till create/edit/delete)
│   ├── create_post.php   # Formulär & logik för att skapa inlägg
│   ├── edit_post.php     # Formulär & logik för att redigera inlägg
│   └── delete_post.php   # Logik för att ta bort inlägg
├── includes/
│   ├── config.php        # Databasuppgifter och annan konfiguration
│   ├── database.php      # Funktion för att ansluta till databasen (PDO)
│   └── functions.php     # Hjälpfunktioner (vi lägger till här senare)
├── uploads/              # Mapp där uppladdade bilder sparas (måste vara skrivbar för webbservern!)
├── index.php             # Hemsida, listar blogginlägg
├── login.php             # Inloggningsformulär & logik
├── logout.php            # Logik för att logga ut
├── post.php              # Visar ett enskilt blogginlägg
└── register.php          # Registreringsformulär & logik
```

*   `admin/`: Innehåller sidor som endast inloggade användare ska kunna nå.
*   `includes/`: Innehåller återanvändbar kod som konfiguration och databasanslutning.
*   `uploads/`: Här hamnar bilder som användare laddar upp. **VIKTIGT:** Se till att webbservern (Apache i vårt Docker-exempel) har skrivrättigheter till denna mapp!

## 3. Grundläggande Setup

### Konfiguration (`includes/config.php`)

Skapa filen `includes/config.php` och lägg in dina databasuppgifter.

```php
<?php
// includes/config.php

// Databasuppgifter (anpassa efter din miljö)
define('DB_HOST', 'mysql'); // Matchar service-namnet i docker-compose.yml
define('DB_NAME', 'db_fullstack');
define('DB_USER', 'db_user');
define('DB_PASS', 'db_password');

// Teckenkodning för PDO-anslutningen
define('DB_CHARSET', 'utf8mb4');

// Starta sessioner (viktigt för login!)
// Görs en gång här så det gäller alla sidor som inkluderar config.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Base URL (valfritt, men kan vara praktiskt för länkar)
// Anpassa port om du använder en annan än 8060
define('BASE_URL', 'http://localhost:8060');

// Sökväg till uppladdningsmappen
define('UPLOAD_PATH', __DIR__ . '/../uploads/'); // __DIR__ ger sökvägen till includes/

// Aktivera felrapportering under utveckling
// Stäng av på en produktionsserver!
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>
```

### Databasanslutning (`includes/database.php`)

Skapa filen `includes/database.php`. Vi använder **PDO (PHP Data Objects)** för att ansluta. PDO ger ett konsekvent sätt att interagera med olika databaser och hjälper till att skydda mot SQL-injektion genom "prepared statements".

```php
<?php
// includes/database.php
require_once 'config.php'; // Inkludera konfigurationen

/**
 * Skapar och returnerar en PDO-databasanslutning.
 *
 * @return PDO PDO-anslutningsobjektet.
 * @throws PDOException Om anslutningen misslyckas.
 */
function connect_db(): PDO {
    // Data Source Name (DSN)
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;

    // Alternativ för PDO-anslutningen
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Kasta exceptions vid fel
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Hämta resultat som associativa arrayer
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Använd prepared statements
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Logga felet istället för att skriva ut känslig info
        error_log("Database Connection Error: " . $e->getMessage());
        // Visa ett generellt felmeddelande till användaren
        throw new PDOException("Kunde inte ansluta till databasen. Försök igen senare.", (int)$e->getCode());
        // Eller: die("Kunde inte ansluta till databasen. Kontakta administratör.");
    }
}

// För att använda anslutningen på en sida:
// $pdo = connect_db();

?>
```

**Förklaring:**

*   Vi inkluderar `config.php` för att få databasuppgifterna.
*   `$dsn`: En sträng som specificerar databastyp, värd, databasnamn och teckenkodning.
*   `$options`: Viktiga inställningar för PDO:
    *   `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`: Gör att PDO kastar ett undantag (`PDOException`) om ett databasfel inträffar. Detta är att föredra framför att bara få `false` eller varningar, då det ger tydligare felhantering.
    *   `PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC`: Gör att när vi hämtar data (`fetch()`, `fetchAll()`) får vi resultatet som en associativ array (kolumnnamn => värde) istället för både numeriska index och kolumnnamn (vilket är default `PDO::FETCH_BOTH`).
    *   `PDO::ATTR_EMULATE_PREPARES => false`: Tvingar PDO att använda databasserverns inbyggda "prepared statements" istället för att emulera dem i PHP. Detta är generellt säkrare och ibland mer effektivt.
*   `try...catch`: Vi försöker skapa ett nytt `PDO`-objekt. Om det misslyckas (fel lösenord, databasen nere etc.) kastas en `PDOException`. Vi fångar den, loggar det tekniska felet (för utvecklaren) och kastar sedan ett nytt, mer användarvänligt, undantag eller avslutar skriptet med `die()`. **Skriv aldrig ut det detaljerade felet `$e->getMessage()` direkt till användaren i produktion!**

## 4. Användarregistrering (`register.php`)

Nu skapar vi sidan där användare kan registrera sig.

**`register.php`:**

```php
<?php
require_once 'includes/config.php';
require_once 'includes/database.php';

$errors = []; // Array för att lagra felmeddelanden
$username = '';
$email = '';

// Hantera formulärdata när det skickas (POST request)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Validering
    if (empty($username)) {
        $errors[] = 'Användarnamn är obligatoriskt.';
    }
    if (empty($email)) {
        $errors[] = 'E-post är obligatoriskt.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Ogiltig e-postadress.';
    }
    if (empty($password)) {
        $errors[] = 'Lösenord är obligatoriskt.';
    } elseif (strlen($password) < 6) {
        $errors[] = 'Lösenordet måste vara minst 6 tecken långt.';
    }
    if ($password !== $confirm_password) {
        $errors[] = 'Lösenorden matchar inte.';
    }

    // Om inga valideringsfel, försök registrera användaren
    if (empty($errors)) {
        try {
            $pdo = connect_db();

            // 1. Kolla om användarnamn eller e-post redan finns
            $stmt_check = $pdo->prepare("SELECT id FROM users WHERE username = :username OR email = :email");
            $stmt_check->bindParam(':username', $username);
            $stmt_check->bindParam(':email', $email);
            $stmt_check->execute();

            if ($stmt_check->fetch()) {
                $errors[] = 'Användarnamn eller e-postadress är redan registrerad.';
            } else {
                // 2. Hasha lösenordet säkert
                $password_hash = password_hash($password, PASSWORD_DEFAULT);

                // 3. Infoga användaren i databasen
                $stmt_insert = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password_hash)");
                $stmt_insert->bindParam(':username', $username);
                $stmt_insert->bindParam(':email', $email);
                $stmt_insert->bindParam(':password_hash', $password_hash);

                if ($stmt_insert->execute()) {
                    // Registrering lyckades! Omdirigera till login-sidan.
                    header('Location: login.php?registered=success');
                    exit;
                } else {
                    $errors[] = 'Ett fel uppstod vid registrering. Försök igen.';
                }
            }
        } catch (PDOException $e) {
            error_log("Registration Error: " . $e->getMessage());
            $errors[] = 'Databasfel. Kan inte registrera användare just nu.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrera dig - Enkel Blogg</title>
    <style> /* Enkel CSS för formuläret */
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input[type="text"], input[type="email"], input[type="password"] {
            width: 100%; padding: 8px; border: 1px solid #ccc; box-sizing: border-box;
        }
        button { padding: 10px 15px; background-color: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        .error-messages { color: red; margin-bottom: 15px; }
        .error-messages ul { list-style: none; padding: 0; }
    </style>
</head>
<body>
    <h1>Registrera nytt konto</h1>

    <?php if (!empty($errors)): ?>
        <div class="error-messages">
            <strong>Registreringen misslyckades:</strong>
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <form action="register.php" method="post">
        <div class="form-group">
            <label for="username">Användarnamn:</label>
            <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($username); ?>" required>
        </div>
        <div class="form-group">
            <label for="email">E-post:</label>
            <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>" required>
        </div>
        <div class="form-group">
            <label for="password">Lösenord:</label>
            <input type="password" id="password" name="password" required minlength="6">
        </div>
        <div class="form-group">
            <label for="confirm_password">Bekräfta lösenord:</label>
            <input type="password" id="confirm_password" name="confirm_password" required>
        </div>
        <button type="submit">Registrera</button>
    </form>

    <p>Har du redan ett konto? <a href="login.php">Logga in här</a>.</p>
</body>
</html>
```

**Förklaring av `register.php`:**

1.  **Inkludera filer:** Börjar med att inkludera `config.php` (som startar sessioner) och `database.php`.
2.  **Felhantering:** Initierar en `$errors`-array för att samla validerings- och andra fel.
3.  **POST-hantering:** Kollar om formuläret skickats (`$_SERVER['REQUEST_METHOD'] === 'POST'`).
4.  **Hämta data:** Tar emot data från `$_POST`. `trim()` tar bort onödiga mellanslag. `?? ''` ger en tom sträng om värdet saknas.
5.  **Validering:** Kontrollerar att fälten inte är tomma, att e-post är giltig (`filter_var`), att lösenordet är tillräckligt långt och att lösenorden matchar.
6.  **Databaskontroll:**
    *   Om validering lyckas, anslut till databasen inom en `try...catch`-block.
    *   **Prepared Statement (Check):** Skapar en förberedd fråga (`prepare`) för att kolla om användarnamn eller e-post redan finns. `bindParam` binder PHP-variabler till platshållare (`:username`, `:email`). Detta är **avgörande för säkerhet** mot SQL-injektion.
    *   `execute()` kör frågan.
    *   `fetch()` hämtar en rad. Om den returnerar något, finns användaren redan.
7.  **Lösenordshashning:**
    *   **VIKTIGT:** Lagra **aldrig** lösenord i klartext! Använd `password_hash()` med `PASSWORD_DEFAULT`. PHP väljer då den starkaste tillgängliga hash-algoritmen (oftast bcrypt). Varje gång detta körs genereras en unik hash, även för samma lösenord.
8.  **Infoga Användare:**
    *   **Prepared Statement (Insert):** Skapar en ny förberedd fråga för att infoga användaren.
    *   Binder parametrar igen.
    *   `execute()` kör infogningen.
9.  **Omdirigering:** Om infogningen lyckas (`execute()` returnerar `true`), omdirigera användaren till `login.php` med `header('Location: ...')`. `exit;` efteråt är viktigt för att stoppa skriptet.
10. **Felvisning:** Om `$errors`-arrayen inte är tom (antingen från validering eller databasfel), skrivs felmeddelandena ut ovanför formuläret. `htmlspecialchars()` används för att förhindra Cross-Site Scripting (XSS) när användarinmatning (som `$username`, `$email`) skrivs ut.

## 5. Användarlogin (`login.php`)

Nu skapar vi inloggningssidan.

**`login.php`:**

```php
<?php
require_once 'includes/config.php'; // Startar sessionen
require_once 'includes/database.php';

$errors = [];
$username = '';

// Visa meddelande om registrering lyckades
$registration_success = isset($_GET['registered']) && $_GET['registered'] === 'success';

// Hantera formulärdata när det skickas (POST request)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validering
    if (empty($username)) {
        $errors[] = 'Användarnamn är obligatoriskt.';
    }
    if (empty($password)) {
        $errors[] = 'Lösenord är obligatoriskt.';
    }

    // Om inga valideringsfel, försök logga in
    if (empty($errors)) {
        try {
            $pdo = connect_db();

            // 1. Hämta användaren från databasen baserat på användarnamn
            $stmt = $pdo->prepare("SELECT id, username, password_hash FROM users WHERE username = :username");
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $user = $stmt->fetch(); // Hämta användardata (eller false om användaren inte finns)

            // 2. Verifiera lösenordet
            if ($user && password_verify($password, $user['password_hash'])) {
                // Lösenordet matchar! Logga in användaren.

                // Regenerera session ID för säkerhet (mot session fixation)
                session_regenerate_id(true);

                // Spara användarinformation i sessionen
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];

                // Omdirigera till admin-sidan eller startsidan
                header('Location: admin/index.php');
                exit;

            } else {
                // Användare finns inte eller fel lösenord
                $errors[] = 'Felaktigt användarnamn eller lösenord.';
            }

        } catch (PDOException $e) {
            error_log("Login Error: " . $e->getMessage());
            $errors[] = 'Databasfel. Kan inte logga in just nu.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logga in - Enkel Blogg</title>
    <style> /* Samma enkla CSS som register.php */
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input[type="text"], input[type="password"] {
            width: 100%; padding: 8px; border: 1px solid #ccc; box-sizing: border-box;
        }
        button { padding: 10px 15px; background-color: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        .error-messages { color: red; margin-bottom: 15px; }
        .error-messages ul { list-style: none; padding: 0; }
        .success-message { color: green; margin-bottom: 15px; }
    </style>
</head>
<body>
    <h1>Logga in</h1>

    <?php if ($registration_success): ?>
        <p class="success-message">Registreringen lyckades! Du kan nu logga in.</p>
    <?php endif; ?>

    <?php if (!empty($errors)): ?>
        <div class="error-messages">
            <strong>Inloggningen misslyckades:</strong>
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <form action="login.php" method="post">
        <div class="form-group">
            <label for="username">Användarnamn:</label>
            <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($username); ?>" required>
        </div>
        <div class="form-group">
            <label for="password">Lösenord:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Logga in</button>
    </form>

    <p>Har du inget konto? <a href="register.php">Registrera dig här</a>.</p>
</body>
</html>
```

**Förklaring av `login.php`:**

1.  **Session Start:** `config.php` startar sessionen (`session_start()`).
2.  **Framgångsmeddelande:** Kollar om `?registered=success` finns i URL:en och visar i så fall ett meddelande.
3.  **POST-hantering & Validering:** Liknar `register.php`.
4.  **Hämta Användare:**
    *   Använder en prepared statement för att hämta användaren baserat på det angivna användarnamnet. Vi hämtar `id`, `username` och den hashade lösenordet (`password_hash`).
    *   `$stmt->fetch()` returnerar antingen en associativ array med användardata eller `false` om användarnamnet inte hittades.
5.  **Verifiera Lösenord:**
    *   **VIKTIGT:** Använd `password_verify($password, $user['password_hash'])` för att jämföra det angivna lösenordet (`$password`) med det hashade lösenordet från databasen (`$user['password_hash']`). `password_verify` sköter allt (salt etc.) automatiskt. Returnerar `true` om lösenordet matchar, annars `false`. **Jämför aldrig hashar direkt!**
6.  **Logga in (Session):**
    *   Om `$user` finns OCH `password_verify` returnerar `true`, är inloggningen lyckad.
    *   `session_regenerate_id(true)`: Skapar ett nytt session-ID för den aktuella sessionen. Detta är en viktig säkerhetsåtgärd för att förhindra "session fixation"-attacker. Det gamla session-ID:t tas bort.
    *   `$_SESSION['user_id'] = $user['id'];`: Vi sparar användarens `id` i `$_SESSION`-arrayen. Detta är nyckeln till att veta att användaren är inloggad på andra sidor.
    *   `$_SESSION['username'] = $user['username'];`: Sparar även användarnamnet för att kunna visa det.
7.  **Omdirigering:** Omdirigera den inloggade användaren till `admin/index.php`.
8.  **Felhantering:** Om `$user` inte finns eller `password_verify` misslyckas, visa ett generellt felmeddelande.
9.  **HTML-formulär:** Liknar registreringsformuläret.

## 6. Sessionshantering & Logout

### Hur Sessioner Fungerar (Kort)

1.  `session_start()`: Startar eller återupptar en session. PHP letar efter ett session-ID (oftast skickat via en cookie). Om inget finns, skapas ett nytt ID och en ny sessionfil på servern. Om ett ID finns, laddas data från motsvarande sessionfil in i den globala `$_SESSION`-arrayen.
2.  `$_SESSION`: En superglobal array där vi kan lagra data som är specifik för den aktuella användarens session (t.ex. `user_id`). Datan sparas på servern.
3.  Session Cookie: PHP skickar automatiskt en cookie (oftast med namnet `PHPSESSID`) till webbläsaren som innehåller det unika session-ID:t. Webbläsaren skickar tillbaka denna cookie vid varje efterföljande förfrågan, så att PHP kan identifiera rätt sessionfil.

### Skydda Sidor

För sidor som bara inloggade användare ska nå (t.ex. i `admin/`-mappen), behöver vi kontrollera om `$_SESSION['user_id']` är satt.

Lägg till följande kod i början av varje skyddad fil (t.ex. `admin/index.php`, `admin/create_post.php` etc.):

```php
<?php
require_once '../includes/config.php'; // Gå upp en nivå för att nå includes

// Kontrollera om användaren är inloggad
if (!isset($_SESSION['user_id'])) {
    // Användaren är inte inloggad, omdirigera till login-sidan
    header('Location: ../login.php?redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit;
}

// Om vi når hit är användaren inloggad.
// Hämta användar-ID från sessionen för senare användning
$logged_in_user_id = $_SESSION['user_id'];
$logged_in_username = $_SESSION['username']; // Kan användas för att visa "Inloggad som ..."

// Inkludera resten av sidans logik här...
require_once '../includes/database.php';
// ...
?>
```

*   Vi kollar om `$_SESSION['user_id']` är satt. Om inte, omdirigerar vi till `login.php`.
*   Vi skickar med `?redirect=...` för att potentiellt kunna skicka tillbaka användaren till den sida de försökte nå efter inloggning (implementeras inte fullt ut här, men är en bra idé). `urlencode` ser till att URL:en är korrekt kodad.

### Utloggning (`logout.php`)

En enkel sida för att avsluta sessionen.

**`logout.php`:**

```php
<?php
require_once 'includes/config.php'; // Säkerställer att sessionen startas

// 1. Ta bort alla sessionsvariabler
$_SESSION = []; // Tömmer $_SESSION-arrayen

// 2. Om sessionskakor används, ta bort den
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, // Sätt en tidpunkt i det förflutna
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Förstör sessionen på servern
session_destroy();

// 4. Omdirigera till startsidan eller login-sidan
header('Location: index.php?logged_out=success');
exit;
?>
```

**Förklaring av `logout.php`:**

1.  Tömmer `$_SESSION`-arrayen.
2.  Tar bort sessionscookien från webbläsaren genom att sätta dess utgångstid i det förflutna.
3.  `session_destroy()`: Tar bort sessionfilen på servern.
4.  Omdirigerar användaren.

## 7. Skapa Blogginlägg (Create - `admin/create_post.php`)

Denna sida innehåller formuläret och logiken för att skapa ett nytt blogginlägg. Den måste vara skyddad.

**`admin/create_post.php`:**

```php
<?php
require_once '../includes/config.php'; // Ger session_start()

// ---- Session Check ----
if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php?redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit;
}
$logged_in_user_id = $_SESSION['user_id'];
// ---- End Session Check ----

require_once '../includes/database.php';

$errors = [];
$title = '';
$body = '';

// Hantera formulärdata när det skickas (POST request)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $body = trim($_POST['body'] ?? '');
    $image = $_FILES['image'] ?? null; // Hämta filinformation
    $image_path = null; // Sökväg till sparad bild

    // Validering
    if (empty($title)) {
        $errors[] = 'Titel är obligatoriskt.';
    }
    if (empty($body)) {
        $errors[] = 'Innehåll är obligatoriskt.';
    }

    // ---- Bildhantering ----
    if ($image && $image['error'] === UPLOAD_ERR_OK) {
        // Validera filtyp och storlek (exempel)
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_size = 7 * 1024 * 1024; // 7 MB

        if (!in_array($image['type'], $allowed_types)) {
            $errors[] = 'Ogiltig filtyp. Endast JPG, PNG och GIF är tillåtna.';
        } elseif ($image['size'] > $max_size) {
            $errors[] = 'Filen är för stor. Maxstorlek är 5 MB.';
        } else {
            // Skapa ett unikt filnamn för att undvika kollisioner
            $file_extension = pathinfo($image['name'], PATHINFO_EXTENSION);
            $unique_filename = uniqid('post_img_', true) . '.' . $file_extension;
            $destination = UPLOAD_PATH . $unique_filename; // UPLOAD_PATH från config.php

            // Försök flytta filen till uploads/-mappen
            if (move_uploaded_file($image['tmp_name'], $destination)) {
                $image_path = 'uploads/' . $unique_filename; // Spara relativ sökväg för webbåtkomst
            } else {
                $errors[] = 'Kunde inte ladda upp bilden. Kontrollera mapprättigheter.';
                error_log("File Upload Error: Could not move file to " . $destination);
            }
        }
    } elseif ($image && $image['error'] !== UPLOAD_ERR_NO_FILE) {
        // Om ett annat fel än "ingen fil" inträffade
        $errors[] = 'Ett fel uppstod vid bilduppladdning. Felkod: ' . $image['error'];
    }
    // ---- Slut Bildhantering ----


    // Om inga valideringsfel, försök spara inlägget
    if (empty($errors)) {
        try {
            $pdo = connect_db();

            $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, body, image_path) VALUES (:user_id, :title, :body, :image_path)");
            $stmt->bindParam(':user_id', $logged_in_user_id); // Använd ID från sessionen
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':body', $body);
            // Bind image_path, blir NULL om ingen bild laddades upp korrekt
            $stmt->bindParam(':image_path', $image_path, $image_path === null ? PDO::PARAM_NULL : PDO::PARAM_STR);


            if ($stmt->execute()) {
                // Inlägget skapades! Omdirigera till admin-dashboarden.
                header('Location: index.php?created=success');
                exit;
            } else {
                $errors[] = 'Ett fel uppstod när inlägget skulle sparas.';
                 // Om bilden hann sparas men DB-insert misslyckades, kan man överväga att ta bort bilden här.
                 if ($image_path && file_exists(UPLOAD_PATH . basename($image_path))) {
                     unlink(UPLOAD_PATH . basename($image_path));
                 }
            }
        } catch (PDOException $e) {
            error_log("Create Post Error: " . $e->getMessage());
            $errors[] = 'Databasfel. Kan inte spara inlägg just nu.';
            // Om bilden hann sparas men DB-insert misslyckades pga exception
            if ($image_path && file_exists(UPLOAD_PATH . basename($image_path))) {
                 unlink(UPLOAD_PATH . basename($image_path));
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Skapa nytt inlägg - Admin</title>
    <style> /* Enkel CSS */
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input[type="text"], textarea {
            width: 100%; padding: 8px; border: 1px solid #ccc; box-sizing: border-box;
        }
        textarea { min-height: 150px; }
        button { padding: 10px 15px; background-color: #28a745; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #218838; }
        .error-messages { color: red; margin-bottom: 15px; }
        .error-messages ul { list-style: none; padding: 0; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Skapa nytt blogginlägg</h1>
    <p><a href="index.php">&laquo; Tillbaka till Admin Dashboard</a></p>

    <?php if (!empty($errors)): ?>
        <div class="error-messages">
            <strong>Inlägget kunde inte sparas:</strong>
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <!-- Viktigt: enctype="multipart/form-data" för filuppladdning -->
    <form action="create_post.php" method="post" enctype="multipart/form-data">
        <div class="form-group">
            <label for="title">Titel:</label>
            <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($title); ?>" required>
        </div>
        <div class="form-group">
            <label for="body">Innehåll:</label>
            <textarea id="body" name="body" required><?php echo htmlspecialchars($body); ?></textarea>
        </div>
        <div class="form-group">
            <label for="image">Bild (valfritt, max 7MB, JPG/PNG/GIF):</label>
            <input type="file" id="image" name="image" accept="image/jpeg, image/png, image/gif">
        </div>
        <button type="submit">Spara inlägg</button>
    </form>

</body>
</html>
```

**Förklaring av `admin/create_post.php`:**

1.  **Session Check:** Koden från avsnitt 6 ser till att endast inloggade användare kan komma åt sidan. `$logged_in_user_id` sparas.
2.  **Formulärhantering:** Liknar `register.php`, men hämtar även filinformation från `$_FILES['image']`.
3.  **Bildhantering:**
    *   Kollar om en fil har laddats upp (`$image`) och om det inte uppstod något fel under uppladdningen (`$image['error'] === UPLOAD_ERR_OK`).
    *   **Validering:** Kontrollerar filtyp (`$image['type']`) mot en lista av tillåtna typer och filstorlek (`$image['size']`) mot en maxgräns.
    *   **Unikt Filnamn:** Genererar ett unikt filnamn med `uniqid()` och `pathinfo()` för att undvika att filer skriver över varandra.
    *   **Destination:** Skapar den fullständiga sökvägen till målmappen (`UPLOAD_PATH` från `config.php` + det unika filnamnet).
    *   **`move_uploaded_file()`:** Försöker flytta den temporärt uppladdade filen (`$image['tmp_name']`) till den slutgiltiga destinationen. **Detta är det säkra sättet att hantera filuppladdningar.**
    *   **Spara Sökväg:** Om flytten lyckas, sparas den *relativa* sökvägen (t.ex. `uploads/bild.jpg`) i `$image_path`. Denna relativa sökväg används sedan i `<img>`-taggar i HTML.
    *   **Felhantering:** Om något går fel (fel filtyp, för stor fil, misslyckad flytt), läggs ett fel till i `$errors`-arrayen.
4.  **Spara i Databas:**
    *   Om validering och eventuell bilduppladdning lyckades, körs en `INSERT`-fråga med prepared statements.
    *   `user_id` hämtas från sessionen (`$logged_in_user_id`).
    *   `image_path` binds. **Viktigt:** Om `$image_path` är `null` (ingen bild laddades upp eller det blev fel), måste vi specificera `PDO::PARAM_NULL` när vi binder, annars försöker PDO binda det som en tom sträng, vilket kan vara fel.
5.  **Omdirigering/Fel:** Omdirigera vid succé, visa fel annars. Om databasinfogningen misslyckas *efter* att bilden sparats, bör man försöka ta bort den sparade bilden (`unlink()`) för att undvika skräpfiler.
6.  **HTML-formulär:**
    *   **`enctype="multipart/form-data"`:** Detta attribut är **absolut nödvändigt** i `<form>`-taggen för att filuppladdning ska fungera.
    *   `<input type="file">`: Fältet för att välja en bild. `accept`-attributet hjälper webbläsaren att filtrera vilka filer som visas.

## 8. Visa Blogginlägg (Read)

### Lista Alla Inlägg (`index.php`)

Startsidan ska visa en lista över alla publicerade blogginlägg, kanske med titel, en kort del av innehållet, och en länk för att läsa mer.

**`index.php`:**

```php
<?php
require_once 'includes/config.php';
require_once 'includes/database.php';

$posts = []; // Array för att lagra inlägg
$fetch_error = null;

try {
    $pdo = connect_db();
    // Hämta alla inlägg, sorterade med det senaste först
    // Hämta även användarnamnet för författaren via en JOIN
    $stmt = $pdo->query("SELECT posts.*, users.username
                         FROM posts
                         JOIN users ON posts.user_id = users.id
                         ORDER BY posts.created_at DESC");
    $posts = $stmt->fetchAll();

} catch (PDOException $e) {
    error_log("Index Page Error: " . $e->getMessage());
    $fetch_error = "Kunde inte hämta blogginlägg just nu. Försök igen senare.";
}

?>
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enkel Blogg</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        .post-summary { border: 1px solid #eee; padding: 15px; margin-bottom: 20px; }
        .post-summary h2 { margin-top: 0; }
        .post-meta { font-size: 0.9em; color: #666; margin-bottom: 10px; }
        .post-image-list { max-width: 150px; max-height: 100px; float: right; margin-left: 15px; }
        .read-more { display: inline-block; margin-top: 10px; }
        nav { margin-bottom: 20px; background-color: #f8f9fa; padding: 10px; border-radius: 5px; }
        nav a { margin-right: 15px; text-decoration: none; color: #007bff; }
        nav a:hover { text-decoration: underline; }
        .error-message { color: red; border: 1px solid red; padding: 10px; margin-bottom: 20px; }
        .success-message { color: green; border: 1px solid green; padding: 10px; margin-bottom: 20px; }
    </style>
</head>
<body>

    <nav>
        <a href="index.php">Hem</a>
        <?php if (isset($_SESSION['user_id'])): ?>
            <a href="admin/index.php">Admin Dashboard</a>
            <a href="logout.php">Logga ut (<?php echo htmlspecialchars($_SESSION['username']); ?>)</a>
        <?php else: ?>
            <a href="login.php">Logga in</a>
            <a href="register.php">Registrera dig</a>
        <?php endif; ?>
    </nav>

    <h1>Välkommen till Bloggen!</h1>

    <?php if (isset($_GET['logged_out']) && $_GET['logged_out'] === 'success'): ?>
        <p class="success-message">Du har loggats ut.</p>
    <?php endif; ?>

    <?php if ($fetch_error): ?>
        <p class="error-message"><?php echo htmlspecialchars($fetch_error); ?></p>
    <?php else: ?>
        <?php if (empty($posts)): ?>
            <p>Det finns inga blogginlägg ännu.</p>
        <?php else: ?>
            <?php foreach ($posts as $post): ?>
                <article class="post-summary">
                    <?php if (!empty($post['image_path'])): ?>
                        <img src="<?php echo htmlspecialchars(BASE_URL . '/' . $post['image_path']); ?>"
                             alt="Inläggsbild" class="post-image-list">
                    <?php endif; ?>
                    <h2><?php echo htmlspecialchars($post['title']); ?></h2>
                    <div class="post-meta">
                        Publicerad: <?php echo date('Y-m-d H:i', strtotime($post['created_at'])); ?>
                        av <?php echo htmlspecialchars($post['username']); ?>
                    </div>
                    <p>
                        <?php
                        // Visa en kort del av texten (t.ex. 200 tecken)
                        $summary = htmlspecialchars($post['body']);
                        if (strlen($summary) > 200) {
                            $summary = substr($summary, 0, 200) . '...';
                        }
                        echo nl2br($summary); // nl2br gör om nya rader till <br>
                        ?>
                    </p>
                    <a href="post.php?id=<?php echo $post['id']; ?>" class="read-more">Läs mer &raquo;</a>
                    <div style="clear: both;"></div> <!-- Rensa float -->
                </article>
            <?php endforeach; ?>
        <?php endif; ?>
    <?php endif; ?>

</body>
</html>
```

**Förklaring av `index.php`:**

1.  **Hämta Data:**
    *   Ansluter till databasen.
    *   Använder `$pdo->query()` för en enkel `SELECT`-fråga (eftersom inga användarparametrar behövs här är `query()` okej, men `prepare`/`execute` fungerar också).
    *   Använder `JOIN users ON posts.user_id = users.id` för att hämta författarens användarnamn (`users.username`) tillsammans med post-datan.
    *   Sorterar med `ORDER BY posts.created_at DESC` för att visa de senaste inläggen först.
    *   `$stmt->fetchAll()` hämtar alla matchande rader som en array av associativa arrayer.
    *   Felhantering med `try...catch`.
2.  **Navigation (`<nav>`):** Visar olika länkar beroende på om användaren är inloggad (`isset($_SESSION['user_id'])`). Visar användarnamnet om inloggad.
3. **Fel/Succé-meddelanden:** Visar meddelande om utloggning lyckats, eller om det blev fel vid hämtning av inlägg.
4.  **Loopa igenom Inlägg:**
    *   Om inga fel och `$posts`-arrayen inte är tom, loopar vi igenom den med `foreach`.
    *   För varje `$post`:
        *   Visar bilden om `image_path` finns. Notera användningen av `BASE_URL` för att skapa en absolut sökväg till bilden.
        *   Visar titel, metadata (datum, författare). `strtotime()` konverterar databasens tidsstämpel till en Unix timestamp som `date()` kan formatera.
        *   Visar en förkortad version av brödtexten (`substr`) och använder `nl2br()` för att respektera radbrytningar i texten.
        *   Skapar en "Läs mer"-länk till `post.php` och skickar med inläggets `id` i URL:en (`?id=...`).
    *   `htmlspecialchars()` används genomgående för att skydda mot XSS när data från databasen skrivs ut.

### Visa Enskilt Inlägg (`post.php`)

Denna sida visar hela innehållet för ett specifikt blogginlägg, baserat på `id`:t som skickas i URL:en.

**`post.php`:**

```php
<?php
require_once 'includes/config.php';
require_once 'includes/database.php';

// Hämta post-ID från URL-parametern
$post_id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$post = null;
$fetch_error = null;

if ($post_id === false || $post_id <= 0) {
    $fetch_error = "Ogiltigt inläggs-ID.";
} else {
    try {
        $post = get_post_by_id($post_id); // Använd funktionen!
        if (!$post) {
            $fetch_error = "Inlägget hittades inte.";
        }
    } catch (PDOException $e) {
         error_log("View Post Error (ID: $post_id): " . $e->getMessage());
         $fetch_error = "Kunde inte hämta blogginlägget just nu.";
    }
}

?>
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Titel sätts dynamiskt om inlägget hittas -->
    <title><?php echo $post ? htmlspecialchars($post['title']) : 'Inlägg'; ?> - Enkel Blogg</title>
     <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        .post-content { margin-top: 20px; }
        .post-meta { font-size: 0.9em; color: #666; margin-bottom: 10px; }
        .post-image-full { max-width: 100%; height: auto; margin-bottom: 20px; }
        nav { margin-bottom: 20px; background-color: #f8f9fa; padding: 10px; border-radius: 5px; }
        nav a { margin-right: 15px; text-decoration: none; color: #007bff; }
        nav a:hover { text-decoration: underline; }
        .error-message { color: red; border: 1px solid red; padding: 10px; margin-bottom: 20px; }
    </style>
</head>
<body>

    <nav>
        <a href="index.php">Hem</a>
        <?php if (isset($_SESSION['user_id'])): ?>
            <a href="admin/index.php">Admin Dashboard</a>
            <a href="logout.php">Logga ut (<?php echo htmlspecialchars($_SESSION['username']); ?>)</a>
        <?php else: ?>
            <a href="login.php">Logga in</a>
            <a href="register.php">Registrera dig</a>
        <?php endif; ?>
    </nav>

    <?php if ($fetch_error): ?>
        <p class="error-message"><?php echo htmlspecialchars($fetch_error); ?></p>
    <?php elseif ($post): ?>
        <article class="post-content">
            <h1><?php echo htmlspecialchars($post['title']); ?></h1>
            <div class="post-meta">
                Publicerad: <?php echo date('Y-m-d H:i', strtotime($post['created_at'])); ?>
                av <?php echo htmlspecialchars($post['username']); ?>
                <?php if ($post['created_at'] !== $post['updated_at']): ?>
                    (Senast ändrad: <?php echo date('Y-m-d H:i', strtotime($post['updated_at'])); ?>)
                <?php endif; ?>
            </div>

             <?php if (!empty($post['image_path'])): ?>
                <img src="<?php echo htmlspecialchars(BASE_URL . '/' . $post['image_path']); ?>"
                     alt="<?php echo htmlspecialchars($post['title']); ?>" class="post-image-full">
            <?php endif; ?>

            <div>
                <?php
                // Skriv ut brödtexten, konvertera nya rader till <br>
                echo nl2br(htmlspecialchars($post['body']));
                ?>
            </div>
        </article>
        <hr>
        <p><a href="index.php">&laquo; Tillbaka till alla inlägg</a></p>
    <?php else: ?>
         <p class="error-message">Inlägget kunde inte laddas.</p> <!-- Fallback om post är null utan error -->
    <?php endif; ?>

</body>
</html>
```

**Förklaring av `post.php`:**

1.  **Hämta ID:** Använder `filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT)` för att säkert hämta och validera `id`-parametern från URL:en (`$_GET['id']`). Detta skyddar mot vissa typer av attacker och säkerställer att vi har ett heltal.
2.  **Validera ID:** Kontrollerar att `$post_id` är ett giltigt positivt heltal.
3.  **Hämta Data:**
    *   Använder en **prepared statement** för att hämta inlägget med det specifika `:id`. Detta är viktigt även här för säkerhet, även om ID:t är validerat som heltal.
    *   `bindParam` binder `$post_id` till platshållaren, och specificerar `PDO::PARAM_INT` för att vara extra tydlig med datatypen.
    *   `$stmt->fetch()` hämtar den enda raden (eller `false` om ID inte finns)
4.  **Felhantering:** Sätter `$fetch_error` om ID är ogiltigt, inlägget inte hittas, eller om ett `PDOException` inträffar.
5.  **Visa Innehåll:** Om `$post` innehåller data (inte är `null` eller `false`), visas titel, metadata (inklusive "Senast ändrad" om `updated_at` skiljer sig från `created_at`), eventuell bild och hela brödtexten (`nl2br(htmlspecialchars(...))`).
6.  **Navigation/Fel:** Visar navigeringsmeny och eventuella felmeddelanden.

## 9. Redigera Blogginlägg (Update - `admin/edit_post.php`)

Denna sida låter en inloggad användare redigera *sina egna* inlägg. Den behöver både hämta befintlig data och hantera uppdateringar.

**`admin/edit_post.php`:**

```php
<?php
require_once '../includes/config.php'; // Ger session_start()

// ---- Session Check ----
if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php?redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit;
}
$logged_in_user_id = $_SESSION['user_id'];
// ---- End Session Check ----

require_once '../includes/database.php';

$errors = [];
$post_id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$post = null; // För att lagra den hämtade post-datan
$title = '';
$body = '';
$current_image_path = null;

// --- Steg 1: Hämta inlägget som ska redigeras ---
if ($post_id === false || $post_id <= 0) {
    $errors[] = "Ogiltigt inläggs-ID.";
} else {
    try {
        $pdo = connect_db();
        $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = :id");
        $stmt->bindParam(':id', $post_id, PDO::PARAM_INT);
        $stmt->execute();
        $post = $stmt->fetch();

        if (!$post) {
             $errors[] = "Inlägget hittades inte.";
        } elseif ($post['user_id'] !== $logged_in_user_id) {
             $errors[] = "Du har inte behörighet att redigera detta inlägg.";
             $post = null; // Nollställ post så att formuläret inte visas
        } else {
            // Fyll i formulärvärden med hämtad data
            $title = $post['title'];
            $body = $post['body'];
            $current_image_path = $post['image_path'];
        }
    } catch (PDOException $e) {
        error_log("Edit Post Fetch Error (ID: $post_id): " . $e->getMessage());
        $errors[] = 'Databasfel. Kan inte hämta inlägg för redigering.';
        $post = null; // Nollställ post vid databasfel
    }
}
// --- Slut Steg 1 ---

// --- Steg 2: Hantera formulärdata vid POST (uppdatering) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $post) { // Kör bara om post hämtades OK
    $title = trim($_POST['title'] ?? '');
    $body = trim($_POST['body'] ?? '');
    $image = $_FILES['image'] ?? null;
    $delete_image = isset($_POST['delete_image']); // Kolla om kryssrutan är ikryssad
    $new_image_path = $current_image_path; // Börja med den gamla bilden

    // Validering (samma som create)
    if (empty($title)) {
        $errors[] = 'Titel är obligatoriskt.';
    }
    if (empty($body)) {
        $errors[] = 'Innehåll är obligatoriskt.';
    }

    $image_uploaded = false; // Flagga för att se om ny bild laddats upp

    // ---- Bildhantering (liknar create, men med delete-option) ----
    if ($delete_image) {
        // Om användaren vill ta bort bilden
        if ($current_image_path && file_exists(UPLOAD_PATH . basename($current_image_path))) {
            if (unlink(UPLOAD_PATH . basename($current_image_path))) {
                $new_image_path = null; // Ta bort sökvägen
                 $current_image_path = null; // Uppdatera även för visning
            } else {
                 $errors[] = 'Kunde inte ta bort den befintliga bilden.';
                 error_log("File Deletion Error: Could not delete " . UPLOAD_PATH . basename($current_image_path));
            }
        } else {
            $new_image_path = null; // Ingen bild fanns eller kunde inte tas bort
            $current_image_path = null;
        }
    } elseif ($image && $image['error'] === UPLOAD_ERR_OK) {
        // Om en NY bild laddas upp (validera etc.)
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_size = 5 * 1024 * 1024; // 5 MB

        if (!in_array($image['type'], $allowed_types)) {
            $errors[] = 'Ogiltig filtyp för ny bild. Endast JPG, PNG och GIF.';
        } elseif ($image['size'] > $max_size) {
            $errors[] = 'Den nya filen är för stor. Maxstorlek är 5 MB.';
        } else {
            $file_extension = pathinfo($image['name'], PATHINFO_EXTENSION);
            $unique_filename = uniqid('post_img_', true) . '.' . $file_extension;
            $destination = UPLOAD_PATH . $unique_filename;

            if (move_uploaded_file($image['tmp_name'], $destination)) {
                // Ta bort den GAMLA bilden om den fanns
                if ($current_image_path && file_exists(UPLOAD_PATH . basename($current_image_path))) {
                    unlink(UPLOAD_PATH . basename($current_image_path));
                }
                $new_image_path = 'uploads/' . $unique_filename; // Spara nya sökvägen
                $image_uploaded = true; // Markera att ny bild laddats upp
            } else {
                $errors[] = 'Kunde inte ladda upp den nya bilden.';
                error_log("File Upload Error (Edit): Could not move file to " . $destination);
            }
        }
    } elseif ($image && $image['error'] !== UPLOAD_ERR_NO_FILE) {
        $errors[] = 'Ett fel uppstod vid bilduppladdning. Felkod: ' . $image['error'];
    }
    // ---- Slut Bildhantering ----

    // Om inga fel hittills, försök uppdatera databasen
    if (empty($errors)) {
        try {
            // Vi behöver $pdo igen här om det inte redan är definierat
            if (!isset($pdo)) $pdo = connect_db();

            $stmt = $pdo->prepare("UPDATE posts SET title = :title, body = :body, image_path = :image_path WHERE id = :id AND user_id = :user_id");
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':body', $body);
            $stmt->bindParam(':image_path', $new_image_path, $new_image_path === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
            $stmt->bindParam(':id', $post_id, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $logged_in_user_id, PDO::PARAM_INT); // Dubbelkolla ägarskap vid UPDATE


            if ($stmt->execute()) {
                 // Uppdatering lyckades! Omdirigera till admin-dashboarden.
                header('Location: index.php?updated=success&id=' . $post_id);
                exit;
            } else {
                $errors[] = 'Ett fel uppstod när inlägget skulle uppdateras.';
                // Om en ny bild hann laddas upp men DB-update misslyckades, ta bort den nya bilden
                if ($image_uploaded && $new_image_path && file_exists(UPLOAD_PATH . basename($new_image_path))) {
                    unlink(UPLOAD_PATH . basename($new_image_path));
                }
            }

        } catch (PDOException $e) {
            error_log("Update Post Error (ID: $post_id): " . $e->getMessage());
            $errors[] = 'Databasfel. Kan inte uppdatera inlägg just nu.';
             // Om en ny bild hann laddas upp men DB-update misslyckades pga exception
             if ($image_uploaded && $new_image_path && file_exists(UPLOAD_PATH . basename($new_image_path))) {
                 unlink(UPLOAD_PATH . basename($new_image_path));
             }
        }
    }
}
// --- Slut Steg 2 ---

?>
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redigera inlägg - Admin</title>
     <style> /* Samma CSS */
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input[type="text"], textarea {
            width: 100%; padding: 8px; border: 1px solid #ccc; box-sizing: border-box;
        }
        textarea { min-height: 150px; }
        button { padding: 10px 15px; background-color: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        .error-messages { color: red; margin-bottom: 15px; }
        .error-messages ul { list-style: none; padding: 0; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .current-image img { max-width: 200px; max-height: 150px; display: block; margin-top: 5px; }
        .delete-image label { display: inline-block; margin-left: 5px; }
    </style>
</head>
<body>
    <h1>Redigera blogginlägg</h1>
    <p><a href="index.php">&laquo; Tillbaka till Admin Dashboard</a></p>

    <?php if (!empty($errors)): ?>
        <div class="error-messages">
            <strong>Inlägget kunde inte uppdateras (eller hämtas):</strong>
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <?php // Visa bara formuläret om inlägget kunde hämtas och användaren har behörighet ?>
    <?php if ($post): ?>
        <form action="edit_post.php?id=<?php echo $post_id; ?>" method="post" enctype="multipart/form-data">
            <div class="form-group">
                <label for="title">Titel:</label>
                <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($title); ?>" required>
            </div>
            <div class="form-group">
                <label for="body">Innehåll:</label>
                <textarea id="body" name="body" required><?php echo htmlspecialchars($body); ?></textarea>
            </div>

            <div class="form-group">
                <label>Nuvarande Bild:</label>
                <?php if ($current_image_path): ?>
                    <div class="current-image">
                        <img src="<?php echo htmlspecialchars(BASE_URL . '/' . $current_image_path); ?>" alt="Nuvarande bild">
                    </div>
                    <div class="delete-image">
                         <input type="checkbox" id="delete_image" name="delete_image" value="1">
                         <label for="delete_image">Ta bort nuvarande bild</label>
                    </div>
                <?php else: ?>
                    <p>Ingen bild är uppladdad.</p>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label for="image">Ladda upp ny bild (valfritt, ersätter nuvarande):</label>
                <input type="file" id="image" name="image" accept="image/jpeg, image/png, image/gif">
            </div>

            <button type="submit">Uppdatera inlägg</button>
        </form>
    <?php endif; ?>

</body>
</html>
```

**Förklaring av `admin/edit_post.php`:**

1.  **Session Check:** Som tidigare.
2.  **Hämta Inlägg (Steg 1):**
    *   Hämtar `id` från `$_GET`.
    *   Använder prepared statement för att hämta inlägget med det ID:t.
    *   **Säkerhetskontroll:** Verifierar att inlägget finns (`$post`) OCH att `user_id` i inlägget matchar ID:t för den inloggade användaren (`$logged_in_user_id`). Detta förhindrar att en användare redigerar någon annans inlägg genom att gissa ID:n. Om kontrollen misslyckas, sätts `$post` till `null` och ett fel läggs till.
    *   Om allt är okej, fylls variablerna `$title`, `$body`, `$current_image_path` med data från databasen. Dessa används för att för-fylla formuläret.
3.  **Hantera Uppdatering (Steg 2 - POST):**
    *   Koden körs bara om `REQUEST_METHOD` är `POST` OCH om `$post` hämtades framgångsrikt i steg 1.
    *   Hämtar data från `$_POST` och `$_FILES`.
    *   Kollar om kryssrutan `delete_image` är ikryssad.
    *   **Bildlogik:**
        *   Om `delete_image` är ikryssad: Försöker ta bort den gamla bildfilen med `unlink()` och sätter `$new_image_path` till `null`.
        *   Om en *ny* bild laddas upp (`$image` finns och är OK): Validerar filen, flyttar den till `uploads/`, **tar bort den gamla bilden** om den fanns, och sätter `$new_image_path` till den nya sökvägen.
        *   Om ingen ny bild laddas upp och `delete_image` inte är ikryssad, behålls `$new_image_path = $current_image_path`.
    *   **Validering:** Validerar titel och brödtext.
    *   **Uppdatera Databas:**
        *   Om inga fel, kör en `UPDATE`-fråga med prepared statements.
        *   Uppdaterar `title`, `body` och `image_path` (som nu kan vara den gamla, `null` eller en ny sökväg).
        *   **Viktigt:** Inkluderar `WHERE id = :id AND user_id = :user_id` för att säkerställa att vi bara uppdaterar rätt inlägg OCH att den inloggade användaren fortfarande äger det (som en extra säkerhetsåtgärd).
    *   Omdirigering vid succé, felhantering annars (inklusive att ta bort en nyligen uppladdad bild om DB-uppdateringen misslyckas).
4.  **HTML-formulär:**
    *   Visas endast om `$post` hämtades framgångsrikt (och ägs av användaren).
    *   Action-URL:en inkluderar `?id=...` så att vi vet vilket inlägg som ska uppdateras när formuläret skickas.
    *   Fälten är för-ifyllda med `htmlspecialchars($title)` och `htmlspecialchars($body)`.
    *   Visar den nuvarande bilden om den finns.
    *   Inkluderar en kryssruta (`delete_image`) för att ta bort bilden.
    *   Har ett fält för att ladda upp en ny bild.

## 10. Ta bort Blogginlägg (Delete - `admin/delete_post.php`)

Denna sida hanterar endast logiken för att ta bort ett inlägg. Den bör anropas via en POST-förfrågan (från en knapp i admin-listan) för att undvika oavsiktlig radering via GET-länkar.

**`admin/delete_post.php`:**

```php
<?php
require_once '../includes/config.php'; // Ger session_start()

// ---- Session Check ----
if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php'); // Omdirigera direkt vid ej inloggad
    exit;
}
$logged_in_user_id = $_SESSION['user_id'];
// ---- End Session Check ----

require_once '../includes/database.php';

$errors = [];
$post_id = null;

// Radera endast om det är en POST-förfrågan
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $post_id = filter_input(INPUT_POST, 'post_id', FILTER_VALIDATE_INT);

    if ($post_id === false || $post_id <= 0) {
        $errors[] = "Ogiltigt inläggs-ID för radering.";
    } else {
        try {
            $pdo = connect_db();

            // Steg 1: Hämta bildsökväg INNAN radering (och kontrollera ägarskap)
            $stmt_fetch = $pdo->prepare("SELECT user_id, image_path FROM posts WHERE id = :id");
            $stmt_fetch->bindParam(':id', $post_id, PDO::PARAM_INT);
            $stmt_fetch->execute();
            $post_data = $stmt_fetch->fetch();

            if (!$post_data) {
                 $errors[] = "Inlägget som ska raderas hittades inte.";
            } elseif ($post_data['user_id'] !== $logged_in_user_id) {
                 $errors[] = "Du har inte behörighet att radera detta inlägg.";
            } else {
                // Användaren äger inlägget, fortsätt med radering

                // Steg 2: Försök radera posten från databasen
                $stmt_delete = $pdo->prepare("DELETE FROM posts WHERE id = :id AND user_id = :user_id");
                $stmt_delete->bindParam(':id', $post_id, PDO::PARAM_INT);
                $stmt_delete->bindParam(':user_id', $logged_in_user_id, PDO::PARAM_INT); // Dubbelkolla ägarskap

                if ($stmt_delete->execute()) {
                    // Radering från DB lyckades

                    // Steg 3: Försök ta bort den associerade bilden (om den finns)
                    $image_to_delete = $post_data['image_path'];
                    if ($image_to_delete && file_exists(UPLOAD_PATH . basename($image_to_delete))) {
                        if (!unlink(UPLOAD_PATH . basename($image_to_delete))) {
                            // Logga felet, men omdirigera ändå eftersom posten är borta från DB
                            error_log("File Deletion Error (Post Delete): Could not delete " . UPLOAD_PATH . basename($image_to_delete));
                            // Kanske lägga ett meddelande i sessionen för admin att se?
                            // $_SESSION['admin_notice'] = "Inlägg $post_id raderat, men kunde inte ta bort bildfil.";
                        }
                    }

                    // Omdirigera till admin-dashboarden med success-meddelande
                    header('Location: index.php?deleted=success&id=' . $post_id);
                    exit;

                } else {
                    $errors[] = "Kunde inte radera inlägget från databasen.";
                }
            }

        } catch (PDOException $e) {
            error_log("Delete Post Error (ID: $post_id): " . $e->getMessage());
            $errors[] = 'Databasfel. Kan inte radera inlägg just nu.';
        }
    }
} else {
    // Om inte POST, omdirigera bort (eller visa fel)
    $errors[] = "Ogiltig förfrågan för att radera inlägg.";
    // Kanske omdirigera? header('Location: index.php'); exit;
}

// Om vi når hit har något gått fel. Visa felmeddelanden (eller omdirigera med fel i URL)
// Detta är en förenklad felhantering för en ren backend-sida.
// I en mer avancerad app skulle man kanske sätta felmeddelande i sessionen
// och omdirigera tillbaka till index.php.
?>
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Raderingsfel - Admin</title>
     <style> /* Enkel CSS */
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        .error-messages { color: red; margin-bottom: 15px; border: 1px solid red; padding: 10px; }
        .error-messages ul { list-style: none; padding: 0; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Fel vid radering</h1>
     <?php if (!empty($errors)): ?>
        <div class="error-messages">
            <strong>Inlägget kunde inte raderas:</strong>
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
     <p><a href="index.php">&laquo; Tillbaka till Admin Dashboard</a></p>
</body>
</html>
```

**Förklaring av `admin/delete_post.php`:**

1.  **Session Check & POST Check:** Säkerställer inloggning och att skriptet anropas via POST.
2.  **Hämta ID:** Hämtar `post_id` från `$_POST`.
3.  **Hämta Bildsökväg & Kontrollera Ägarskap:**
    *   **INNAN** vi raderar från databasen, hämtar vi inläggets `user_id` och `image_path`.
    *   Vi kontrollerar att inlägget finns och att den inloggade användaren äger det.
4.  **Radera från Databas:**
    *   Om ägarskapet är korrekt, kör en `DELETE`-fråga med prepared statements. Inkluderar `AND user_id = :user_id` som en extra säkerhetsåtgärd.
5.  **Radera Bildfil:**
    *   Om raderingen från databasen lyckades (`execute()` returnerar `true`), försöker vi ta bort den associerade bildfilen med `unlink()`.
    *   Vi kollar först om `$image_to_delete` inte är `null` och om filen faktiskt existerar.
    *   Om `unlink()` misslyckas loggar vi felet, men fortsätter (eftersom posten redan är borta från databasen).
6.  **Omdirigering:** Omdirigerar till `admin/index.php` med ett success-meddelande.
7.  **Felhantering:** Om något steg misslyckas (fel ID, ej ägare, DB-fel), samlas fel i `$errors`. Sidan visar sedan dessa fel. I en mer sofistikerad app skulle man kanske lagra felet i sessionen och omdirigera tillbaka till admin-listan.

## 11. Adminpanel (`admin/index.php`)

Detta är huvudsidan för inloggade användare där de kan se sina inlägg och hantera dem.

**`admin/index.php`:**

```php
<?php
require_once '../includes/config.php'; // Ger session_start()

// ---- Session Check ----
if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php?redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit;
}
$logged_in_user_id = $_SESSION['user_id'];
$logged_in_username = $_SESSION['username'];
// ---- End Session Check ----

require_once '../includes/database.php';

$posts = []; // Array för användarens inlägg
$fetch_error = null;
$success_message = null; // För att visa meddelanden från create/update/delete

// Kolla efter success-meddelanden från omdirigeringar
if (isset($_GET['created']) && $_GET['created'] === 'success') {
    $success_message = "Nytt inlägg skapat!";
} elseif (isset($_GET['updated']) && $_GET['updated'] === 'success') {
    $success_message = "Inlägg (ID: " . htmlspecialchars($_GET['id'] ?? '') . ") uppdaterat!";
} elseif (isset($_GET['deleted']) && $_GET['deleted'] === 'success') {
     $success_message = "Inlägg (ID: " . htmlspecialchars($_GET['id'] ?? '') . ") raderat!";
}

try {
    $pdo = connect_db();
    // Hämta ENDAST den inloggade användarens inlägg
    $stmt = $pdo->prepare("SELECT id, title, created_at, updated_at
                           FROM posts
                           WHERE user_id = :user_id
                           ORDER BY created_at DESC");
    $stmt->bindParam(':user_id', $logged_in_user_id, PDO::PARAM_INT);
    $stmt->execute();
    $posts = $stmt->fetchAll();

} catch (PDOException $e) {
    error_log("Admin Index Error (User: $logged_in_user_id): " . $e->getMessage());
    $fetch_error = "Kunde inte hämta dina blogginlägg just nu.";
}

?>
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Enkel Blogg</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .actions a, .actions button { margin-right: 5px; padding: 3px 6px; text-decoration: none; border: 1px solid transparent; }
        .actions .edit-btn { background-color: #ffc107; color: black; border-color: #ffc107; }
        .actions .delete-btn { background-color: #dc3545; color: white; border: none; cursor: pointer; font-size: inherit; font-family: inherit;}
        .actions .edit-btn:hover { background-color: #e0a800; }
        .actions .delete-btn:hover { background-color: #c82333; }
        nav { margin-bottom: 20px; background-color: #f8f9fa; padding: 10px; border-radius: 5px; }
        nav a { margin-right: 15px; text-decoration: none; color: #007bff; }
        nav a:hover { text-decoration: underline; }
        .create-link { display: inline-block; margin-bottom: 20px; background-color: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; }
        .create-link:hover { background-color: #218838; }
        .error-message { color: red; border: 1px solid red; padding: 10px; margin-bottom: 20px; }
        .success-message { color: green; border: 1px solid green; padding: 10px; margin-bottom: 20px; }
    </style>
</head>
<body>

    <nav>
        <a href="../index.php">Visa Blogg</a>
        <a href="index.php">Admin Dashboard</a>
        <a href="../logout.php">Logga ut (<?php echo htmlspecialchars($logged_in_username); ?>)</a>
    </nav>

    <h1>Admin Dashboard</h1>
    <p>Välkommen, <?php echo htmlspecialchars($logged_in_username); ?>!</p>

    <a href="create_post.php" class="create-link">Skapa nytt inlägg</a>

    <?php if ($success_message): ?>
        <p class="success-message"><?php echo htmlspecialchars($success_message); ?></p>
    <?php endif; ?>

    <?php if ($fetch_error): ?>
        <p class="error-message"><?php echo htmlspecialchars($fetch_error); ?></p>
    <?php else: ?>
        <h2>Dina Inlägg</h2>
        <?php if (empty($posts)): ?>
            <p>Du har inte skapat några inlägg ännu.</p>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Titel</th>
                        <th>Skapad</th>
                        <th>Senast ändrad</th>
                        <th>Åtgärder</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($posts as $post): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($post['title']); ?></td>
                            <td><?php echo date('Y-m-d H:i', strtotime($post['created_at'])); ?></td>
                            <td><?php echo date('Y-m-d H:i', strtotime($post['updated_at'])); ?></td>
                            <td class="actions">
                                <a href="../post.php?id=<?php echo $post['id']; ?>" target="_blank">Visa</a>
                                <a href="edit_post.php?id=<?php echo $post['id']; ?>" class="edit-btn">Redigera</a>
                                <!-- Delete-knappen i ett eget formulär för POST -->
                                <form action="delete_post.php" method="post" style="display: inline;" onsubmit="return confirm('Är du säker på att du vill radera inlägget '<?php echo htmlspecialchars(addslashes($post['title'])); ?>'?');">
                                    <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                                    <button type="submit" class="delete-btn">Radera</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    <?php endif; ?>

</body>
</html>
```

**Förklaring av `admin/index.php`:**

1.  **Hämta Data:**
    *   Ansluter till databasen.
    *   Använder `$pdo->query()` för en enkel `SELECT`-fråga (eftersom inga användarparametrar behövs här är `query()` okej, men `prepare`/`execute` fungerar också).
    *   Använder `JOIN users ON posts.user_id = users.id` för att hämta författarens användarnamn (`users.username`) tillsammans med post-datan.
    *   Sorterar med `ORDER BY posts.created_at DESC` för att visa de senaste inläggen först.
    *   `$stmt->fetchAll()` hämtar alla matchande rader som en array av associativa arrayer.
    *   Felhantering med `try...catch`.
2.  **Navigation (`<nav>`):** Visar olika länkar beroende på om användaren är inloggad (`isset($_SESSION['user_id'])`). Visar användarnamnet om inloggad.
3.  **Fel/Succé-meddelanden:** Visar meddelande om utloggning lyckats, eller om det blev fel vid hämtning av inlägg.
4.  **Loopa igenom Inlägg:**
    *   Om inga fel och inlägg finns, visas en HTML-tabell.
    *   Loopar igenom `$posts`.
    *   Varje rad visar titel, datum och åtgärdsknappar:
        *   "Visa": Länk till den publika `post.php`.
        *   "Redigera": Länk till `edit_post.php` med rätt `id`.
        *   "Radera": Detta är en **knapp inuti ett litet formulär**. Formuläret skickar `post_id` via **POST** till `delete_post.php`. Detta är säkrare än en enkel GET-länk för radering. `onsubmit="return confirm(...)"` lägger till en JavaScript-bekräftelsedialog innan formuläret skickas. `addslashes()` används inuti JavaScript-strängen för att hantera eventuella citationstecken i titeln.

Nu har vi en fungerande, om än mycket enkel, bloggapplikation med grundläggande CRUD, autentisering, sessioner och bildhantering.

## 12. Refaktorering och Förbättringar

Koden ovan fungerar, men den är väldigt blandad (HTML, PHP-logik, databasfrågor i samma fil). I en större applikation blir detta snabbt ohanterligt. Här är några steg vi kan ta för att förbättra den:

### a) Separera Logik med Funktioner

Vi kan flytta återkommande kodblock, särskilt databasinteraktioner, till funktioner i `includes/functions.php`.

**Exempel (skapa `includes/functions.php`):**

```php
<?php
// includes/functions.php
require_once 'database.php'; // Behövs för att anropa connect_db()

/**
 * Hämtar ett specifikt inlägg från databasen.
 *
 * @param int $post_id ID för inlägget som ska hämtas.
 * @return array|false Post-datan som en associativ array, eller false om den inte hittas.
 * @throws PDOException Vid databasfel.
 */
function get_post_by_id(int $post_id): array|false {
    $pdo = connect_db();
    $stmt = $pdo->prepare("SELECT posts.*, users.username
                           FROM posts
                           JOIN users ON posts.user_id = users.id
                           WHERE posts.id = :id");
    $stmt->bindParam(':id', $post_id, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetch();
}

/**
 * Hämtar alla inlägg av en specifik användare.
 *
 * @param int $user_id Användarens ID.
 * @return array En array med alla användarens inlägg.
 * @throws PDOException Vid databasfel.
 */
function get_posts_by_user(int $user_id): array {
     $pdo = connect_db();
     $stmt = $pdo->prepare("SELECT id, title, created_at, updated_at
                            FROM posts
                            WHERE user_id = :user_id
                            ORDER BY created_at DESC");
     $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
     $stmt->execute();
     return $stmt->fetchAll();
}

// Lägg till fler funktioner för:
// - get_all_posts()
// - create_post(...)
// - update_post(...)
// - delete_post(...)
// - get_user_by_username(...)
// - create_user(...)
// etc.

?>
```

**Användning (t.ex. i `post.php`):**

```php
<?php
require_once 'includes/config.php';
// require_once 'includes/database.php'; // Behövs inte direkt om funktionen inkluderar den
require_once 'includes/functions.php'; // Inkludera funktionerna

$post_id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$post = null;
$fetch_error = null;

if ($post_id === false || $post_id <= 0) {
    $fetch_error = "Ogiltigt inläggs-ID.";
} else {
    try {
        $post = get_post_by_id($post_id); // Använd funktionen!
        if (!$post) {
            $fetch_error = "Inlägget hittades inte.";
        }
    } catch (PDOException $e) {
         error_log("View Post Error (ID: $post_id): " . $e->getMessage());
         $fetch_error = "Kunde inte hämta blogginlägget just nu.";
    }
}

// Resten av HTML-koden...
?>
```

### b) PHP Type Hinting

Genom att lägga till typdeklarationer för funktionsparametrar och returvärden (som i `functions.php`-exemplet ovan) kan vi göra koden tydligare och fånga vissa typer av fel tidigare.

*   `int $post_id`: Förväntar sig ett heltal som parameter.
*   `: array|false`: Funktionen förväntas returnera antingen en array eller `false`.
*   `: void`: Om en funktion inte returnerar något.

### c) Förbättrad Filstruktur (Exempel)

En vanlig förbättring är att separera HTML-presentationen från PHP-logiken med hjälp av "template"-filer.

```
.
├── config/
│   └── config.php
│   └── database.php
├── public/              <-- Web root (här pekar webbservern)
│   ├── admin/
│   │   └── index.php      # Hanterar logik, inkluderar template
│   │   └── create_post.php
│   │   └── edit_post.php
│   │   └── delete_post.php
│   ├── css/
│   │   └── style.css
│   ├── uploads/         # Fortfarande här, tillgänglig via webben
│   ├── index.php        # Hanterar logik, inkluderar template
│   ├── login.php
│   ├── logout.php
│   ├── post.php
│   └── register.php
├── src/                 # PHP-kod (inte direkt åtkomlig via webben)
│   └── functions.php    # Eller klasser för Posts, Users etc.
└── templates/           # HTML-mallar
    ├── admin/
    │   ├── index.view.php
    │   ├── create_post.view.php
    │   └── edit_post.view.php
    ├── partials/        # Återanvändbara delar
    │   ├── header.view.php
    │   ├── footer.view.php
    │   └── nav.view.php
    ├── index.view.php
    ├── login.view.php
    ├── post.view.php
    └── register.view.php
```

I denna struktur skulle t.ex. `public/index.php` innehålla PHP-koden för att hämta data och sedan inkludera `templates/index.view.php` för att visa den. `templates/index.view.php` skulle i sin tur inkludera `partials/header.view.php` etc.

### d) Ytterligare Förbättringar att Överväga

*   **Routing:** Istället för att ha en PHP-fil för varje URL, använda en "front controller" (`index.php`) och ett routing-bibliotek som dirigerar förfrågningar till rätt kod baserat på URL:en.
*   **Templating Engines:** Använda ett mallhanteringssystem som Twig för att ytterligare separera HTML och PHP och erbjuda funktioner som mall-arv.
*   **Objektorienterad Programmering (OOP):** Skapa klasser för `User` och `Post` för att kapsla in data och beteende.
*   **Dependency Injection:** Hantera beroenden (som databasanslutningen) på ett mer flexibelt sätt.
*   **Säkerhet:**
    *   **CSRF (Cross-Site Request Forgery) Tokens:** Lägga till dolda tokens i formulär (särskilt för POST-operationer som create, update, delete) för att förhindra CSRF-attacker.
    *   **XSS (Cross-Site Scripting) Prevention:** Vara ännu noggrannare med att sanera all output med `htmlspecialchars()` eller ett kontextmedvetet mallhanteringssystem.
    *   **File Upload Security:** Striktare validering av filtyper (inte bara lita på `$_FILES['type']`), eventuellt byta namn på filer, lagra filer utanför webbroten om möjligt.
*   **Felhantering:** Mer sofistikerad felhantering och loggning.

Denna lektion har gett en grundläggande men fungerande CRUD-applikation. Genom att bygga vidare på refaktoreringsidéerna kan du skapa mer robusta och underhållbara PHP-applikationer.

</rewritten_file>