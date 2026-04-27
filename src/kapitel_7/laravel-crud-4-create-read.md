# Del 4: Skapa och läsa inlägg

I denna del implementerar vi Create och Read – motsvarar [Del 3: Skapa och läsa inlägg](crud-app-3-create-read.md) i CRUD-appen. Vi bygger steg för steg: först routes och grundstruktur, sedan skapa inlägg utan bild, därefter lista och visa, admin-panel och till sist bilduppladdning.

**Förutsättning:** Du har genomfört [Del 3: Setup och autentisering](laravel-crud-3-setup.md).

---

## Steg 1: Routes och grundläggande PostController

Vi börjar med att definiera alla URL:er i en fil – `routes/web.php`. I CRUD-appen bestämdes routingen av filstrukturen (`admin/create_post.php`, `post.php?id=3` osv.). Nu samlar vi allt på ett ställe.

Skapa controllern:

```bash
php artisan make:controller PostController
```

**Exempel på utdata:**

```
   INFO  Controller [app/Http/Controllers/PostController.php] created successfully.
```

Lägg till i `routes/web.php`:

```php
use App\Http\Controllers\PostController;

Route::get('/', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

Route::middleware('auth')->group(function () {
    Route::get('/admin', [PostController::class, 'admin'])->name('posts.admin');
    Route::get('/admin/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/admin/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/admin/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::post('/admin/posts/{post}/edit', [PostController::class, 'update'])->name('posts.update');
    Route::post('/admin/posts/{post}/delete', [PostController::class, 'destroy'])->name('posts.destroy');
});
```

> **Om RESTful routes:** I Laravel-projekt är det vanligt att använda `Route::put()` för uppdatering och `Route::delete()` för radering – så kallade RESTful routes. HTML-formulär stödjer bara GET och POST, så Laravel använder då `@method('PUT')` som ett dolt fält. I denna kurs håller vi oss till GET och POST för att hålla antalet nya koncept nere. Principerna är desamma.

**Nya koncept i routen:**

*   **`Route::middleware('auth')`** – Skyddar admin-routes. Som i CRUD-appen skrev du `if (!isset($_SESSION['user_id']))` i varje admin-fil. Här räcker en rad.
*   **`{post}` i URL:en** – Route model binding. Laravel hämtar automatiskt Post-modellen baserat på ID. I CRUD-appen använde du `filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT)` och `$post_model->showOne($id)`.
*   **`name('posts.store')`** – Namnger routen så att du kan referera till den i vyer med `route('posts.store')`. I CRUD-appen skrev du `action="create_post.php"`.

Implementera temporära metoder i `PostController`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('user')->latest()->get();
        return view('posts.index', compact('posts'));
    }

    public function show(Post $post)
    {
        return view('posts.show', compact('post'));
    }

    public function admin()
    {
        $posts = auth()->user()->posts()->latest()->get();
        return view('posts.admin', compact('posts'));
    }

    public function create()
    {
        return view('posts.create');
    }

    public function store(Request $request)
    {
        return redirect()->route('posts.admin');
    }
}
```

Skapa mappen `resources/views/posts/` och två minimala vyer.

`index.blade.php`:

```blade
@extends('layouts.app')

@section('content')
<h1>Välkommen till Bloggen!</h1>
@forelse($posts as $post)
    <p>{{ $post->title }}</p>
@empty
    <p>Det finns inga blogginlägg ännu.</p>
@endforelse
@endsection
```

`admin.blade.php`:

```blade
@extends('layouts.app')

@section('content')
<h1>Admin Dashboard</h1>
<p>Välkommen, {{ auth()->user()->name }}!</p>
<a href="{{ route('posts.create') }}">Skapa nytt inlägg</a>
@foreach($posts as $post)
    <p>{{ $post->title }}</p>
@endforeach
@endsection
```

**Kontrollera att det fungerar:** Gå till `/`. Om du har testinlägget från Del 3 (Tinker) ska du se det. Logga in och gå till `/admin` – du ska se admin-panelen.

---

## Steg 2: Skapa inlägg – utan bild

Nu lägger vi till formuläret och `store()`-metoden. Vi börjar utan bilduppladdning så att grundlogiken fungerar.

Uppdatera `store()` i PostController:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|max:255',
        'body' => 'required',
    ]);

    auth()->user()->posts()->create([
        'title' => $validated['title'],
        'body' => $validated['body'],
        'image_path' => null,
    ]);

    return redirect()->route('posts.admin')->with('success', 'Nytt inlägg skapat!');
}
```

