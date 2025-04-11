# Arrayer och Loopar i PHP

Arrayer är en fundamental datastruktur i de flesta programmeringsspråk, och PHP är inget undantag. De låter oss lagra flera värden i en enda variabel. Om du kommer från en JavaScript-bakgrund kommer du att känna igen konceptet, men det finns viktiga skillnader i syntax och funktionalitet i PHP. Detta avsnitt täcker grunderna för PHP-arrayer och hur man itererar (loopar) över dem.

## Vad är en Array i PHP?

En array i PHP är en ordnad mappning (en samling) av nyckel-värde-par. Nycklarna kan antingen vara heltal (numeriska index) eller strängar. Värdena kan vara av vilken datatyp som helst, inklusive andra arrayer.

Det finns två huvudsakliga typer av arrayer i PHP:

1.  **Indexerade (Numeriska) Arrayer:** Arrayer med numeriska index, vanligtvis startande från 0.
2.  **Associativa Arrayer:** Arrayer med namngivna strängnycklar.

### Indexerade Arrayer

Dessa liknar mest de "vanliga" arrayerna i JavaScript.

**PHP:**

```php
<?php
// Skapa en indexerad array (äldre syntax)
$colors_old = array("Röd", "Grön", "Blå");

// Skapa en indexerad array (modern kort syntax, från PHP 5.4+)
$colors = ["Röd", "Grön", "Blå"];

// Lägg till ett element i slutet
$colors[] = "Gul"; // Index 3 tilldelas automatiskt

// Hämta ett element med dess index
echo $colors[0]; // Output: Röd
echo $colors[3]; // Output: Gul

// Ändra ett element
$colors[1] = "Limegrön"; 
echo $colors[1]; // Output: Limegrön

// Se hela arrayens struktur (bra för debugging)
print_r($colors); 
/* Output:
Array
(
    [0] => Röd
    [1] => Limegrön
    [2] => Blå
    [3] => Gul
)
*/

// Få antalet element
echo count($colors); // Output: 4
?>
```

**JavaScript (Jämförelse):**

```javascript
// Skapa en array
let colors = ["Röd", "Grön", "Blå"];

// Lägg till ett element i slutet
colors.push("Gul");

// Hämta ett element med dess index
console.log(colors[0]); // Output: Röd
console.log(colors[3]); // Output: Gul

// Ändra ett element
colors[1] = "Limegrön";
console.log(colors[1]); // Output: Limegrön

// Se hela arrayen
console.log(colors); // Output: ["Röd", "Limegrön", "Blå", "Gul"]

// Få antalet element (längden)
console.log(colors.length); // Output: 4
```

**Skillnader att notera:**

*   **Syntax:** PHP använder `[]` eller `array()` för att skapa arrayer, JavaScript använder `[]`.
*   **Lägga till element:** PHP använder `$array[] = value;` för att lägga till i slutet, JavaScript använder `array.push(value)`.
*   **Storlek:** PHP använder funktionen `count()`, JavaScript använder `array.length`-egenskapen.

### Associativa Arrayer

Detta är en av PHP:s styrkor. Associativa arrayer låter dig använda meningsfulla strängar som nycklar istället för bara siffror. De liknar JavaScript-objekt som används som dictionaries eller hashmappar.

**PHP:**

```php
<?php
// Skapa en associativ array
$person = [
    "firstName" => "Anna",
    "lastName" => "Andersson",
    "age" => 30,
    "city" => "Stockholm"
];

// Hämta ett värde med dess nyckel
echo $person["firstName"]; // Output: Anna
echo $person["age"];     // Output: 30

// Lägga till ett nytt nyckel-värde-par
$person["email"] = "anna.andersson@example.com";

// Ändra ett värde
$person["city"] = "Göteborg";

// Se hela arrayens struktur
print_r($person);
/* Output:
Array
(
    [firstName] => Anna
    [lastName] => Andersson
    [age] => 30
    [city] => Göteborg
    [email] => anna.andersson@example.com
)
*/

// Kolla om en nyckel finns
if (isset($person["age"])) {
    echo "Ålder finns och är: " . $person["age"]; 
}

// Ta bort ett element
unset($person["lastName"]); 
print_r($person); // lastName är nu borta
?>
```

**JavaScript (Jämförelse med Objekt):**

