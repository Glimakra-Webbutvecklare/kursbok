# Introduktion till PHP

- PHP i modern webbutveckling
- Utvecklingsmiljö setup
- PHP och webbservrar
- Grundläggande koncept

# PHP Syntax och grundläggande funktioner

Detta avsnitt dyker djupare in i den grundläggande syntaxen för PHP. Om du har erfarenhet av JavaScript kommer mycket att kännas bekant, men det finns viktiga skillnader i hur du skriver variabler, hanterar datatyper, och strukturerar din kod. Vi kommer att fokusera på dessa skillnader och även introducera några moderna PHP-funktioner.

## PHP-taggar och kommentarer

PHP-kod exekveras på servern och bäddas oftast in i HTML-dokument med hjälp av speciella taggar.

*   **Standardtaggar:** `<?php ... ?>`
    Detta är det vanligaste och mest rekommenderade sättet att markera PHP-kodblock.
*   **Kort echo-tagg:** `<?= ... ?>`
    En genväg för `<?php echo ... ?>`. Användbar för att snabbt skriva ut en variabel eller resultatet av en funktion direkt i HTML.

```php
<!DOCTYPE html>
<html>
<head>
    <title>PHP Taggar</title>
</head>
<body>
    <h1>Välkommen</h1>
    <p>Dagens datum är: <?= date('Y-m-d'); ?></p> 

    <?php
        // Detta är en PHP-kommentar (enkelrad)
        $message = "Hej från ett PHP-block!";
        /*
           Detta är en
           flerradskommentar i PHP.
        */
        echo "<p>" . $message . "</p>"; 
    ?>
</body>
</html>
```

*   **Kommentarer:** Liknar JavaScript: `//` för enkelradskommentarer och `/* ... */` för flerradskommentarer.


## Kodstandard och namngivningsprinciper

Att följa en kodstandard är något som programmerare bör vara insatt i. PHP är ett programspråk som funnits under relativt lång tid och därmed förändras också en kodstandard. Sträva efter att vara konsekvent.

### Variabler

En av de mest uppenbara skillnaderna från JavaScript är hur variabler deklareras och används i PHP.

*   Alla variabelnamn i PHP inleds med ett dollartecken (`$`).
*   Efter `$` måste namnet börja med en bokstav eller ett understreck (`_`), följt av valfritt antal bokstäver, siffror eller understreck.
*   PHP är **Case sensitive** för variabelnamn (`$name` och `$Name` är två olika variabler).
En variabel namnges med gemener. Använd understreck mellan ord.

```php
$last_name
$is_authenticated
```


### Funktioner

Funktionsnamn skrivs med gemener och understreck mellan ord - snake_case.

```php
get_name()
render_copyright()
```

### Klasser och metoder
En klass namnges PascalCase, och metoder i klassen som camelCase. 

```php
MyClass() {
    function __construct() {
    
    }
    
    public function printInfo() {

    }
}
```



**PHP:**

```php
<?php
$first_name = "Anna"; // Skapar och tilldelar en sträng
$age = 30;          // Skapar och tilldelar ett heltal
$price = 199.50;    // Skapar och tilldelar ett flyttal
$is_valid = true;   // Namn kan börja med _

$age = 31; // Ändrar värdet på en befintlig variabel

echo "Namn: " . $first_name . ", Ålder: " . $age;
?>
```

**JavaScript (jämförelse):**

```javascript
let firstName = "Anna"; // Kräver let, const (eller var)
let age = 30;
const price = 199.50; // Konstant, kan inte ändras
let isValid = true;   // Inget $ behövs

age = 31; // Ändra värde

console.log(`Namn: ${firstName}, Ålder: ${age}`); // Template literals för enkel utskrift
```

## Datatyper

PHP har flera inbyggda datatyper. De viktigaste kan delas in i:

### Skalära Typer (Scalar Types)

Dessa representerar enskilda värden.

