# DOM-manipulation och Events (händelsehantering)

## Vad är DOM (Document Object Model)?
Document Object Model (DOM) är en programmeringsgränssnitt som representerar HTML- och XML-dokument som ett trädstrukturerat objekt. Detta gör det möjligt för programmerare att dynamiskt komma åt och modifiera innehåll, struktur och stil på webbsidor genom JavaScript eller andra programmeringsspråk.

DOM fungerar som en bro mellan webbsidan och programmeringsspråket, där varje element på sidan representeras som ett objekt med egenskaper och metoder som kan manipuleras. Detta möjliggör interaktiva webbapplikationer där innehållet kan uppdateras utan att hela sidan behöver laddas om.

## DOM-trädet och dess struktur
DOM-trädet är en hierarkisk representation av alla element på en webbsida, där varje element är en nod i trädet. Trädet börjar med ett rot-element (vanligtvis <html>) och förgrenar sig nedåt genom alla element, attribut och textinnehåll på sidan.

```bash
document
└── html
    ├── head
    │   ├── meta
    │   ├── title
    │   │   └── "Sidans titel"
    │   └── link
    └── body
        ├── header
        │   ├── h1
        │   │   └── "Huvudrubrik"
        │   └── nav
        │       └── ul
        │           ├── li
        │           └── li
        ├── main
        │   ├── article
        │   │   ├── h2
        │   │   │   └── "Artikelrubrik"
        │   │   └── p
        │   │       └── "Artikeltext"
        │   └── aside
        │       └── "Sidoinnehåll"
        └── footer
            └── p
                └── "Sidfot"
```
_exempel på en DOM struktur av ett HTML dokument_

Strukturen i DOM-trädet följer den nästlade strukturen i HTML-dokumentet, där varje element kan ha ett föräldra-element och flera barn-element. Detta skapar tydliga relationer mellan elementen som kan användas för att navigera och manipulera dokumentet programmatiskt.

## Nodtyper och deras egenskaper
I DOM finns det flera olika typer av noder, där de vanligaste är element-noder (som representerar HTML-taggar), text-noder (som innehåller text) och attribut-noder (som innehåller elementens attribut). Varje nodtyp har sina specifika egenskaper och metoder som kan användas för att hämta eller ändra information.

Nodernas egenskaper inkluderar bland annat nodeType (som identifierar typen av nod), nodeName (som anger nodens namn), nodeValue (som innehåller nodens värde), och parentNode, childNodes, samt siblings (som beskriver nodens relationer till andra noder i trädet). Dessa egenskaper är grundläggande för att kunna navigera och manipulera DOM-strukturen effektivt.

## Välja DOM-element

### getElementById()
Denna metod väljer ett element baserat på dess ID-attribut. Eftersom ID ska vara unikt i ett HTML-dokument returneras endast ett element.
```js
const header = document.getElementById('main-header');
```

### getElementsByClassName()
Väljer alla element som har en specifik CSS-klass. Returnerar en HTMLCollection med alla matchande element.
```js
const buttons = document.getElementsByClassName('btn');
```

### getElementsByTagName()
Väljer alla element av en specifik HTML-tagg. Returnerar en HTMLCollection med alla matchande element.
```js
const paragraphs = document.getElementsByTagName('p');
```

### querySelector() och querySelectorAll()
querySelector() väljer det första elementet som matchar en CSS-selektor.
querySelectorAll() väljer alla element som matchar selektorn och returnerar en NodeList.
```js
const firstButton = document.querySelector('.btn');
const allButtons = document.querySelectorAll('.btn');
```

### Traversera DOM-trädet

Stiga ner i DOM-trädet innebär att navigera från ett överordnat element till dess underordnade element. Detta kan göras genom att använda egenskaper som `children` eller `childNodes` för att få tillgång till alla barnelement. Man kan också använda `firstChild` eller `firstElementChild` för att komma åt det första barnet, eller `lastChild` och `lastElementChild` för det sista barnet.

Stiga ner i DOM-trädet är särskilt användbart när man behöver iterera genom en lista av element eller när man vill hitta specifika element baserat på deras position i dokumentstrukturen. Det är också viktigt att förstå skillnaden mellan element-noder och text-noder när man traverserar nedåt i trädet.

