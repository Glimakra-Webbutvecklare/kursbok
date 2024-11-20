## Praktiska övningar och projekt

### 1. Interaktivt formulär
Skapa ett formulär som samlar in användardata (namn, email, meddelande) och validerar input. 
Formuläret ska:
- Visa felmeddelanden vid ogiltig input
- Rensa formuläret efter lyckad submission
- Använda CSS för styling och responsiv design

### 2. Todo-lista
Utveckla en todo-lista applikation där användaren kan:
- Lägga till nya todos
- Markera todos som klara
- Ta bort todos
- Spara todos i localStorage

### 3. Bildgalleri
Skapa ett responsivt bildgalleri som:
- Visar thumbnails i ett grid
- Öppnar bilder i en lightbox vid klick
- Har navigation mellan bilder
- Laddar bilder dynamiskt

### 4. Quiz-applikation
Bygg en quiz-app med följande funktioner:
- Visa frågor en i taget
- Räkna poäng
- Visa resultat vid slutet
- Möjlighet att starta om

## Lösningsförslag

### 1. Interaktivt formulär
```js
const form = document.querySelector('#contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    validateForm();
});

function validateForm() {
    // Implementera validering här
}
```

### 2. Todo-lista
```js
class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    }
    
    addTodo(text) {
        this.todos.push({ text, completed: false });
        this.save();
    }
    
    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}
```

### 3. Bildgalleri
```js
const gallery = document.querySelector('.gallery');
images.forEach(image => {
    const thumb = createThumbnail(image);
    gallery.appendChild(thumb);
});

function createThumbnail(image) {
    // Implementera thumbnail-skapande här
}
```

### 4. Quiz-applikation
```js
class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestion = 0;
        this.score = 0;
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.questions.length) {
            return this.questions[this.currentQuestion++];
        }
        return null;
    }
}
```