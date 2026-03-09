# Funktionell PHP

PHP är ett **multi-paradigm-språk** – det stödjer både objektorienterad programmering (OOP) och funktionell programmering. I detta avsnitt utforskar vi PHP:s funktionella sida: anonyma funktioner, closures, scope och de kraftfulla array-funktionerna som låter dig skriva renare och mer uttrycksfull kod.

## Varför funktionell programmering?

Funktionell programmering betonar att använda **funktioner** som första klassens medborgare – de kan skickas som argument, returneras från andra funktioner och lagras i variabler. Detta leder till flera fördelar:

*   **Läsbarhet:** Kod som använder `array_map`, `array_filter` och `array_reduce` uttrycker ofta *vad* som ska göras, inte *hur* steg för steg. "Filtrera de som är aktiva, mappa till namn" är tydligare än en lång `foreach`-loop med flera `if`-satser.
*   **Oföränderlighet (Immutability):** Funktionella array-metoder returnerar nya arrayer istället för att modifiera originalet. Det minskar risken för oväntade sidoeffekter och gör koden lättare att felsöka.
*   **Testbarhet:** Rena funktioner – som bara beror på sina argument och inte på globalt tillstånd – är enkla att testa i isolering.
*   **Komposabilitet:** Små funktioner kan kombineras till större beteenden. Du bygger komplex logik av enkla byggblock.
*   **Mindre buggar:** Färre variabler som muteras, färre loopar med räknare – mindre yta för fel.

PHP är inte ett rent funktionellt språk (som Haskell), men du kan tillämpa funktionella principer för att skriva bättre PHP-kod.

## Anonyma funktioner

En **anonym funktion** (även kallad lambda eller closure) är en funktion utan namn. Du skapar den med `function`-nyckelordet och kan tilldela den till en variabel eller skicka den direkt som argument.

```php
<?php
// Tilldela till variabel
$double = function($x) {
    return $x * 2;
};
echo $double(5); // 10

// Skicka som argument
$numbers = [1, 2, 3, 4, 5];
$squared = array_map(function($n) {
    return $n * $n;
}, $numbers);
print_r($squared); // [1, 4, 9, 16, 25]
?>
```

Anonyma funktioner är särskilt användbara som **callbacks** – funktioner som skickas till andra funktioner för att anropas vid ett senare tillfälle.

## Scope och `use`

En anonym funktion har sin egen **scope**. Variabler från den omgivande scope:n (t.ex. från den funktion där den definieras) är *inte* automatiskt tillgängliga inuti den anonyma funktionen. För att "fånga" variabler från omgivningen använder du `use`:

```php
<?php
$factor = 10;

// Utan use – $factor är inte definierad inuti!
// $multiply = function($x) { return $x * $factor; }; // Undefined variable!

// Med use – $factor fångas vid skapandet
$multiply = function($x) use ($factor) {
    return $x * $factor;
};
echo $multiply(3); // 30

// use fångar värdet vid skapandet (by value)
$counter = 0;
$increment = function() use ($counter) {
    return $counter + 1; // $counter är alltid 0 här – en kopia!
};
echo $increment(); // 1
echo $increment(); // 1 (inte 2 – $counter i closure är fortfarande 0)

// För att modifiera: använd referens med &
$counter2 = 0;
$incrementRef = function() use (&$counter2) {
    $counter2++;
    return $counter2;
};
echo $incrementRef(); // 1
echo $incrementRef(); // 2
?>
```

**Sammanfattning:** `use ($var)` fångar variabelns *värde* vid skapandet. `use (&$var)` fångar en *referens*, så ändringar inuti closure:n påverkar originalet.

## Arrow-funktioner (PHP 7.4+)

Arrow-funktioner (`fn`) är en kortare syntax för enkla anonyma funktioner. De fångar automatiskt variabler från omgivande scope – ingen `use` behövs. De är begränsade till ett enda uttryck som returneras.

