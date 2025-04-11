# PHP klasser

# Introduktion till Klasser i PHP

I tidigare avsnitt har vi sett hur vi kan använda associativa arrayer för att representera strukturerad data, som till exempel en användare eller en produkt:

```php
<?php
$userArray = [
    'username' => 'kalleanka',
    'email' => 'kalle@example.com',
    'lastLogin' => '2024-04-10 10:30:00'
];

echo "Användarnamn: " . $userArray['username'];
?>
```

Detta fungerar bra för enkla fall, men när applikationer växer stöter vi på begränsningar:

*   **Ingen garanterad struktur:** PHP hindrar oss inte från att stava fel på en nyckel (`$userArray['emial'] = ...`) eller glömma att lägga till en viktig nyckel. Det finns ingen fast "mall" för hur en användar-array *ska* se ut.
*   **Ingen datatypvalidering:** Vi kan råka lägga in en siffra där en sträng förväntas, eller tvärtom.
*   **Separation av data och beteende:** Om vi vill utföra operationer relaterade till användaren (t.ex. kontrollera om lösenordet är giltigt, uppdatera e-postadressen, skicka ett välkomstmail), måste vi skriva separata funktioner som tar användar-arrayen som parameter. Datan (arrayen) och logiken (funktionerna) är inte direkt kopplade.

För att lösa dessa problem introducerar PHP, likt många andra moderna språk, konceptet **Object-Oriented Programming (OOP)**, och dess kärna är **klasser (classes)** och **objekt (objects)**.

## Vad är en Klass?

En **klass** är en **mall** eller **ritning** för att skapa objekt. Den definierar:

*   **Properties (Egenskaper):** Variabler som tillhör klassen och lagrar data för objekten (t.ex. `$username`, `$email`).
*   **Methods (Metoder):** Funktioner som tillhör klassen och definierar beteendet eller operationerna som objekten kan utföra (t.ex. `login()`, `updateProfile()`).

## Vad är ett Objekt?

Ett **objekt** är en **instans** av en klass. Det är en konkret representation skapad från klassens mall, med sina egna värden för egenskaperna.

**Liknelse:** Tänk på en pepparkaksform (klassen `GingerbreadMan`). Formen definierar egenskaperna (armar, ben, huvud) och potentiella metoder (kan dekoreras). Varje enskild pepparkaka du stansar ut med formen är ett objekt – en instans av klassen `GingerbreadMan`. Varje pepparkaka (objekt) kan ha olika dekoration (olika värden för sina egenskaper).

## Definiera en Enkel Klass

Vi använder `class`-nyckelordet följt av klassnamnet (ofta med stor bokstav i början, PascalCase).

```php
<?php
declare(strict_types=1); // Bra att använda med klasser!

class User 
{
    // Properties (Egenskaper) - Variabler inuti klassen
    public string $username;
    public string $email;
    public ?DateTime $lastLogin = null; // Kan vara DateTime eller null

    // Methods (Metoder) - Funktioner inuti klassen
    public function displayGreeting(): void 
    {
        echo "Hej, " . $this->username . "!";
    }
}
?>
```

**Förklaring:**

*   `class User { ... }`: Definierar en klass med namnet `User`.
*   `public string $username;`: Definierar en **egenskap** (property) som heter `username`. 
    *   `public`: Detta är en **visibility modifier** (synlighetskontroll). `public` betyder att egenskapen kan nås och ändras direkt utifrån objektet.
    *   `string`: Detta är **type hinting** för egenskapen (sedan PHP 7.4). Det specificerar att `$username` förväntas innehålla en sträng.
    *   `?DateTime $lastLogin = null;`: Egenskapen `lastLogin` kan antingen innehålla ett `DateTime`-objekt eller vara `null`. Den ges ett standardvärde `null`.
*   `public function displayGreeting(): void { ... }`: Definierar en **metod** (method) som heter `displayGreeting`.
    *   `public`: Metoden kan anropas utifrån objektet.
    *   `(): void`: Metoden tar inga argument och returnerar inget (`void`).
    *   `$this->username`: Inuti en metod refererar den speciella variabeln `$this` till det **aktuella objektet** (den specifika instansen av klassen). Vi använder `->` (objektoperatorn) för att komma åt objektets egenskaper (`$username` i detta fall).