```javascript
// Skapa ett objekt (motsvarigheten)
let person = {
    firstName: "Anna",
    lastName: "Andersson",
    age: 30,
    city: "Stockholm"
};

// Hämta ett värde med dess nyckel (dot notation eller bracket notation)
console.log(person.firstName); // Output: Anna
console.log(person["age"]);    // Output: 30

// Lägga till en ny egenskap
person.email = "anna.andersson@example.com";

// Ändra ett värde
person.city = "Göteborg";

// Se hela objektet
console.log(person); 
/* Output:
{
  firstName: 'Anna',
  lastName: 'Andersson',
  age: 30,
  city: 'Göteborg',
  email: 'anna.andersson@example.com'
}
*/

// Kolla om en egenskap finns
if ("age" in person) { // eller person.hasOwnProperty('age')
    console.log("Ålder finns och är: " + person.age);
}

// Ta bort en egenskap
delete person.lastName;
console.log(person); // lastName är nu borta
```

**Skillnader att notera:**

*   **Grundtyp:** PHP använder sin `array`-typ för båda, JavaScript använder `object` för detta ändamål (även om `Map` är ett modernare alternativ för rena key-value-stores).
*   **Syntax:** PHP använder `=>` för att associera nyckel och värde, JavaScript använder `:`.
*   **Kolla existens:** PHP använder `isset()`, JavaScript använder `in`-operatorn eller `hasOwnProperty()`.
*   **Ta bort:** PHP använder `unset()`, JavaScript använder `delete`.

## Loopar över Arrayer

Att iterera över elementen i en array är en mycket vanlig uppgift.

### `foreach`-loopen (PHP)

Den mest använda och idiomatiska loopen för arrayer i PHP är `foreach`. Den fungerar smidigt med både indexerade och associativa arrayer.

**För indexerade och associativa (endast värden):**

```php
<?php
$colors = ["Röd", "Grön", "Blå"];
foreach ($colors as $color) {
    echo $color . "<br>"; 
}
// Output:
// Röd
// Grön
// Blå

$person = ["firstName" => "Anna", "age" => 30];
foreach ($person as $value) {
    echo $value . "<br>";
}
// Output:
// Anna
// 30
?>
```

**För associativa (nyckel och värde):**

```php
<?php
$person = [
    "firstName" => "Anna",
    "lastName" => "Andersson",
    "age" => 30
];

foreach ($person as $key => $value) {
    echo $key . ": " . $value . "<br>";
}
// Output:
// firstName: Anna
// lastName: Andersson
// age: 30
?>
```

### `for`-loopen (PHP)

Kan användas för indexerade arrayer, men är mindre vanlig än `foreach`. Kräver att indexen är sekventiella och börjar på 0.

```php
<?php
$colors = ["Röd", "Grön", "Blå"];
$count = count($colors); // Hämta antalet element först
for ($i = 0; $i < $count; $i++) {
    echo "Index " . $i . ": " . $colors[$i] . "<br>";
}
// Output:
// Index 0: Röd
// Index 1: Grön
// Index 2: Blå
?>
```

### JavaScript Loopar (Jämförelse)

JavaScript erbjuder flera sätt att loopa:

**`for...of` (för värden i itererbara objekt som Arrayer):**

```javascript
const colors = ["Röd", "Grön", "Blå"];
for (const color of colors) {
  console.log(color);
}
// Output:
// Röd
// Grön
// Blå
```

**`forEach` (array-metod):**

```javascript
const colors = ["Röd", "Grön", "Blå"];
colors.forEach(function(color, index) {
  console.log(`Index ${index}: ${color}`);
});
// Output:
// Index 0: Röd
// Index 1: Grön
// Index 2: Blå

const person = { firstName: "Anna", age: 30 };
// forEach fungerar inte direkt på vanliga objekt, men på Map eller via Object.entries etc.
Object.entries(person).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
// Output:
// firstName: Anna
// age: 30
```

**`for...in` (för nycklar/egenskaper i objekt - Används sällan för Arrayer):**

```javascript
const person = { firstName: "Anna", age: 30 };
for (const key in person) {
  if (person.hasOwnProperty(key)) { // Viktigt att kolla!
    console.log(`${key}: ${person[key]}`);
  }
}
// Output:
// firstName: Anna
// age: 30
```

**`for` (traditionell loop):**

```javascript
const colors = ["Röd", "Grön", "Blå"];
for (let i = 0; i < colors.length; i++) {
  console.log(`Index ${i}: ${colors[i]}`);
}
// Output:
// Index 0: Röd
// Index 1: Grön
// Index 2: Blå
```