*   **`int` (Integer):** Heltal (t.ex. `10`, `-5`, `0`).
*   **`float` (Floating-point number, även `double`):** Decimaltal (t.ex. `3.14`, `-0.5`, `1.0`).
*   **`string`:** Textsträngar. Kan omges av enkla (`'...'`) eller dubbla (`"..."`) citationstecken.
    *   Dubbla citationstecken (`"`) tillåter **variabelinterpolering** (variabler inuti strängen ersätts med deras värden) och specialtecken som `\n` (nyrad), `\t` (tab).
    *   Enkla citationstecken (`'`) behandlar nästan all text bokstavligt (literal), ingen variabelinterpolering sker (förutom `\\` och `\'`). De är ofta snabbare när ingen interpolering behövs.
*   **`bool` (Boolean):** Logiska värden, antingen `true` eller `false` (skiftlägesokänsliga).

```php
<?php
$count = 100;       // int
$pi = 3.14159;    // float
$is_admin = false;   // bool

$single_quote = 'Detta är en sträng. Variabel: $count \n'; // $count och \n skrivs ut bokstavligt
$double_quote = "Detta är en sträng. Variabel: $count \n"; // $count ersätts, \n blir nyrad

echo $single_quote; 
// Output: Detta är en sträng. Variabel: $count \n

echo $double_quote;
// Output: Detta är en sträng. Variabel: 100 
// (och en nyrad)
?>
```

### Sammansatta Typer (Compound Types)

Dessa kan innehålla flera värden.

*   **`array`:** Ordnad mappning av nyckel-värde-par. Kan vara indexerad (numeriska nycklar) eller associativ (strängnycklar). (Se `array-loopar.md` för detaljer).
*   **`object`:** Instanser av klasser.
*   **`callable`:** En referens till en funktion.

### Speciella Typer

*   **`resource`:** En speciell variabel som håller en referens till en extern resurs (t.ex. en databasanslutning, en öppen fil).
*   **`null`:** Representerar avsaknaden av ett värde. En variabel har värdet `null` om den har tilldelats `null`, inte har tilldelats något värde alls, eller har blivit `unset()`.

PHP är ett **dynamiskt typat** språk (som JavaScript) som standard, vilket innebär att du inte behöver specificera datatypen när du skapar en variabel. PHP avgör typen baserat på värdet den tilldelas, och typen kan ändras under körningens gång (även om detta bör undvikas om möjligt).

```php
<?php
$value = 10;     // $value är nu int
echo gettype($value); // Output: integer

$value = "Hej";  // $value är nu string
echo gettype($value); // Output: string
?>
```
(Vi kommer till *Type Hinting* senare, vilket låter dig vara mer explicit med typer i funktioner.)

## Konstanter

För värden som inte ska ändras under skriptets körning kan du definiera konstanter med `define()` eller `const`.

*   **`define(name, value, case_insensitive)`:** Traditionellt sätt. Namnet är en sträng. Standard är skiftlägeskänsligt.
*   **`const NAME = value;`:** Nyare sätt (sedan PHP 5.3), används oftast inom klasser men fungerar även globalt. Kan inte användas inom kontrollstrukturer (som `if`). Alltid skiftlägeskänsligt.

Konstanter har **inget `$`** framför sig.

```php
<?php
define("APP_VERSION", "1.0.2");
const DEFAULT_LANG = "sv";

echo APP_VERSION; // Output: 1.0.2
echo DEFAULT_LANG; // Output: sv

// Försök att ändra konstant (ger fel)
// APP_VERSION = "1.1.0"; // Fatal error
// const DEFAULT_LANG = "en"; // Parse error
?>
```

## Operatorer

PHP har många operatorer som liknar de i JavaScript.

*   **Aritmetiska:** `+`, `-`, `*`, `/`, `%` (modulo/rest), `**` (exponent, sedan PHP 5.6).
*   **Tilldelning:** `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`, `.=` (för strängkonkatenering).
*   **Jämförelse:**
    *   `==` (Lika, efter typomvandling - **undvik ofta!**)
    *   `===` (Identisk, samma värde OCH samma typ - **rekommenderas!**)
    *   `!=` eller `<>` (Inte lika, efter typomvandling)
    *   `!==` (Inte identisk, olika värde ELLER olika typ - **rekommenderas!**)
    *   `<`, `>`, `<=`, `>=`
    *   `<=>` (Spaceship operator, sedan PHP 7): Returnerar -1, 0, eller 1 beroende på om vänster är mindre än, lika med, eller större än höger.