> **Som i CRUD-appen:** I `create_post.php` skrev du:
> ```php
> if (empty($title)) {
>     $errors[] = 'Titel är obligatoriskt.';
> }
> ```
> I Laravel gör `$request->validate(...)` samma sak – och mer: max-längd, XSS-skydd och automatisk felåtergivning.

Skapa `resources/views/posts/create.blade.php`:

```blade
@extends('layouts.app')

@section('content')
<h1>Skapa nytt blogginlägg</h1>

<form action="{{ route('posts.store') }}" method="POST">
    @csrf
    <div>
        <label for="title">Titel:</label>
        <input type="text" id="title" name="title" value="{{ old('title') }}" required>
        @error('title') <span style="color:red">{{ $message }}</span> @enderror
    </div>
    <div>
        <label for="body">Innehåll:</label>
        <textarea id="body" name="body" required>{{ old('body') }}</textarea>
        @error('body') <span style="color:red">{{ $message }}</span> @enderror
    </div>
    <button type="submit">Spara inlägg</button>
</form>
@endsection
```

> **Som i CRUD-appen:** I `create_post.php` skrev du `value="<?php echo htmlspecialchars($title); ?>"` för att behålla indata vid fel. I Blade gör `{{ old('title') }}` samma sak – och escapas automatiskt, inget `htmlspecialchars` behövs.

**Två viktiga Blade-direktiv:**
*   `@csrf` – Genererar ett dolt fält som skyddar mot CSRF-attacker. I CRUD-appen hade vi inget CSRF-skydd.
*   `@error('title')` – Visar valideringsfel för just det fältet. I CRUD-appen loopade du `$errors` manuellt.

![Formulär för att skapa nytt inlägg](./assets/laravel-crud/del-4/del-4-create-formular.png)

**Kontrollera att det fungerar:** Logga in, gå till `/admin/posts/create`. Skapa ett inlägg. Testa att skicka formuläret tomt – du ska se valideringsfel.

---

## Steg 3: Admin-panel och lista

Skapa admin-vyn med tabell över dina inlägg:

```blade
@extends('layouts.app')

@section('content')
<h1>Admin Dashboard</h1>
<p>Välkommen, {{ auth()->user()->name }}!</p>

@if(session('success'))
    <p style="color:green">{{ session('success') }}</p>
@endif

<a href="{{ route('posts.create') }}">Skapa nytt inlägg</a>

<table>
    <thead>
        <tr><th>Titel</th><th>Skapad</th><th>Åtgärder</th></tr>
    </thead>
    <tbody>
        @foreach($posts as $post)
        <tr>
            <td>{{ $post->title }}</td>
            <td>{{ $post->created_at->format('Y-m-d H:i') }}</td>
            <td>
                <a href="{{ route('posts.show', $post) }}">Visa</a>
                <a href="{{ route('posts.edit', $post) }}">Redigera</a>
                <!-- Radera-knapp kommer i Del 5 -->
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
```

> **Som i CRUD-appen:** I `admin/index.php` visade du inlägg med `foreach ($posts as $post)` och `htmlspecialchars()` på varje utskrift. Här gör `{{ $post->title }}` samma sak – escapas automatiskt.

**Kontrollera att det fungerar:** Gå till `/admin`. Du ska se dina inlägg i en tabell. Skapa ett inlägg – du ska se meddelandet "Nytt inlägg skapat!".

---

## Steg 4: Förbättra index och show

Uppdatera startsidan så att den visar mer information:

```blade
@extends('layouts.app')

@section('content')
<h1>Välkommen till Bloggen!</h1>

@forelse($posts as $post)
    <article>
        <h2>{{ $post->title }}</h2>
        <p>Publicerad {{ $post->created_at->format('Y-m-d H:i') }} av {{ $post->user->name }}</p>
        <p>{{ Str::limit($post->body, 200) }}</p>
        <a href="{{ route('posts.show', $post) }}">Läs mer &raquo;</a>
    </article>
@empty
    <p>Det finns inga blogginlägg ännu.</p>
@endforelse
@endsection
```

Skapa `resources/views/posts/show.blade.php`:

```blade
@extends('layouts.app')

@section('content')
<article>
    <h1>{{ $post->title }}</h1>
    <p>Publicerad {{ $post->created_at->format('Y-m-d H:i') }} av {{ $post->user->name }}</p>
    <div>{!! nl2br(e($post->body)) !!}</div>
</article>
<a href="{{ route('posts.index') }}">&laquo; Tillbaka</a>
@endsection
```

> **Som i CRUD-appen:** I `post.php` skrev du `htmlspecialchars($post['title'])` och `nl2br()` för radbrytningar. Här gör `{{ $post->title }}` escaping automatiskt. För radbrytningar använder vi `nl2br(e($post->body))`.

