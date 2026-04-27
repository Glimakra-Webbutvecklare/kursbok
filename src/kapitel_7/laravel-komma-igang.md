# Komma igång med Laravel

I denna del får du ett Laravel-projekt igång och lär dig grundstrukturen. Vi bygger inte hela bloggen ännu – fokus är att förstå hur Laravel är uppbyggt. Du kommer att känna igen många koncept från [CRUD-appen](crud-app.md) – routing, vyer och databas – men nu hanteras de av ramverket.

**Förutsättning:** Du har läst [Introduktion till Laravel](laravel-intro.md).

---

## Förutsättningar

Samma som för CRUD-appen:

*   **PHP 8.2 eller senare** – kolla med `php -v`
*   **Composer** – PHP:s pakethanterare (`composer --version`)
*   **MySQL eller MariaDB** – för databasen (samma som i [Del 1: Setup och databas](crud-app-1-setup.md))

Om du körde CRUD-appen med Docker kan du använda samma `mysql`-service för Laravel.

---

## Installation

Skapa ett nytt Laravel-projekt med Composer:

```bash
composer create-project laravel/laravel blogg
cd blogg
```

**Exempel på utdata** (installationen tar några minuter):

```
Creating a "laravel/laravel" project at "./blogg"
...
> @php artisan key:generate --ansi
  INFO  Application key set successfully.
> @php artisan migrate --graceful --ansi
  INFO  Running migrations.
  0001_01_01_000000_create_users_table ........ DONE
  0001_01_01_000001_create_cache_table ........ DONE
  0001_01_01_000002_create_jobs_table .......... DONE
```

Alternativt kan du installera Laravel Installer globalt och använda:

```bash
laravel new blogg
```

Projektet skapas med alla nödvändiga filer. Det tar några minuter första gången.

**Kontrollera att det fungerar:** Efter installationen ska mappen `blogg` innehålla underkataloger som `app/`, `routes/`, `resources/` och `database/`.

---

## Projektstruktur (översikt)

Efter installationen ser du en mappstruktur. Här är de viktigaste delarna:

| Mapp/Fil | Syfte |
|----------|-------|
| `app/` | Huvudlogik – Models, Controllers, Middleware |
| `app/Http/Controllers/` | Controllers som hanterar förfrågningar |
| `app/Models/` | Eloquent-modeller (databasentiteter) |
| `routes/` | Definition av URL:er – `web.php` för webb, `api.php` för API |
| `resources/views/` | Blade-mallar (HTML med dynamiskt innehåll) |
| `database/migrations/` | Databasversionering – skapa och ändra tabeller |
| `.env` | Konfiguration som inte ska i Git (databas, nycklar) |

Jämfört med CRUD-appen: `routes/web.php` ersätter din filbaserade routing, `resources/views` ersätter inline PHP i HTML, och `app/Models` + Eloquent ersätter `connect_db()` och PDO-frågor.

---

## Konfiguration (.env)

Filen `.env` innehåller känslig och miljöspecifik konfiguration. Öppna den och sätt databasuppgifterna:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_fullstack
DB_USERNAME=db_user
DB_PASSWORD=db_password
```

Anpassa efter din miljö (t.ex. `DB_HOST=mysql` om du använder Docker). `APP_KEY` genereras automatiskt vid installation – den används för kryptering och sessioner.

**Kontrollera att det fungerar:** Starta servern med `php artisan serve` och öppna `http://localhost:8000`. Om du får databasfel, kontrollera att `.env` har rätt uppgifter och att databasen finns.

---

## Artisan – Laravels kommandorad

Laravel levereras med **Artisan**, ett verktyg för vanliga uppgifter:

```bash
php artisan serve
```

**Exempel på utdata:**

```
  INFO  Server running on [http://127.0.0.1:8000].

  Press Ctrl+C to stop the server
```

Startar en utvecklingsserver på `http://localhost:8000`. Öppna adressen i webbläsaren – du ska se Laravels välkomstsida.

Andra användbara kommandon:

```bash
php artisan migrate          # Kör migrations (skapar/uppdaterar tabeller)
php artisan make:controller  # Skapa en ny controller
php artisan make:model       # Skapa en ny model
php artisan route:list       # Lista alla definierade routes
```