Skillnaden mellan element-noder och text-noder är att element-noder representerar HTML-element med sina taggar och attribut, medan text-noder endast innehåller textinnehåll. Element-noder kan ha barn-noder (både element och text), medan text-noder är "löv" i DOM-trädet och kan inte ha några barn. När man använder metoder som `childNodes` får man både element- och text-noder, medan `children` endast returnerar element-noder.

```js
// Exempel på att traversera nedåt i DOM-trädet
const container = document.querySelector('.container');

// Få alla direkta barnelement
const children = container.children;
console.log('Alla barnelement:', children);

// Få första barnelement
const firstChild = container.firstElementChild;
console.log('Första barnelement:', firstChild);

// Få sista barnelement
const lastChild = container.lastElementChild;
console.log('Sista barnelement:', lastChild);

// Iterera genom alla barnelement
for (let child of container.children) {
    console.log('Barnelement:', child);
    
    // Gå ännu djupare - få barnens barn
    const grandchildren = child.children;
    for (let grandchild of grandchildren) {
        console.log('Barnbarn:', grandchild);
    }
}

// Använd childNodes för att få både element och textnoder
const allNodes = container.childNodes;
console.log('Alla noder (inklusive textnoder):', allNodes);
```

Stiga upp i DOM-trädet handlar om att navigera från ett element till dess förälder eller förfäder. Den vanligaste metoden är att använda `parentNode` eller `parentElement` för att nå det direkta föräldraelementet. Detta är användbart när man behöver hitta kontext för ett element eller när man implementerar event delegation.

För att stiga upp flera nivåer i DOM-trädet kan man antingen kedja parentNode-anrop eller använda `closest()`-metoden för att hitta närmaste förälder som matchar en viss selektor. Detta är särskilt användbart när man arbetar med händelsehantering och behöver hitta specifika föräldraelement.

```js
// Exempel på att traversera uppåt i DOM-trädet
const listItem = document.querySelector('li');

// Få direkt förälderelement till listItem
const parent = listItem.parentElement;
console.log('Förälderelement:', parent);

// Få föräldernod (kan vara element eller annan nodtyp)
const parentNode = listItem.parentNode;
console.log('Föräldernod:', parentNode);

// Kedja parentNode för att gå upp flera nivåer
const grandparent = listItem.parentNode.parentNode;
console.log('Farförälder:', grandparent);

// Använd closest() för att hitta närmaste förälder som matchar en selektor
const nearestList = listItem.closest('ul');
console.log('Närmaste ul-element:', nearestList);
```
## Manipulera DOM-element

### Ändra textinnehåll (textContent, innerText)
Det finns två huvudsakliga sätt att ändra text i ett element: textContent och innerText. textContent returnerar all text innehållet i ett element, medan innerText tar hänsyn till styling och synlighet.

```js
const element = document.querySelector('#myElement');
element.textContent = 'Ny text här';
element.innerText = 'Denna text respekterar styling';
```

### Ändra HTML-innehåll (innerHTML)
innerHTML låter dig manipulera HTML-innehållet i ett element. Detta är kraftfullt men kan vara riskabelt ur säkerhetssynpunkt om man inte saniterar input.

```js
const container = document.querySelector('.container');
container.innerHTML = '<h1>Ny rubrik</h1><p>Nytt stycke</p>';
```

### Skapa nya element (createElement)
Med createElement kan du skapa nya DOM-element programmatiskt. Detta är säkrare än att använda innerHTML och ger mer kontroll.

```js
const newDiv = document.createElement('div');
newDiv.textContent = 'Detta är ett nytt element';
document.body.appendChild(newDiv);
```

### Lägga till och ta bort element
DOM API:et erbjuder flera metoder för att lägga till och ta bort element. De vanligaste är appendChild, removeChild, och remove.

```js
const parent = document.querySelector('.parent');
const child = document.createElement('div');

// Lägga till
parent.appendChild(child);

// Ta bort
child.remove();
// eller
parent.removeChild(child);
```

### Ändra attribut och CSS-egenskaper
Du kan manipulera element-attribut och CSS-egenskaper direkt via JavaScript. Detta kan göras både via setAttribute/style och via moderna dataset-API:er.

```js
const element = document.querySelector('.myElement');

// Ändra attribut
element.setAttribute('id', 'newId');
element.id = 'anotherId';

// Ändra CSS
element.style.backgroundColor = 'blue';
element.style.fontSize = '16px';
```

# Events (Händelsehantering)

## Vad är ett event?
Ett event är en händelse som inträffar i webbläsaren, till exempel när en användare klickar på en knapp eller när en sida har laddats. Händelser är en viktig del av interaktivitet på webben.