**Kontrollera att det fungerar:** Gå till `/`. Klicka "Läs mer" på ett inlägg – du ska se hela inlägget.

![Startsidan med listan över blogginlägg](./assets/laravel-crud/del-4/del-4-index-med-inlagg.png)

![Enskilt blogginlägg](./assets/laravel-crud/del-4/del-4-post-enskilt.png)

---

## Steg 5: Bilduppladdning

> **Som i CRUD-appen:** I Del 3 skrev du ~30 rader för bilduppladdning: validering av filtyp/storlek, `uniqid()`, `move_uploaded_file()` och felhantering. I Laravel gör `$request->file('image')->store('posts', 'public')` allt detta i en rad.

Uppdatera `store()` i PostController:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|max:255',
        'body' => 'required',
        'image' => 'nullable|image|max:7168',
    ]);

    $path = null;
    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('posts', 'public');
    }

    auth()->user()->posts()->create([
        'title' => $validated['title'],
        'body' => $validated['body'],
        'image_path' => $path,
    ]);

    return redirect()->route('posts.admin')->with('success', 'Nytt inlägg skapat!');
}
```

Lägg till `enctype="multipart/form-data"` och bildfältet i `create.blade.php`:

```blade
<form action="{{ route('posts.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <div>
        <label for="title">Titel:</label>
        <input type="text" id="title" name="title" value="{{ old('title') }}" required>
        @error('title') <span style="color:red">{{ $message }}</span> @enderror
    </div>
    <div>
        <label for="body">Innehåll:</label>
        <textarea id="body" name="body" required>{{ old('body') }}</textarea>
        @error('body') <span style="color:red">{{ $message }}</span> @enderror
    </div>
    <div>
        <label for="image">Bild (valfritt, max 7 MB):</label>
        <input type="file" id="image" name="image" accept="image/jpeg,image/png,image/gif">
        @error('image') <span style="color:red">{{ $message }}</span> @enderror
    </div>
    <button type="submit">Spara inlägg</button>
</form>
```

Lägg till bildvisning i `index.blade.php` (inuti `@forelse`-loopen, före `<h2>`):

```blade
@if($post->image_path)
    <img src="{{ asset('storage/' . $post->image_path) }}" alt="" style="max-width: 150px;">
@endif
```

Och i `show.blade.php` (efter rubriken):

```blade
@if($post->image_path)
    <img src="{{ asset('storage/' . $post->image_path) }}" alt="{{ $post->title }}" style="max-width: 100%;">
@endif
```

Skapa symbolisk länk för uppladdningar:

```bash
php artisan storage:link
```

> **Som i CRUD-appen:** I CRUD-appen sparade du bilder i `uploads/` och refererade med `BASE_URL . '/' . $post['image_path']`. I Laravel sparas filer i `storage/app/public/` och nås via `asset('storage/' . $post->image_path)`.

---

## Uppdatera startsidan

Breeze sätter som standard `/` som dashboard. Vi vill att `/` alltid visar postlistan. Leta efter eventuell Breeze-route för `/` i `routes/web.php` eller `routes/auth.php` och ta bort/kommentera bort den. Vår `PostController`-route för `/` ska gälla.

---

## Vanliga problem

| Problem | Lösning |
|---------|---------|
| **Bilder visas inte** | Kör `php artisan storage:link`. Kontrollera att filen finns i `storage/app/public/posts/`. |
| **404 på `/posts/1`** | Route model binding kräver att parametern heter `{post}` (singular) och att metoden tar `Post $post`. |
| **Valideringsfel visas inte** | Kontrollera att du har `@error('fältnamn')` i formuläret och att `old('fältnamn')` används. |
| **403 eller redirect till login på /admin** | Du måste vara inloggad. Gå till `/login` först. |
| **Class "Post" not found** | Kontrollera att du har `use App\Models\Post;` högst upp i PostController. |

---

## I denna del har du lärt dig

*   Att definiera routes med middleware för att skydda admin-sidor
*   Att använda route model binding (`{post}` → `Post $post`)
*   Att validera formulär med `$request->validate()`
*   Att använda Blade-direktiv som `@forelse`, `@error` och `old()` i formulär
*   Att ladda upp filer med `$request->file()->store()` och `storage:link`
*   Hur CRUD-appens manuella kod motsvaras av Laravel-funktioner

---

**Föregående:** [Del 3: Setup och autentisering](laravel-crud-3-setup.md) | **Nästa:** [Del 5: Uppdatera och radera](laravel-crud-5-update-delete.md)