**Exempel på utdata** för `php artisan route:list` (visar alla URL:er och vilka controllers som hanterar dem):

```
  GET|HEAD  / ......... HejController@index
  GET|HEAD  login ..... Auth\AuthenticatedSessionController@create
  POST     login ..... Auth\AuthenticatedSessionController@store
  ...
```

---

## Enkel testroute

Öppna `routes/web.php`. Du ser redan en route:

```php
Route::get('/', function () {
    return view('welcome');
});
```

Detta betyder: för GET-förfrågningar till `/`, returnera vyn `welcome`. Ändra till något enkelt för att testa:

```php
Route::get('/', function () {
    return 'Hej från Laravel!';
});
```

Ladda om sidan – du ska se texten istället för välkomstsidan.

### Via en controller

I stället för att skriva logik direkt i route-filen använder man ofta en controller. Skapa en:

```bash
php artisan make:controller HejController
```

**Exempel på utdata:**

```
  INFO  Controller [app/Http/Controllers/HejController.php] created successfully.
```

Öppna `app/Http/Controllers/HejController.php` och lägg till en metod:

```php
public function index()
{
    return 'Hej från HejController!';
}
```

I `routes/web.php`, ändra till:

```php
use App\Http\Controllers\HejController;

Route::get('/', [HejController::class, 'index']);
```

Nu hanteras `/` av `HejController::index`. Detta är MVC i miniatyr: routen pekar på en controller som returnerar ett svar.

---

## Blade – grunderna

Blade är Laravels templating-språk. Istället för att blanda PHP och HTML i samma fil (som i CRUD-appen) skriver du renare mallar.

Skapa en vy: `resources/views/hej.blade.php`:

```blade
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Hej</title>
</head>
<body>
    <h1>{{ $meddelande }}</h1>
</body>
</html>
```

`&#123;&#123; $meddelande &#125;&#125;` skriver ut variabeln och escap:ar automatiskt (skyddar mot XSS). Jämför med `<?php echo htmlspecialchars($meddelande); ?>` i CRUD-appen.

Uppdatera controllern för att skicka data till vyn:

```php
public function index()
{
    return view('hej', ['meddelande' => 'Välkommen till Laravel!']);
}
```

Ladda om – du ska se rubriken med meddelandet.

### Vanliga Blade-direktiv

| Direktiv | Exempel | Betydelse |
|----------|---------|-----------|
| `&#123;&#123; &#125;&#125;` | `&#123;&#123; $namn &#125;&#125;` | Skriv ut och escap:a |
| `@if` | `@if($inloggad) ... @endif` | Villkor |
| `@foreach` | `@foreach($posts as $post) ... @endforeach` | Loop över en lista |
| `@forelse` | `@forelse($posts as $post) ... @empty ... @endforelse` | Som foreach, men visar `@empty`-delen om listan är tom |
| `@error` | `@error('title') &#123;&#123; $message &#125;&#125; @enderror` | Visar valideringsfel för ett fält. `$message` innehåller felmeddelandet |
| `old()` | `value="&#123;&#123; old('title') &#125;&#125;"` | Återställer formulärvärde efter valideringsfel (så användaren inte behöver skriva om allt) |
| `@auth` | `@auth ... @endauth` | Visa bara om användaren är inloggad |
| `@csrf` | `@csrf` | Måste finnas i alla POST-formulär – genererar skydd mot CSRF-attacker |

**Tips:** Använd `@forelse` istället för `@foreach` när listan kan vara tom – då kan du visa ett meddelande som "Inga inlägg ännu". Använd `@error` och `old()` i formulär för att visa valideringsfel och behålla användarens input.

---

## I denna del har du lärt dig

*   Att installera ett Laravel-projekt med Composer
*   Projektstrukturen (app/, routes/, resources/views/, database/migrations/)
*   Att konfigurera `.env` för databasanslutning
*   Att använda Artisan (`serve`, `migrate`, `make:controller`, `make:model`)
*   Att skapa routes och koppla dem till controllers
*   Blade-grunderna: `&#123;&#123; &#125;&#125;`, `@if`, `@foreach`, `@forelse`, `@error`, `old()`, `@csrf`

---

**Föregående:** [Del 1: Varför ett ramverk?](laravel-intro.md) | **Nästa:** [Del 3: Setup och autentisering](laravel-crud-3-setup.md)