*   **Logiska:** `&&` (and), `||` (or), `!` (not), `and` (samma som `&&` men lägre prioritet), `or` (samma som `||` men lägre prioritet), `xor`.
*   **Strängkonkatenering:** `.` (punkt) används för att slå ihop strängar.
*   **Felkontroll:** `@` (används framför ett uttryck för att tysta eventuella fel/varningar det genererar - **använd med extrem försiktighet!**)
*   **Null Coalescing:** `??` (sedan PHP 7): Returnerar vänster operand om den existerar och inte är `null`, annars höger operand. Bra för att sätta defaultvärden.
*   **Null Coalescing Assignment:** `??=` (sedan PHP 7.4): Tilldelar höger operand till vänster operand endast om vänster operand är `null`.

```php
<?php
$a = 5;
$b = "5";
$c = 10;

var_dump($a == $b);  // bool(true) - Undvik! '5' görs om till 5.
var_dump($a === $b); // bool(false) - Rekommenderas! Olika typer.
var_dump($a != $b);  // bool(false)
var_dump($a !== $b); // bool(true) - Rekommenderas!

var_dump($a <=> $c); // int(-1)
var_dump($a <=> $a); // int(0)
var_dump($c <=> $a); // int(1)

$name = $_GET['user'] ?? 'Gäst'; // Om $_GET['user'] inte finns eller är null, blir $name 'Gäst'
echo "Välkommen, $name!\n";

$settings['theme'] = $settings['theme'] ?? 'light'; // Traditionellt
$settings['theme'] ??= 'light'; // Samma som ovan med ??=

$greeting = "Hej";
$target = "Världen";
$fullGreeting = $greeting . " " . $target . "!"; // Strängkonkatenering
echo $fullGreeting; // Output: Hej Världen!
?>
```

## Kontrollstrukturer

Styr hur koden exekveras.

### `if`, `elseif`, `else`

Fungerar i princip identiskt med JavaScript.

```php
<?php
$score = 75;

if ($score >= 90) {
    echo "Betyg: A";
} elseif ($score >= 80) {
    echo "Betyg: B";
} elseif ($score >= 65) {
    echo "Betyg: C"; // Denna körs
} else {
    echo "Betyg: F";
}
?>
```

### `switch`

Liknar JavaScripts `switch`, men använder lös jämförelse (`==`) som standard. Kom ihåg `break;`!

```php
<?php
$day = "Måndag";

switch ($day) {
    case "Måndag":
        echo "Start på veckan.";
        break;
    case "Fredag":
        echo "Snart helg!";
        break;
    default:
        echo "En vanlig dag.";
        // break; behövs inte i default
}
?>
```

### `match` (PHP 8+)

Ett modernare alternativ till `switch`. Viktiga skillnader:

*   Använder **strikt jämförelse (`===`)**. Mycket säkrare!
*   Är ett **uttryck**, vilket betyder att det returnerar ett värde.
*   Har **inga `break`**, faller inte igenom.
*   Måste vara **uttömmande** (ha ett `default`-fall eller täcka alla möjliga värden om input-typen är känd, t.ex. en enum).
*   Kan ha **flera värden** per arm, separerade med komma.

```php
<?php
$httpStatusCode = 200;

$message = match ($httpStatusCode) {
    200, 201, 204 => "Success!",
    400 => "Bad Request",
    404 => "Not Found",
    500 => "Server Error",
    default => "Unknown status code",
};

echo $message; // Output: Success!

// Jämför med switch:
// switch ($httpStatusCode) {
//     case 200:
//     case 201:
//     case 204:
//         $message = "Success!";
//         break;
//     case 400:
//         $message = "Bad Request";
//         break;
//     // ... etc ...
// }
?>
```
`match` är ofta att föredra framför `switch` i modern PHP tack vare strikt jämförelse och att det är ett uttryck.

### Loopar (`for`, `while`, `do-while`, `foreach`)

`for`, `while`, och `do-while` fungerar i stort sett som i JavaScript.
`foreach` är specifikt designad för att loopa över arrayer och objekt och täcks i detalj i `array-loopar.md`.