```php
<?php
$numbers = [1, 2, 3, 4, 5];
$factor = 2;

// Arrow-funktion – $factor fångas automatiskt
$doubled = array_map(fn($n) => $n * $factor, $numbers);

// Motsvarar:
// array_map(function($n) use ($factor) { return $n * $factor; }, $numbers);
?>
```

Samma princip gäller för `array_filter` och `array_reduce` – arrow-funktioner gör koden mer koncis.

## Array-funktioner: map, filter, reduce

Dessa tre funktioner är ryggraden i funktionell array-bearbetning. De är direkt jämförbara med `map`, `filter` och `reduce` i JavaScript.

### `array_map` – Transformera varje element

`array_map(callback, array)` applicerar en callback på varje element och returnerar en ny array med resultaten.

```php
<?php
$prices = [100, 200, 300];
$withTax = array_map(function($price) {
    return $price * 1.25; // 25% moms
}, $prices);
// [125, 250, 375]

$names = ["anna", "bertil", "cecilia"];
$capitalized = array_map(fn($name) => ucfirst($name), $names);
// ["Anna", "Bertil", "Cecilia"]

// Med flera arrayer – callback får ett argument från varje array
$first = [1, 2, 3];
$second = [10, 20, 30];
$sums = array_map(fn($a, $b) => $a + $b, $first, $second);
// [11, 22, 33]
?>
```

### `array_filter` – Filtrera element

`array_filter(array, callback)` behåller endast element där callback returnerar `true`. Utan callback tas "falsy"-värden bort (`null`, `0`, `""`, `false`).

```php
<?php
$numbers = [1, 2, 3, 4, 5, 6];
$evens = array_filter($numbers, fn($n) => $n % 2 === 0);
// [2, 4, 6]

$users = [
    ['name' => 'Anna', 'active' => true],
    ['name' => 'Bertil', 'active' => false],
    ['name' => 'Cecilia', 'active' => true],
];
$activeUsers = array_filter($users, fn($u) => $u['active']);

// Utan callback – tar bort "tomma" värden
$mixed = [0, 1, "", "hej", null, false, 42];
$truthy = array_filter($mixed);
// [1, "hej", 42]
?>
```

**OBS:** `array_filter` behåller nycklarna. Använd `array_values()` om du vill återställa numeriska index.

### `array_reduce` – Reducera till ett värde

`array_reduce(array, callback, initial)` applicerar callback på varje element och ackumulerar till ett enda värde. Callback tar två argument: *carry* (ackumulatorn) och *item* (aktuellt element).

```php
<?php
$numbers = [1, 2, 3, 4, 5];
$sum = array_reduce($numbers, fn($carry, $n) => $carry + $n, 0);
// 15

$product = array_reduce($numbers, fn($carry, $n) => $carry * $n, 1);
// 120

$words = ["Hej", " ", "världen", "!"];
$sentence = array_reduce($words, fn($carry, $w) => $carry . $w, "");
// "Hej världen!"
?>
```

### Fler användbara funktioner

| Funktion | Beskrivning | JavaScript-motsvarighet |
|----------|-------------|-------------------------|
| `array_map($callback, $array)` | Transformera varje element | `array.map()` |
| `array_filter($array, $callback)` | Filtrera element | `array.filter()` |
| `array_reduce($array, $callback, $initial)` | Reducera till ett värde | `array.reduce()` |
| `array_walk($array, $callback)` | Iterera och modifiera på plats (referens) | – |
| `array_column($array, $column)` | Hämta en kolumn från array av arrayer | – |
| `array_unique($array)` | Ta bort dubbletter | – |
| `usort($array, $callback)` | Sortera med anpassad jämförelse | `array.sort()` med compare-funktion |

## Exempel: Databearbetning

Anta att du har en lista med produkter från en databas eller API:

```php
<?php
$products = [
    ['name' => 'Laptop', 'price' => 9999, 'in_stock' => true],
    ['name' => 'Mus', 'price' => 299, 'in_stock' => false],
    ['name' => 'Tangentbord', 'price' => 799, 'in_stock' => true],
    ['name' => 'Skärm', 'price' => 2499, 'in_stock' => true],
];

// Filtrera produkter i lager, extrahera namn, sortera (steg för steg)
$inStock = array_filter($products, fn($p) => $p['in_stock']);
$names = array_map(fn($p) => $p['name'], $inStock);
sort($names);

// Beräkna totalpris för produkter i lager
$total = array_reduce(
    array_filter($products, fn($p) => $p['in_stock']),
    fn($sum, $p) => $sum + $p['price'],
    0
);
echo "Totalt: $total kr"; // 13297
?>
```

## Ett coolt exempel: Valideringspipeline

En vanlig uppgift är att validera användarinput. Istället för en lång rad `if`-satser kan du bygga en **pipeline av validerare** – varje validerare är en closure som returnerar felmeddelanden eller `null`:

```php
<?php
// Varje validerare tar $value och returnerar felmeddelande eller null
$validators = [
    fn($v) => empty(trim($v)) ? "Fältet får inte vara tomt" : null,
    fn($v) => strlen($v) < 3 ? "Måste vara minst 3 tecken" : null,
    fn($v) => !preg_match('/^[a-zA-ZåäöÅÄÖ\s]+$/', $v) ? "Endast bokstäver tillåtna" : null,
];

function validate(string $value, array $validators): array {
    $errors = [];
    foreach ($validators as $validator) {
        $error = $validator($value);
        if ($error !== null) {
            $errors[] = $error;
        }
    }
    return $errors;
}

$result = validate("An", $validators);
print_r($result); // ["Måste vara minst 3 tecken"]

$result2 = validate("Anna Andersson", $validators);
print_r($result2); // [] – giltig!
?>
```

Här är varje validerare en liten, återanvändbar funktion. Du kan enkelt lägga till eller ta bort validerare utan att röra resten av koden.

## Ett coolt exempel: Pipeline för datatransformering

Tänk dig att du hämtar en lista med evenemang från en API. Du vill: filtrera bort passerade, sortera efter datum, plocka ut titel och datum, och formatera för visning. Med funktionella byggblock blir det en tydlig kedja:

```php
<?php
$events = [
    ['title' => 'PHP-konferens', 'date' => '2025-06-15', 'cancelled' => false],
    ['title' => 'Gammalt möte', 'date' => '2024-01-10', 'cancelled' => false],
    ['title' => 'Workshop', 'date' => '2025-03-20', 'cancelled' => true],
    ['title' => 'Meetup', 'date' => '2025-04-05', 'cancelled' => false],
];

$today = '2025-03-01';

// 1. Filtrera: endast framtida, ej inställda
$upcoming = array_filter($events, function($e) use ($today) {
    return $e['date'] >= $today && !$e['cancelled'];
});

// 2. Sortera efter datum
usort($upcoming, fn($a, $b) => $a['date'] <=> $b['date']);

// 3. Mappa till enkel struktur för visning
$display = array_map(function($e) {
    return [
        'label' => $e['title'] . ' – ' . $e['date'],
        'date' => $e['date'],
    ];
}, $upcoming);

// 4. Reducera till en HTML-lista
$html = array_reduce($display, function($acc, $item) {
    return $acc . "<li>" . htmlspecialchars($item['label']) . "</li>\n";
}, "<ul>\n") . "</ul>";

echo $html;
/* Output (Workshop filtreras bort eftersom cancelled=true):
<ul>
<li>Meetup – 2025-04-05</li>
<li>PHP-konferens – 2025-06-15</li>
</ul>
*/
?>
```

Workshop är markerad som inställd (`cancelled => true`) och filtreras därför bort. Resultatet blir endast Meetup och PHP-konferens. Du kan enkelt lägga till fler filter eller ändra sorteringen – varje steg är en tydlig, återanvändbar operation.

Nästa steg: [PHP klasser](class.md) – objektorienterad programmering med egenskaper, metoder och inkapsling.
</think>
Kontrollerar om pipe-operatorn finns i PHP:
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
WebSearch