### addEventListener()
addEventListener är den moderna metoden för att koppla händelselyssnare till element. Den erbjuder mer flexibilitet och bättre kontroll än äldre metoder som onclick.

```js
const button = document.querySelector('button');
button.addEventListener('click', () => {
    console.log('Knappen klickades!');
});
```

### Vanliga händelsetyper
Det finns många olika typer av händelser som kan hanteras i webbläsaren. Click-händelser är vanliga för användarinteraktion, medan submit används för formulär.

```js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sidan har laddats klart');
});

// submit: utlöses när användaren klickar på en submit-knapp eller skickar ett formulär
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    // Förhindrar standardåtgärden
    // i detta fall, förhindrar formuläret att skickas
    // och laddar om sidan
    e.preventDefault(); 

    console.log('Formuläret skickades');
});


// input: utlöses när användaren ändrar värdet i ett element och fortfarande har fokus på det
const input = document.querySelector('input');
input.addEventListener('input', (e) => {
    console.log(`Nytt värde: ${e.target.value}`);
    // Här kan du utföra validering eller annan logik
})

// change: utlöses när användaren ändrar värdet i ett element och sedan lämnar det
const select = document.querySelector('select');
select.addEventListener('change', (e) => {
    console.log(`Valt alternativ: ${e.target.value}`);
    // Här kan du utföra validering eller annan logik
});

// mouseover: utlöses när musen flyttas över ett element
const box = document.querySelector('.box');
box.addEventListener('mouseover', (e) => {
    console.log('Musen över elementet');
})

// blur: utlöses när ett element förlorar fokus
const input = document.querySelector('input');
input.addEventListener('blur', (e) => {
    console.log('Element förlorade fokus');
    // Här kan du utföra validering eller annan logik
});

```

### Event-objekt och dess egenskaper
När en händelse inträffar skapas ett event-objekt som innehåller information om händelsen. Detta objekt ger tillgång till användbar data som musposition eller tangenttryckningar.

```js
document.addEventListener('mousemove', (event) => {
    console.log(`Musposition: ${event.clientX}, ${event.clientY}`);
});

document.addEventListener('keydown', (event) => {
    console.log(`Tangent tryckt: ${event.key}`);
});
```

### Event bubbling och capturing
Händelser i DOM propagerar genom elementhierarkin i två faser: capturing (uppifrån och ner) och bubbling (nerifrån och upp). Detta beteende kan kontrolleras med addEventListener's tredje parameter.

Alltså under det vanliga beteendet så kommer händelser att bubbla upp genom DOM-trädet från det element där händelsen utlöstes till dess föräldrar. Med capturing satt till true så kommer händelsen istället att fångas upp och hanteras uppifrån och ner i DOM-trädet, från det yttersta elementet till det element där händelsen ursprungligen utlöstes.

Ett praktiskt exempel på när capturing är användbart. Anta att vi har en modal dialog med en stängknapp:

```html
<div class="modal">
    <div class="modal__content">
        <button class="modal__close">×</button>
        <h2>Modal Titel</h2>
        <p>Här är innehållet i modalen...</p>
    </div>
</div>
```

```js
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.modal__close');
const modalContent = document.querySelector('.modal__content');

// Använder capturing för att fånga klick utanför modalen
document.addEventListener('click', (event) => {
    // Kontrollerar om klicket var utanför modal-innehållet
    if (!modalContent.contains(event.target) && !closeButton.contains(event.target)) {
        modal.style.display = 'none';
    }
}, true); // true aktiverar capturing

// Stängknappen behöver egen lyssnare
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Förhindra att klick på modal-innehållet stänger modalen - en extra trygghet
modalContent.addEventListener('click', (event) => {
    event.stopPropagation();
});
```

### Event delegation
Event delegation är ett mönster där man utnyttjar event bubbling för att hantera händelser på flera element genom att sätta en lyssnare på en gemensam förälder. Detta är särskilt användbart för dynamiskt skapade element.

```js
const list = document.querySelector('ul');
list.addEventListener('click', (event) => {
    if (event.target.tagName === 'li') { // alla <li> kommer att ärva denna lyssnaren
        console.log('Listitem klickad:', event.target.textContent);
    }
});

// Nya list-items kommer automatiskt att omfattas av händelsehanteringen
const newItem = document.createElement('li');
newItem.textContent = 'Nytt item';
list.appendChild(newItem);
```

