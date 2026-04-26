# Del 5: Refaktorering med modellklass

I denna del förbättrar vi strukturen genom att samla databaslogik i en modellklass (`Post`). **Förutsättning:** Du har genomfört [Del 4: Uppdatera och radera](crud-app-4-update-delete.md).

Koden fungerar redan, men utan tydlig separering mellan sidlogik och SQL. Målet nu är att göra koden lättare att återanvända, testa och underhålla.

---

## Steg 1: Samla CRUD-logik i `Post`-modellen

Du har redan använt `Post` i Del 3 och Del 4. Nu gör vi modellen tydligare och konsekvent med type hints.

Skapa eller uppdatera `includes/Post.php`:

```php
<?php
declare(strict_types=1);

class Post
{
    public function __construct(private PDO $pdo)
    {
    }

    public function create(int $userId, string $title, string $body, ?string $imagePath): int
    {
        $stmt = $this->pdo->prepare(
            "INSERT INTO posts (user_id, title, body, image_path)
             VALUES (:user_id, :title, :body, :image_path)"
        );
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':title', $title);
        $stmt->bindValue(':body', $body);
        $stmt->bindValue(':image_path', $imagePath, $imagePath === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->execute();

        return (int) $this->pdo->lastInsertId();
    }

    public function showOne(int $id): array|false
    {
        $stmt = $this->pdo->prepare(
            "SELECT posts.*, users.username
             FROM posts
             JOIN users ON posts.user_id = users.id
             WHERE posts.id = :id"
        );
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch();
    }

    public function showAll(): array
    {
        $stmt = $this->pdo->query(
            "SELECT posts.*, users.username
             FROM posts
             JOIN users ON posts.user_id = users.id
             ORDER BY posts.created_at DESC"
        );
        return $stmt->fetchAll();
    }

    public function showAllByUser(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            "SELECT id, title, created_at, updated_at
             FROM posts
             WHERE user_id = :user_id
             ORDER BY created_at DESC"
        );
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function updateOne(int $id, int $userId, string $title, string $body, ?string $imagePath): bool
    {
        $stmt = $this->pdo->prepare(
            "UPDATE posts
             SET title = :title, body = :body, image_path = :image_path
             WHERE id = :id AND user_id = :user_id"
        );
        $stmt->bindValue(':title', $title);
        $stmt->bindValue(':body', $body);
        $stmt->bindValue(':image_path', $imagePath, $imagePath === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function deleteOne(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM posts WHERE id = :id AND user_id = :user_id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
```

---

## Steg 2: Jämför mot funktionsbaserad lösning

I en tidigare refaktorering kunde man skapa hjälpfunktioner som:

- `get_post_by_id(...)`
- `get_all_posts()`
- `get_posts_by_user(...)`

Det fungerar bra i små projekt. Men en modellklass ger tydligare ansvar när CRUD växer:

1. SQL för inlägg ligger i **en** fil (`Post.php`).
2. Metodnamn (`showOne`, `updateOne`) beskriver användningsfall tydligt.
3. Konstruktor med `PDO` gör klassen enkel att återanvända och testa.

---

## Steg 3: Type hints i modellen

Type hints gör API:t för modellen tydligt:

| Syntax | Betydelse |
|--------|-----------|
| `int $id` | Parametern måste vara heltal |
| `?string $imagePath` | Sträng eller `null` |
| `: array|false` | En rad eller inget resultat |
| `: array` | Lista med rader |
| `: bool` | Metoden returnerar sant/falskt |

Exempel: Om du råkar anropa `showOne("abc")` får du ett tydligt `TypeError` tidigt.

---

## Steg 4: Tunnare sidfiler

När modellen tar SQL-ansvaret blir sidfilerna enklare:

```php
<?php
require_once 'includes/config.php';
require_once 'includes/database.php';
require_once 'includes/Post.php';

$postModel = new Post(connect_db());
$posts = $postModel->showAll();
```

Nu läser sidan nästan som vanlig svenska: "skapa modell, hämta alla inlägg". Det gör koden lättare att följa för både dig och teamet.

---

## Ytterligare förbättringar att utforska

När du vill gå vidare kan du testa:

*   **CSRF-tokens:** Skydda create/update/delete-formulär mot CSRF.
*   **Validering i separata klasser:** Flytta valideringslogik från sidfiler till egna tjänster.
*   **Templates:** Separera HTML och PHP ytterligare.
*   **Transaktioner:** Vid avancerade flöden där flera databasoperationer måste lyckas tillsammans.
*   **Striktare filvalidering:** Kontrollera filinnehåll med `finfo_file()` vid uppladdning.

Du har nu en mer realistisk struktur: sidorna hanterar HTTP-flöde, modellen hanterar databaslogik.

---

**Föregående:** [Del 4: Uppdatera och radera](crud-app-4-update-delete.md)