## Skapa och Använda Objekt

Vi skapar ett objekt (en instans) från klassen med `new`-nyckelordet.

```php
<?php
// Inkludera eller definiera User-klassen här...
require_once 'User.php'; // Antag att klassen ligger i User.php

// Skapa ett nytt User-objekt (en instans av User-klassen)
$user1 = new User();

// Sätta värden på (publika) egenskaper med ->
$user1->username = 'kalleanka';
$user1->email = 'kalle@example.com';
$user1->lastLogin = new DateTime('2024-04-10 10:30:00');

// Hämta värden från egenskaper
echo "Användarnamn: " . $user1->username . "\n"; // Output: Användarnamn: kalleanka

// Anropa en metod på objektet
$user1->displayGreeting(); // Output: Hej, kalleanka!

echo "\n";

// Skapa ett annat User-objekt
$user2 = new User();
$user2->username = 'mussepigg';
$user2->email = 'musse@example.com';

$user2->displayGreeting(); // Output: Hej, mussepigg!

echo "\nAnvändare 1 E-post: " . $user1->email; // Output: Användare 1 E-post: kalle@example.com
echo "\nAnvändare 2 E-post: " . $user2->email; // Output: Användare 2 E-post: musse@example.com
?>
```

Vi ser här att `$user1` och `$user2` är separata objekt, även om de är skapade från samma klass. De har sina egna kopior av egenskaperna.

## Konstruktorer (`__construct`)

Det är ofta opraktiskt att behöva sätta alla egenskaper manuellt efter att objektet har skapats. En **konstruktor** är en speciell metod som anropas automatiskt när ett nytt objekt skapas med `new`.

Konstruktorn heter alltid `__construct` (två understreck).

```php
<?php
declare(strict_types=1);

class Product
{
    public string $name;
    public float $price;
    public int $stock;

    // Konstruktor-metod
    public function __construct(string $productName, float $productPrice, int $initialStock = 0)
    {
        echo "-- Skapar nytt Product objekt --\n";
        $this->name = $productName;
        $this->price = $productPrice;
        $this->stock = $initialStock;
    }

    public function displayInfo(): void
    {
        echo "Produkt: {$this->name}, Pris: {$this->price} kr, Lager: {$this->stock} st\n";
    }
}

// Skapa objekt och skicka med argument till konstruktorn
$product1 = new Product('Tangentbord', 499.0, 50);
$product2 = new Product('Mus', 249.50); // Använder defaultvärdet 0 för $initialStock

$product1->displayInfo(); // Output: Produkt: Tangentbord, Pris: 499 kr, Lager: 50 st
$product2->displayInfo(); // Output: Produkt: Mus, Pris: 249.5 kr, Lager: 0 st
?>
```

Konstruktorer används för att initialisera objektets tillstånd direkt när det skapas, vilket ofta gör koden renare och säkrare.

## Synlighet: `public`, `private`, `protected`

PHP tillåter oss att kontrollera hur egenskaper och metoder kan nås.

*   `public`: Kan nås och anropas varifrån som helst (utifrån objektet, inifrån klassen, från ärvande klasser).
*   `private`: Kan **endast** nås och anropas inifrån samma klass där den är definierad. Inte ens ärvande klasser kommer åt den.
*   `protected`: Kan nås och anropas inifrån samma klass och från klasser som ärver den, men **inte** direkt utifrån objektet.

Varför inte bara göra allt `public`? Att använda `private` (och `protected`) är en viktig del av **encapsulation (inkapsling)**. Det hjälper till att:

*   **Dölja implementationen:** Hur klassen fungerar internt behöver inte exponeras utåt.
*   **Kontrollera åtkomst:** Du kan säkerställa att egenskaper bara ändras på ett kontrollerat sätt via metoder (getters/setters).
*   **Förbättra underhåll:** Om interna detaljer är `private`, kan du ändra dem utan att riskera att koden som *använder* klassen går sönder (så länge de publika metoderna fungerar likadant).