## Praktiska övningar
### Bygga en dynamisk todo-lista
1. Först skapar vi HTML-strukturen och grundläggande JavaScript:
```html
<div class="todo-container">
    <form id="todo-form">
        <input type="text" id="todo-input" placeholder="Lägg till en uppgift">
        <button type="submit">Lägg till</button>
    </form>
    <ul id="todo-list"></ul>
</div>
<script src="script.js"></script>
```


2. Implementera grundläggande funktionalitet för att lägga till och ta bort todos:
```js
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Lyssnare för formuläret
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Kontrollera om input är tomt
    // Om tomt, avbryt
    if (todoInput.value.trim() === '') return;
    
    // Skapa ett nytt li-element och lägg till det i listan
    const todoItem = document.createElement('li');
    todoItem.innerHTML = `
        <span>${todoInput.value}</span>
        <button class="delete-btn">Ta bort</button>
    `;
    
    todoList.appendChild(todoItem);
    todoInput.value = '';
});

// Använder event delegation för att hantera borttagning
todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        // Ta bort det klickade elementet
        // som är föräldern till knappen dvs li elementet
        e.target.parentElement.remove();
    }
});
```

3. Lägg till funktionalitet för att markera todos som klara:
```js
// Uppdatera li-elementets HTML och lägg till toggle-funktionalitet
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (todoInput.value.trim() === '') return;
    
    const todoItem = document.createElement('li');
    // Lägg till checkboxen
    todoItem.innerHTML = `
        <input type="checkbox" class="todo-checkbox">
        <span>${todoInput.value}</span>
        <button class="delete-btn">Ta bort</button>
    `;
    
    todoList.appendChild(todoItem);
    todoInput.value = '';
});

// Lägg till händelsehantering för checkboxar
// Triggas varje gång en checkbox ändras
todoList.addEventListener('change', (e) => {
    if (e.target.classList.contains('todo-checkbox')) {
        const todoText = e.target.nextElementSibling;
        // Ge texten en genomstrykning om checkboxen är markerad
        todoText.style.textDecoration = e.target.checked ? 'line-through' : 'none';
    }
});
```

### Formulärvalidering
1. Skapa formuläret:
```html
<form id="contactForm">
  <div class="form-group">
    <input type="text" id="name" placeholder="Namn" required>
    <span class="error" id="nameError"></span>
  </div>
  
  <div class="form-group">
    <input type="email" id="email" placeholder="Email" required>
    <span class="error" id="emailError"></span>
  </div>
  
  <div class="form-group">
    <input type="tel" id="phone" placeholder="Telefon" required>
    <span class="error" id="phoneError"></span>
  </div>
  
  <button type="submit">Skicka</button>
</form>
<script src="script.js"></script>
```

2. Implementera valideringslogik:
```js
// Formulär element
const contactForm = document.getElementById
('contactForm');

// input element
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

// Felmeddelanden element
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Rensa tidigare felmeddelanden
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';

    // Validering - name
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    if (name === '') {
        nameError.textContent = 'Namn krävs';
    } else if (name.length < 3) {
        nameError.textContent = 'Namn måste vara minst 3 tecken';
    }

    // Validering - email
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        emailError.textContent = 'Email krävs';
    } else if (emailRegex.test(email) === false) {
        emailError.textContent = 'Ogiltig email-adress';
    }
    
    // Validering - phone
    const phoneRegex = /^\d{10}$/;
    if (phone === '') {
        phoneError.textContent = 'Telefon krävs';
    } else if (phoneRegex.test(phone) === false) {
        phoneError.textContent = 'Telefonnummer måste vara 10 siffror';
    }

    // Om fel, skicka INTE formuläret
    if (nameError.textContent || emailError.textContent || phoneError.textContent ) {
        return false;
    }

    // Om inga fel, skicka formuläret
    return true;
}
```


## Best Practices
### Prestanda och optimering
**Minimera DOM-manipulationer** genom att batcha ändringar. DOM-manipulationer är kostsamma operationer som kan trigga reflow och repaint. Genom att samla flera ändringar och utföra dem på en gång kan vi förbättra prestandan avsevärt.

  ```js
  // många separata DOM-operationer - Sämre
  for(let i = 0; i < 100; i++) {
    container.innerHTML += `<div>Item ${i}</div>`;
  }

  // Batchar ändringarna - Bättre
  let html = '';
  for(let i = 0; i < 100; i++) {
    html += `<div>Item ${i}</div>`;
  }
  container.innerHTML = html;
  ```