```php
<?php
// for-loop
for ($i = 0; $i < 5; $i++) {
    echo "i är $i\n";
}

// while-loop
$j = 0;
while ($j < 3) {
    echo "j är $j\n";
    $j++;
}

// do-while loop (körs minst en gång)
$k = 5;
do {
    echo "k är $k\n"; // Körs en gång
    $k++;
} while ($k < 5);
?>
```

## Funktioner

Att definiera och anropa funktioner liknar JavaScript, men med PHP-syntax.

```php
<?php
// Definiera en funktion
function greet($name) {
    echo "Hej, " . $name . "!";
}

// Anropa funktionen
greet("Anna"); // Output: Hej, Anna!

// Funktion som returnerar ett värde
function add($num1, $num2) {
    return $num1 + $num2;
}

$sum = add(10, 5);
echo "\nSumman är: " . $sum; // Output: Summan är: 15
?>
```

## Type Hinting (Typdeklarationer)

Sedan PHP 7 har möjligheten att deklarera förväntade typer för funktionsparametrar och returvärden förbättrats avsevärt. Detta kallas **type hinting** eller **typdeklarationer**.

*   **Parameter Types:** Ange förväntad typ före parameternamnet.
*   **Return Types:** Ange förväntad returtyp efter parameterlistan med ett kolon (`:`).
*   **Nullable Types:** Om en parameter eller returvärde kan vara antingen den specificerade typen *eller* `null`, sätt ett frågetecken (`?`) före typen (t.ex. `?string`).
*   **Union Types (PHP 8+):** Tillåter att en parameter eller returvärde kan vara en av flera typer, separerade med `|` (t.ex. `int|float`).
*   **`mixed` Type (PHP 8+):** Indikerar att en parameter eller returvärde kan vara av vilken typ som helst.
*   **`void` Return Type (PHP 7.1+):** Indikerar att en funktion inte returnerar något värde.

Om en funktion anropas med fel typ eller returnerar fel typ (och strikta typer är aktiverade, se nedan), kastas ett `TypeError`.

```php
<?php
// Aktivera strikta typer (rekommenderas i början av filer)
declare(strict_types=1);

// Funktion med typdeklarationer
function calculateArea(float $width, float $height): float {
    if ($width <= 0 || $height <= 0) {
        // Kanske kasta ett undantag istället
        throw new InvalidArgumentException("Bredd och höjd måste vara större än 0");
    }
    return $width * $height;
}

$area = calculateArea(10.5, 5.2);
echo "Area: " . $area . "\n"; // Output: Area: 54.6

// $invalidArea = calculateArea(-10.0, 5.0); // Detta ger ett TypeError pga -10.0

// Funktion med nullable return type
function findUser(int $id): ?array { // Kan returnera array eller null
    // ... logik för att hämta användare ...
    if ($id === 1) {
        return ['id' => 1, 'name' => 'Anna'];
    }
    return null;
}

// Funktion med union type parameter och void return type
function processValue(int|string $input): void {
    echo "Bearbetar: " . $input . "\n";
    // Returnerar inget
}

processValue(123);
processValue("abc");
?>
```

**`declare(strict_types=1);`:** Denna deklaration, när den placeras i början av en PHP-fil, aktiverar **strikt typläge**. I strikt läge accepteras endast värden av *exakt* den typ som deklarerats (med några få undantag som `int` till `float`). Utan strikt läge (default), försöker PHP tvångsomvandla (coerce) värden till den förväntade typen om möjligt (t.ex. strängen `"10"` skulle accepteras för en `int`-parameter). Att använda strikta typer rekommenderas starkt för att fånga fel tidigare och göra koden mer förutsägbar.

Att använda type hinting gör din PHP-kod mer robust, lättare att förstå, och hjälper utvecklingsverktyg (som IDE:er) att ge bättre assistans och felkontroll.

Detta täcker de mest grundläggande syntaxelementen i PHP. Nästa steg är att se hur man interagerar med databaser (`sql.md`), hanterar sessioner (`sessions.md`) och tänker på säkerhet (`security.md`) innan vi bygger vår CRUD-applikation.