**Exempel med `private` och Getters/Setters:**

```php
<?php
declare(strict_types=1);

class BankAccount
{
    private string $accountNumber;
    private float $balance;

    public function __construct(string $number, float $initialBalance = 0.0)
    {
        $this->accountNumber = $number;
        // Validera initialt saldo
        if ($initialBalance < 0) {
            $this->balance = 0.0;
        } else {
            $this->balance = $initialBalance;
        }
    }

    // Public Metod för att sätta in pengar (en "setter" för balansen, men med logik)
    public function deposit(float $amount): void
    {
        if ($amount > 0) {
            $this->balance += $amount;
        } else {
            echo "Insättningsbeloppet måste vara positivt.\n";
        }
    }

    // Public Metod för att ta ut pengar (en "setter" med logik)
    public function withdraw(float $amount): bool
    {
        if ($amount <= 0) {
            echo "Uttagsbeloppet måste vara positivt.\n";
            return false;
        }
        if ($amount > $this->balance) {
            echo "Inte tillräckligt med pengar på kontot.\n";
            return false;
        }
        $this->balance -= $amount;
        return true;
    }

    // Public Metod för att hämta saldot (en "getter")
    public function getBalance(): float
    {
        return $this->balance;
    }

    // Public Metod för att hämta kontonumret (en "getter")
    public function getAccountNumber(): string
    {
        return $this->accountNumber;
    }
}

$myAccount = new BankAccount('123-4567', 1000.0);

// echo $myAccount->balance; // Fatal error! Kan inte komma åt private property

echo "Saldo: " . $myAccount->getBalance() . " kr\n"; // Output: Saldo: 1000 kr

$myAccount->deposit(500.0);
echo "Nytt saldo: " . $myAccount->getBalance() . " kr\n"; // Output: Nytt saldo: 1500 kr

$myAccount->withdraw(2000.0); // Output: Inte tillräckligt med pengar på kontot.
echo "Saldo efter misslyckat uttag: " . $myAccount->getBalance() . " kr\n"; // Output: Saldo efter misslyckat uttag: 1500 kr

$success = $myAccount->withdraw(300.0);
if ($success) {
    echo "Saldo efter lyckat uttag: " . $myAccount->getBalance() . " kr\n"; // Output: Saldo efter lyckat uttag: 1200 kr
}
?>
```

I exemplet ovan är `$balance` och `$accountNumber` `private`. Vi kan inte läsa eller ändra dem direkt utifrån. Istället måste vi använda de `public` metoderna (`deposit`, `withdraw`, `getBalance`, `getAccountNumber`). Detta ger klassen full kontroll över hur saldot hanteras (t.ex. att man inte kan sätta in negativa belopp eller ta ut mer än vad som finns).

## Fördelar med Klasser jämfört med Associativa Arrayer

*   **Struktur och Tydlighet:** En klass definierar en tydlig struktur för data.
*   **Inkapsling:** Kombinerar data (egenskaper) och beteende (metoder) som hör ihop.
*   **Kontroll:** Synlighetskontroller (`private`, `protected`) ger bättre kontroll över hur data nås och modifieras.
*   **Återanvändbarhet:** Klasser kan återanvändas för att skapa många objekt.
*   **Underhåll:** Ändringar i klassens interna implementation (om den är väl inkapslad) påverkar inte koden som använder klassen lika mycket.
*   **Type Hinting:** Möjliggör starkare typkontroll för både egenskaper och metodparametrar/returvärden.

Även om det kan verka som mer kod att skriva en klass initialt jämfört med en associativ array, lönar det sig snabbt i större och mer komplexa applikationer genom ökad struktur, säkerhet och underhållbarhet.

Detta är bara en introduktion till klasser. OOP i PHP inkluderar många fler koncept som arv, interfaces, traits, statiska metoder/egenskaper, m.m., men grunderna som täcks här är de mest väsentliga att börja med.
