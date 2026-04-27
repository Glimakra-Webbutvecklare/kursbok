# Del 5: Uppdatera och radera

I denna del implementerar vi redigering och radering – motsvarar [Del 4: Uppdatera och radera](crud-app-4-update-delete.md) i CRUD-appen. Vi använder en Policy för att säkerställa att användare bara kan redigera och radera sina egna inlägg.

**Förutsättning:** Du har genomfört [Del 4: Skapa och läsa inlägg](laravel-crud-4-create-read.md).

---

## Steg 1: Policy för ägarskap

> **Som i CRUD-appen:** I `edit_post.php` och `delete_post.php` skrev du:
> ```php
> if ($post['user_id'] != $logged_in_user_id) {
>     $errors[] = "Du har inte behörighet att redigera detta inlägg.";
> }
> ```
> Du upprepade denna kontroll i varje admin-fil. I Laravel samlar du behörighetslogiken i en Policy-klass – en enda plats att uppdatera.

Skapa policyn:

```bash
php artisan make:policy PostPolicy --model=Post
```

**Exempel på utdata:**

```
   INFO  Policy [app/Policies/PostPolicy.php] created successfully.
```

Öppna `app/Policies/PostPolicy.php` och uppdatera metoderna `update` och `delete`:

```php
public function update(User $user, Post $post): bool
{
    return $user->id === $post->user_id;
}

public function delete(User $user, Post $post): bool
{
    return $user->id === $post->user_id;
}
```

Laravel registrerar automatiskt policyn för Post-modellen. Vi använder den i nästa steg med `$this->authorize('update', $post)`.

---

## Steg 2: Redigera inlägg

Redigering kräver två routes – en för att visa formuläret (GET) och en för att spara ändringar (POST). I CRUD-appen hade du `edit_post.php` som hanterade båda med `$_SERVER['REQUEST_METHOD']`.

### Steg 2.1: Visningsrouten (GET)

Lägg till i `PostController`:

```php
public function edit(Post $post)
{
    $this->authorize('update', $post);
    return view('posts.edit', compact('post'));
}
```

`$this->authorize('update', $post)` anropar Policy:n. Om användaren inte äger inlägget returneras 403 Forbidden automatiskt.

Skapa `resources/views/posts/edit.blade.php`:

```blade
@extends('layouts.app')

@section('content')
<h1>Redigera blogginlägg</h1>

<form action="{{ route('posts.update', $post) }}" method="POST" enctype="multipart/form-data">
    @csrf
    <div>
        <label for="title">Titel:</label>
        <input type="text" id="title" name="title" value="{{ old('title', $post->title) }}" required>
        @error('title') <span style="color:red">{{ $message }}</span> @enderror
    </div>
    <div>
        <label for="body">Innehåll:</label>
        <textarea id="body" name="body" required>{{ old('body', $post->body) }}</textarea>
        @error('body') <span style="color:red">{{ $message }}</span> @enderror
    </div>
    @if($post->image_path)
        <div>
            <img src="{{ asset('storage/' . $post->image_path) }}" alt="" style="max-width: 200px;">
            <label><input type="checkbox" name="delete_image" value="1"> Ta bort nuvarande bild</label>
        </div>
    @endif
    <div>
        <label for="image">Ladda upp ny bild (ersätter nuvarande):</label>
        <input type="file" id="image" name="image" accept="image/jpeg,image/png,image/gif">
    </div>
    <button type="submit">Uppdatera inlägg</button>
</form>
@endsection
```

> **Som i CRUD-appen:** I `edit_post.php` skickade du formuläret till samma sida (`edit_post.php?id=...`) och kollade `$_SERVER['REQUEST_METHOD'] === 'POST'`. I Laravel använder du separata routes: GET visar formuläret, POST sparar ändringen. Du behöver inte lägga in `?id=` i URL:en – route model binding skickar in rätt post automatiskt.

> **Notera:** Formuläret använder `method="POST"` – samma metod som i CRUD-appen. I standard Laravel används `@method('PUT')` för edit-formulär, men vi håller oss till POST för att minimera nya koncept.

![Redigeringsformuläret](./assets/laravel-crud/del-5/del-5-edit-formular.png)

**Kontrollera att det fungerar:** Gå till `/admin` och klicka "Redigera" på ett inlägg. Du ska se formuläret med befintlig titel och innehåll. Om du försöker redigera ett inlägg som tillhör en annan användare ska du få 403 Forbidden.

---

### Steg 2.2: Spararouten (POST)

Lägg till `update()` i PostController:

```php
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post);

    $validated = $request->validate([
        'title' => 'required|max:255',
        'body' => 'required',
        'image' => 'nullable|image|max:5120',
        'delete_image' => 'nullable|boolean',
    ]);

    $path = $post->image_path;
    if (!empty($validated['delete_image']) && $path) {
        \Storage::disk('public')->delete($path);
        $path = null;
    }
    if ($request->hasFile('image')) {
        if ($path) \Storage::disk('public')->delete($path);
        $path = $request->file('image')->store('posts', 'public');
    }

    $post->update([
        'title' => $validated['title'],
        'body' => $validated['body'],
        'image_path' => $path,
    ]);

    return redirect()->route('posts.admin')->with('success', 'Inlägg uppdaterat!');
}
```