**Sammanfattning PHP vs JS Loops:**

*   PHP:s `foreach` är mycket flexibel och motsvarar närmast en kombination av JS `for...of` (för värden) och iteration över `Object.entries()` (för nyckel/värde).
*   PHP:s `for` är lik JS `for`.
*   JS `forEach` är en metod på array-prototypen, vilket PHP saknar (PHP använder globala funktioner eller språk-konstruktioner).
*   JS `for...in` är primärt för objekt-egenskaper och bör användas med försiktighet för arrayer.

## Vanliga Array-funktioner i PHP

PHP har ett stort bibliotek av inbyggda funktioner för att manipulera arrayer. Här är några vanliga:

*   `count($array)`: Returnerar antalet element i arrayen. (JS: `array.length`)
*   `array_push($array, $value1, $value2...)`: Lägger till ett eller flera element i slutet av arrayen. (JS: `array.push()`)
*   `array_pop($array)`: Tar bort och returnerar det sista elementet från arrayen. (JS: `array.pop()`)
*   `array_unshift($array, $value1...)`: Lägger till ett eller flera element i början av arrayen. (JS: `array.unshift()`)
*   `array_shift($array)`: Tar bort och returnerar det första elementet från arrayen. (JS: `array.shift()`)
*   `in_array($needle, $haystack)`: Kontrollerar om ett värde (`$needle`) finns i arrayen (`$haystack`). Returnerar `true` eller `false`. (JS: `array.includes()`)
*   `array_key_exists($key, $array)` / `isset($array[$key])`: Kontrollerar om en specifik nyckel eller index finns i arrayen. `isset` är vanligare och kollar även att värdet inte är `null`. (JS: `key in object` / `object.hasOwnProperty(key)`)
*   `array_keys($array)`: Returnerar en ny array som innehåller alla nycklar från `$array`. (JS: `Object.keys()`)
*   `array_values($array)`: Returnerar en ny array som innehåller alla värden från `$array`, med nya numeriska index. (JS: `Object.values()`)
*   `sort($array)`: Sorterar en array (värden) i stigande ordning. Modifierar originalarrayen. (JS: `array.sort()`)
*   `rsort($array)`: Sorterar en array i fallande ordning.
*   `asort($array)`: Sorterar en associativ array baserat på värdena, men behåller nyckel-värde-associationerna.
*   `ksort($array)`: Sorterar en associativ array baserat på nycklarna, och behåller associationerna.
*   `array_merge($array1, $array2...)`: Slår ihop en eller flera arrayer till en ny array. (JS: `array1.concat(array2)` eller spread syntax `[...array1, ...array2]`)
*   `array_slice($array, $offset, $length)`: Extraherar en del av en array. (JS: `array.slice()`)
*   `array_splice($array, $offset, $length, $replacement)`: Tar bort och/eller ersätter en del av en array. (JS: `array.splice()`)
*   `implode($glue, $pieces)`: Fogar ihop elementen i en array (`$pieces`) till en sträng, separerade av `$glue`. (JS: `array.join()`)
*   `explode($delimiter, $string)`: Delar upp en sträng till en array baserat på en avgränsare (`$delimiter`). (JS: `string.split()`)

**Exempel:**

```php
<?php
$fruits = ["äpple", "banan", "päron"];
echo "Antal frukter: " . count($fruits) . "<br>"; // 3

array_push($fruits, "apelsin"); 
print_r($fruits); // Array ( [0] => äpple [1] => banan [2] => päron [3] => apelsin )
echo "<br>";

if (in_array("banan", $fruits)) {
    echo "Banan finns i arrayen<br>";
}

$person = ["namn" => "Erik", "stad" => "Malmö"];
$keys = array_keys($person);
print_r($keys); // Array ( [0] => namn [1] => stad )
echo "<br>";

$values = array_values($person);
print_r($values); // Array ( [0] => Erik [1] => Malmö )
echo "<br>";

$fruit_string = implode(", ", $fruits);
echo $fruit_string; // äpple, banan, päron, apelsin
?>
```

Arrayer och loopar är centrala delar av PHP-programmering, särskilt vid hantering av data från databaser eller formulär. Att förstå både indexerade och associativa arrayer samt hur `foreach`-loopen fungerar är avgörande.
