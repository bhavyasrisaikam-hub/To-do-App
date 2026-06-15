// Select Elements
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const filterButtons = document.querySelector(".filters");

// Application State
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// Save Todos to Local Storage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Render Todos
function renderTodos() {
    list.innerHTML = "";

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === "active") {
            return !todo.completed;
        }

        if (currentFilter === "completed") {
            return todo.completed;
        }

        return true;
    });

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");

        li.dataset.id = todo.id;

        if (todo.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${todo.text}</span>

            <div class="actions">
                <button class="toggle">✓</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });
}

// Add New Todo
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = input.value.trim();

    if (text === "") return;

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);

    saveTodos();
    renderTodos();

    input.value = "";
});

// Event Delegation for Edit, Delete, Toggle
list.addEventListener("click", function (e) {
    const li = e.target.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);

    const todo = todos.find(item => item.id === id);

    // Delete Task
    if (e.target.classList.contains("delete")) {
        todos = todos.filter(item => item.id !== id);
    }

    // Toggle Complete
    if (e.target.classList.contains("toggle")) {
        todo.completed = !todo.completed;
    }

    // Edit Task
    if (e.target.classList.contains("edit")) {
        const newText = prompt("Edit Task:", todo.text);

        if (newText && newText.trim() !== "") {
            todo.text = newText.trim();
        }
    }

    saveTodos();
    renderTodos();
});

// Filter Buttons
filterButtons.addEventListener("click", function (e) {
    if (!e.target.dataset.filter) return;

    currentFilter = e.target.dataset.filter;

    document.querySelectorAll(".filters button").forEach(btn => {
        btn.classList.remove("active");
    });

    e.target.classList.add("active");

    renderTodos();
});

// Initial Render
renderTodos();