Alternativt kan man **använda DocumentFragment** för att hantera flera element samtidigt. DocumentFragment är ett lätt DOM-objekt som fungerar som en temporär behållare för DOM-element. När ett DocumentFragment läggs till i DOM:en ersätts det av sitt innehåll, vilket resulterar i endast en enda DOM-uppdatering.
```js
  // Utan DocumentFragment - Sämre
    for(let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.textContent = `Item ${i}`;
        container.appendChild(div);
    }
    
  // Med DocumentFragment - Bättre
  const fragment = document.createDocumentFragment();
  for(let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);
  }
  container.appendChild(fragment);
```

**Undvik layout thrashing** genom att läsa och skriva DOM-operationer separat
  Layout thrashing uppstår när man blandar läsning och skrivning av DOM-egenskaper, vilket tvingar webbläsaren att göra onödiga omberäkningar. Genom att separera läs- och skrivoperationer kan vi optimera renderingen.

```js  
  // Dåligt exempel - blandar läsning och skrivning
  elements.forEach(element => {
    const height = element.offsetHeight; // läser värde en och en
    element.style.height = height * 2 + 'px'; // skriver värde en och en
  });

  // Bra exempel - separerar läsning och skrivning
  const heights = elements.map(element => element.offsetHeight); // läser alla först
  heights.forEach((height, i) => {
    elements[i].style.height = height * 2 + 'px'; // skriver alla sedan
  });
``` 
**Casha DOM-referenser** istället för att göra upprepade querySelector-anrop
  Att söka efter element i DOM:en med querySelector är en relativt kostsam operation. Genom att spara referenser till ofta använda element kan vi förbättra prestandan betydligt.

```js
  // Sämre - upprepar querySelector
  function updateHeader() {
    document.querySelector('.header').textContent = 'Ny rubrik';
    document.querySelector('.header').style.color = 'red';
  }

  // Bättre - cashar referensen
  const header = document.querySelector('.header');
  function updateHeader() {
    header.textContent = 'Ny rubrik';
    header.style.color = 'red';
  }
```
### Debugging
**Implementera error handling** och logging i dina eventlisteners

Error handling är viktigt för att fånga och hantera fel som kan uppstå när användare interagerar med din webbapplikation. Genom att implementera try-catch block och logging kan du enklare debugga problem och ge användare bättre feedback.

När du lägger till eventlisteners är det bra praxis att wrappa din kod i try-catch för att hantera potentiella fel. Du bör också logga viktiga händelser och fel för att underlätta felsökning.

```js
const button = document.querySelector('#myButton');
const messageContainer = document.querySelector('#messageContainer');
button.addEventListener('click', (e) => {
  try {
    // Din kod här
    const result = someRiskyOperation();
    console.log('Operation lyckades:', result);
  } catch (error) {
    console.error('Ett fel uppstod:', error);
    // Visa användarvänligt felmeddelande
    showErrorMessage(messageContainer, 'Något gick fel, försök igen senare');
  }
});

function showErrorMessage(container, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  container.appendChild(errorDiv);
}
```
### Avancerade DOM-manipulationstekniker

**Utnyttja template-element för dynamiskt innehåll**
  
Template-element är perfekta för att lagra HTML-strukturer som ska återanvändas. De renderas inte direkt på sidan utan fungerar som en mall som kan klonas när den behövs. Detta är särskilt användbart för listor, kort och andra upprepande element.

Exempel på hur du använder template:
```html 
  <template id="userCard">
    <div class="card">
      <h3 class="name"></h3>
      <p class="email"></p>
    </div>
  </template>
```
```js
  const template = document.querySelector('#userCard');
  const container = document.querySelector('.container');
  
  function createUserCard(name, email) {
    const card = template.content.cloneNode(true);
    card.querySelector('.name').textContent = name;
    card.querySelector('.email').textContent = email;
    container.appendChild(card);
  }
  ```  

**Implementera Intersection Observer för lazy loading**
  
  Intersection Observer är ett kraftfullt verktyg för att upptäcka när element blir synliga i viewport. Detta är perfekt för att implementera lazy loading av bilder och annat innehåll, vilket förbättrar sidans laddningstid och prestanda.

  Här är ett enkelt exempel på hur du kan lazy loada bilder:

  ```js
  const images = document.querySelectorAll('img[data-src]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => observer.observe(img));
  ```