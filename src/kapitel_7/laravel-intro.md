# Varför ett ramverk? Introduktion till Laravel

Nu när du har byggt en CRUD-applikation med vanilla PHP vet du hur mycket kod som krävs för grundläggande saker: session-kontroll i varje fil, `require_once` överallt, PDO-frågor utspridda, manuell validering med `$errors[]` och `htmlspecialchars()` på varje utskrift. Applikationen fungerar – men mycket av koden handlar om infrastruktur, inte om applikationens logik.

Det är här ett ramverk som Laravel kommer in. I de kommande delarna bygger vi samma bloggapplikation igen, och du får se hur Laravel ersätter mycket av den manuella koden.

**Förutsättning:** Du har genomfört [CRUD-applikationen](crud-app.md) (alla fem delar).

---

## Återkoppling till CRUD-appen

Vad upprepade du mest när du byggde bloggen?

*   **Session-kontroll i varje admin-fil:** I början av `admin/index.php`, `admin/create_post.php`, `admin/edit_post.php` och `admin/delete_post.php` lade du samma kod: `if (!isset($_SESSION['user_id'])) { header('Location: ...'); exit; }`. Fyra filer, samma logik.
*   **Manuell `require_once`:** Varje sida inkluderade `config.php`, `database.php` och ibland `functions.php`. Glömde du en fil fick du fel.
*   **PDO i varje fil:** Du anropade `connect_db()` och skrev prepared statements överallt. SQL-frågor låg utspridda i många filer.
*   **Formulärvalidering:** I `register.php`, `login.php`, `create_post.php` och `edit_post.php` skrev du liknande validering – `empty()`, `filter_var()`, `strlen()` – och samlade fel i `$errors[]`.
*   **`htmlspecialchars()` överallt:** Varje gång du skrev ut användardata i HTML behövde du komma ihåg att escap:a för att undvika XSS.
*   **Routing:** Vilken fil som hanterar vilken URL bestämdes av filstrukturen. `post.php?id=3` – vad händer om du vill ha `blogg/3` istället?

Detta är inte fel – det är naturligt när man bygger utan ramverk. Men det blir mycket kod som inte handlar om din applikations *logik*, utan om infrastruktur.

---

## Vad ett ramverk löser

Ett ramverk som Laravel adresserar många av dessa problem genom att erbjuda:

### Konvention över konfiguration

Du behöver inte uppfinna var saker ska ligga. Laravel har en tydlig struktur: Controllers i `app/Http/Controllers`, vyer i `resources/views`, modeller i `app/Models`. Nya utvecklare som känner till Laravel kan direkt orientera sig i ett projekt. Färre beslut, konsekvent struktur.

### Inbyggd säkerhet

*   **CSRF:** Laravel genererar och validerar automatiskt tokens för formulär – skyddar mot Cross-Site Request Forgery.
*   **XSS:** Blade-mallar escap:ar utdata som standard (`&#123;&#123; $variabel &#125;&#125;`).
*   **SQL injection:** Eloquent (Laravels ORM) använder prepared statements under huven.

Du behöver inte komma ihåg dessa saker varje gång – ramverket gör dem åt dig.

### Routing

Alla URL:er definieras på en plats (`routes/web.php`). Du kan skriva `Route::get('/blogg/{id}', ...)` istället för att förlita dig på filnamn. Det gör det enklare att ändra URL-struktur och att förstå vilken kod som körs för vilken adress.

### Separation of concerns (MVC)

*   **Model:** Databaslogik – hur data lagras och hämtas.
*   **View:** HTML och presentation – vad användaren ser.
*   **Controller:** Hanterar förfrågningar, anropar modeller, skickar data till vyer.

I din CRUD-app låg allt i samma filer – SQL, validering och HTML blandades. Med MVC blir varje del tydligare och lättare att underhålla.

---

## Laravel i PHP-ekosystemet

Laravel är ett av de mest använda PHP-ramverken. Det betyder:

*   **Bra dokumentation** – officiell guide och API-referens.
*   **Stort community** – tutorials, paket, svar på frågor.
*   **Efterfrågat i arbetslivet** – många företag använder Laravel.

Om du förstår grunderna i PHP (som du nu gör) är Laravel ett naturligt nästa steg för att bygga större applikationer.

---

## När ett ramverk är lämpligt

Ett ramverk är inte alltid rätt val:

*   **Små, enkla sidor:** En statisk sida eller ett enkelt kontaktformulär behöver kanske inte Laravel. Vanlig PHP eller till och med en statisk generator kan räcka.
*   **Applikationer som växer:** När du har användare, inloggning, databas, många sidor och formulär – då sparar ett ramverk tid och minskar fel.

Din bloggapplikation ligger precis i gränslandet. Du *kan* bygga den utan ramverk (som du gjort), men med Laravel hade samma funktionalitet krävt mindre kod och färre saker att komma ihåg.

---

## I denna del har du lärt dig

*   Vad som upprepas mest i en ramverkslös PHP-app (session-kontroll, PDO, validering, routing)
*   Vad ett ramverk som Laravel löser (konvention, säkerhet, routing, MVC)
*   När ett ramverk är lämpligt och när det inte behövs

---

**Föregående:** [Del 5: Refaktorering](crud-app-5-refaktorering.md) | **Nästa:** [Del 2: Komma igång](laravel-komma-igang.md)
