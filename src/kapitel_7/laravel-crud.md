# CRUD-applikation med Laravel

I detta avsnitt bygger vi samma bloggapplikation som i [CRUD-appen](crud-app.md) – men med Laravel. Du får se hur ramverket ersätter mycket av den manuella koden och introducerar nya koncept steg för steg.

**Applikationens funktioner (samma som CRUD-appen):**

*   Användare kan registrera sig och logga in.
*   Inloggade användare kan skapa, redigera och ta bort sina egna blogginlägg.
*   Användare kan ladda upp en bild till varje blogginlägg.
*   Alla besökare kan se listan över blogginlägg och läsa enskilda inlägg.
*   En admin-sektion för inloggade användare att hantera sina inlägg.

## Läsordning

Lektionen är uppdelad i följande delar. Följ dem i ordning:

1.  **[Del 1: Varför ett ramverk?](laravel-intro.md)** – Motivation, vad ett ramverk löser, när det är lämpligt
2.  **[Del 2: Komma igång](laravel-komma-igang.md)** – Installation, projektstruktur, Artisan, Blade-grund
3.  **[Del 3: Setup och autentisering](laravel-crud-3-setup.md)** – Laravel Breeze, migrations, modeller
4.  **[Del 4: Skapa och läsa inlägg](laravel-crud-4-create-read.md)** – PostController, routes, Blade-vyer, bilduppladdning
5.  **[Del 5: Uppdatera och radera](laravel-crud-5-update-delete.md)** – Edit, delete, Policy för ägarskap

**Förutsättningar:** Du har genomfört [CRUD-applikationen](crud-app.md) (alla fem delar) och [Komma igång med Laravel](laravel-komma-igang.md).

## Vanliga problem

Om du stöter på problem under lektionerna kan följande hjälpa. [Del 4](laravel-crud-4-create-read.md) har en mer detaljerad felsökningssektion.

| Problem | Lösning |
|---------|---------|
| **Bilder visas inte** | Kör `php artisan storage:link`. Kontrollera att filen finns i `storage/app/public/posts/`. |
| **404 på `/posts/1`** | Route model binding kräver `{post}` (singular) i routen och `Post $post` i metoden. |
| **Valideringsfel visas inte** | Använd `@error('fältnamn')` i formuläret och `old('fältnamn')` för att återställa värden. |
| **403 eller redirect till login på /admin** | Du måste vara inloggad. Gå till `/login` först. |
| **Class "Post" not found** | Lägg till `use App\Models\Post;` högst upp i PostController. |
| **Breeze använder e-post, inte användarnamn** | Det är Laravels standard. Registrering och inloggning finns på `/register` och `/login`. |
