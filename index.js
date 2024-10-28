// VARIABLES Y CONSTANTES

const formList = document.getElementById("formTasks");
const inputTask = document.getElementById("inputTask");
const taskContainer = document.querySelector(".taskContainer");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// FUNCIONES

// FUNCIONES REUTILIZADAS

const addTaskToHtml = (task) => {
    try {
        if (task) {
            taskContainer.innerHTML += `
            <li id=${task.id}>
                <h3>${task.value}</h3>
                <div class="role-group">
                    <button id= "editTask">🖊</button>
                    <button id="successTask" class="success">${
                        task.done ? "✅" : "❌"
                    }</button>
                    <button id="deleteTask" class="Red">Eliminar tarea</button>
                </div>
                <div class="groupEditTask hidden">
                    <input class="inputEdit" type="text" name="inputEdit" placeholder="Edite su tarea">
                    <button id="overwriteTask">✅</button>
                </div>
            </li>
            `;
        }
    } catch (error) {
        console.log("Error al intentar agregar la tarea al html");
        console.log(error);
    }
};

const showInputEditTask = (taskToEdit) => {
    try {
        if (taskToEdit) {
            const liTask = document.getElementById(taskToEdit[0].id);
            const groupEditTask = liTask.querySelector(".groupEditTask");
            groupEditTask.classList.toggle("hidden");
        }
    } catch (error) {
        console.log(error);
    }
};

const addTaskToLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getTasksToLocalStorage = () => {
    return JSON.parse(localStorage.getItem("tasks"));
};

const paintAllTaskToHtml = (tasks) => {
    taskContainer.innerHTML = "";
    tasks.forEach((task) => addTaskToHtml(task));
};

const deleteTask = (event) => {
    const taskId = event.target.parentElement.parentElement.id;
    tasks = tasks.filter((task) => task.id != taskId);

    paintAllTaskToHtml(tasks);
    addTaskToLocalStorage();
};

// FUNCIONES REUTILIZADAS

// Función que cambiará el estado done de la tarea
const succesTask = (event) => {
    const tasksToLocalStorage = getTasksToLocalStorage();
    const idSuccesBtn = event.target.parentElement.parentElement.id;
    tasksToLocalStorage.forEach((task) => {
        if (task.id === idSuccesBtn) {
            task.done = !task.done;
            return;
        }
    });
    tasks = tasksToLocalStorage;
    paintAllTaskToHtml(tasks);
    addTaskToLocalStorage();
};

// Función que obtendrá la tarea que queremos editar y
// mostrará el input con el botón para editar la tarea
const editTask = (event) => {
    const taskId = event.target.parentElement.parentElement.id;
    taskToEdit = tasks.filter((task) => (task.id == taskId));
    showInputEditTask(taskToEdit);
};

// Función que sobreescribirá la vieja tarea por la nueva tareas
const overwriteTask = (event) => {
    const inputEdit = event.target.previousElementSibling;
    if (inputEdit.value === "") {
        alert("No puedes editar y guardar un valor vacio");
        return;
    }
    const tasksToLocalStorage = getTasksToLocalStorage();

    const taskId = event.target.parentElement.parentElement.id;

    const liTask = document.getElementById(taskToEdit[0].id);

    const titleTask = liTask.querySelector("h3");

    tasksToLocalStorage.forEach((task) => {
        if (task.id === taskId) {
            task.value = inputEdit.value;
        }
    });
    titleTask.textContent = inputEdit.value;
    tasks = tasksToLocalStorage;
    addTaskToLocalStorage();
    inputEdit.value = "";
};

// EVENTOS

formList.addEventListener("submit", (e) => {
    if (inputTask.value === "") {
        alert("No puedes añadir un tarea sin valor");
        e.preventDefault();
    }

    if (inputTask.value) {
        e.preventDefault();

        const createdTask = {
            value: inputTask.value,
            done: false,
            id: crypto.randomUUID(),
        };
        tasks = [...tasks, createdTask];

        addTaskToHtml(createdTask);
        addTaskToLocalStorage();

        inputTask.value = "";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    paintAllTaskToHtml(tasks);
});

document.addEventListener("click", (event) => {
    if (event.target.id === "createTask") {
        // Evento que disparará la creación de una nueva tarea
    }

    if (event.target.id === "deleteTask") {
        deleteTask(event);
    }

    if (event.target.id === "successTask") {
        succesTask(event);
    }

    if (event.target.id === "editTask") {
        editTask(event);
    }

    if (event.target.id === "overwriteTask") {
        overwriteTask(event);
    }
});