> **Som i CRUD-appen – bildhantering:** I `edit_post.php` skrev du ~50 rader för att hantera tre fall (behålla, ta bort, ersätta bild): `isset($_POST['delete_image'])`, `$_FILES['image']`, `file_exists()`, `unlink()`, `move_uploaded_file()` och städning vid databasfel. I Laravel gör `\Storage::disk('public')->delete($path)` samma sak som `unlink(UPLOAD_PATH . basename($path))`, och `$request->file('image')->store()` ersätter `move_uploaded_file()`.

---

## Steg 3: Radera inlägg

> **Som i CRUD-appen:** I `delete_post.php` skickade du ett POST-formulär med ett dolt `post_id`-fält. Här gör vi samma sak – men Laravel hämtar rätt inlägg via route model binding istället för `$_POST['post_id']`.

### Steg 3.1: destroy()-metoden

Lägg till i `PostController`:

```php
public function destroy(Post $post)
{
    $this->authorize('delete', $post);
    if ($post->image_path) {
        \Storage::disk('public')->delete($post->image_path);
    }
    $post->delete();
    return redirect()->route('posts.admin')->with('success', 'Inlägg raderat!');
}
```

### Steg 3.2: Radera-knapp i admin-panelen

Uppdatera `resources/views/posts/admin.blade.php` – ersätt kommentaren `<!-- Radera-knapp kommer i Del 5 -->` med:

```blade
<form action="{{ route('posts.destroy', $post) }}" method="POST"
      onsubmit="return confirm('Är du säker på att du vill radera detta inlägg?');">
    @csrf
    <button type="submit">Radera</button>
</form>
```

> **Som i CRUD-appen:** I `admin/index.php` hade du ett POST-formulär med `<input type="hidden" name="post_id">`. Här sköter route model binding det – inläggets ID finns redan i URL:en (`/admin/posts/3/delete`), så du behöver inget dolt fält. `@csrf` skyddar mot CSRF-attacker (något CRUD-appen saknade).

**Kontrollera att det fungerar:** Klicka "Radera" på ett inlägg. Du ska få en bekräftelsedialog. Bekräfta – inlägget ska försvinna från listan.

![Bekräftelsedialog innan radering av inlägg](./assets/laravel-crud/del-5/del-5-delete-bekraftelse.png)

---

## Jämförelse: Vanilla PHP vs. Laravel

| Uppgift | CRUD-app (vanilla PHP) | Laravel |
|---------|----------------------|---------|
| **Autentisering** | `register.php`, `login.php`, `logout.php`, `session_start`, `password_hash` | Laravel Breeze – färdigt |
| **Skydda admin-sidor** | `if (!isset($_SESSION['user_id']))` i varje fil | `Route::middleware('auth')` – en rad |
| **Databasfrågor** | PDO, `prepare`, `bindParam`, `fetch` | Eloquent: `Post::with('user')->get()` |
| **Hämta ett inlägg** | `filter_input` + `$post_model->showOne($id)` | Route model binding: `show(Post $post)` |
| **Validering** | `$errors[]`, `empty()`, `filter_var()` | `$request->validate([...])` |
| **Vyer** | PHP och HTML blandat, `htmlspecialchars()` | Blade: `{{ $post->title }}` (escapas automatiskt) |
| **Ägarskap** | `$post['user_id'] != $logged_in_user_id` i varje fil | Policy: `$this->authorize('update', $post)` |
| **Bilduppladdning** | `$_FILES`, `move_uploaded_file()`, `uniqid()` | `$request->file()->store('posts', 'public')` |
| **Ta bort bild** | `file_exists()` + `unlink()` | `\Storage::disk('public')->delete($path)` |
| **CSRF-skydd** | Inte implementerat | `@csrf` i varje formulär |
| **Formulärdata kvar vid fel** | `value="<?php echo htmlspecialchars($title); ?>"` | `{{ old('title') }}` (automatiskt escaped) |
| **Radera via POST** | `<form method="post">` med dolt `post_id`-fält | `<form method="POST">` med route model binding |
| **Sessionsmeddelanden** | `$_GET['created=success']` i URL:en | `->with('success', '...')` + `session('success')` |

I vanilla PHP skrev du hundratals rader för auth, routing och infrastruktur. I Laravel fokuserar du på applikationslogiken – ramverket löser resten.

---

## I denna del har du lärt dig

*   Att använda Policies för att centralisera behörighetslogik (ägarskap)
*   Att anropa `$this->authorize('update', $post)` för att skydda edit/update/delete
*   Att uppdatera och radera poster med Eloquent, samt ta bort associerade filer från storage
*   Att använda POST-formulär för både uppdatering och radering
*   Hur CRUD-appens manuella kod motsvaras av Laravel-funktioner

---

**Föregående:** [Del 4: Skapa och läsa inlägg](laravel-crud-4-create-read.md) | **Nästa:** [Sessioner och cookies](../sessions.md)