// VARIABLES INICIALES
const formList = document.getElementById("formTask");
const inputTask = document.getElementById("inputTask");
const taskContainer = document.querySelector(".taskContainer");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// FUNCIONES
const addTaskToHtml = ({ value, done, id }) => {
    try {
        taskContainer.innerHTML += `
            <li id=${id}>
                <h3>${value}</h3>
                <div class="role-group">
                    <button id= "editTask">🖊</button>
                    <button id="successTask" class="success">${
                        done ? "✅" : "❌"
                    }</button>
                    <button id="deleteTask" class="Red">Eliminar tarea</button>
                </div>
                <div class="groupEditTask hidden">
                    <input class="inputEdit" type="text" name="inputEdit" placeholder="Edite su tarea">
                    <button id="overwriteTask">✅</button>
                </div>
            </li>`;
    } catch (error) {
        console.log(error);
    }
};

const addTaskToLocalStorage = () =>
    localStorage.setItem("tasks", JSON.stringify(tasks));

const getTasksToLocalStorage = () => JSON.parse(localStorage.getItem("tasks"));

const paintAllTasksToLocalStorage = (tasks) => {
    taskContainer.innerHTML = "";
    tasks.forEach((task) => addTaskToHtml(task));
};

const showInputEditTask = (event) => {
    const taskId = event.target.parentElement.parentElement.id;
    const liTask = document.getElementById(taskId);
    const groupEditTask = liTask.querySelector(".groupEditTask ");
    groupEditTask.classList.toggle("hidden");
};

const overwriteTask = (event) => {
    const inputEdit = event.target.previousElementSibling;

    if (inputEdit.value === "") alert("No puedes enviar una tarea vacia");

    const tasksToLocaStorage = getTasksToLocalStorage();
    const taskId = event.target.parentElement.parentElement.id;
    const liTask = document.getElementById(taskId);
    const titleTask = liTask.querySelector("h3");

    tasksToLocaStorage.forEach((task) => {
        if (task.id === taskId) task.value = inputEdit.value;
    });

    titleTask.textContent = inputEdit.value;
    tasks = tasksToLocaStorage;
    addTaskToLocalStorage();
    inputEdit.value = "";
};

const deleteTask = (event) => {
    const taskId = event.target.parentElement.parentElement.id;
    tasks = tasks.filter((task) => task.id != taskId);
    // solo se guardarán todas las tareas menos la tarea con el id = taskId

    paintAllTaskToHtml(tasks);
    addTaskToLocalStorage();
};

const paintAllTaskToHtml = (tasks) => {
    taskContainer.innerHTML = "";
    tasks.forEach((task) => addTaskToHtml(task));
};

const succesTask = (event) => {
    const tasksToLocaStorage = getTasksToLocalStorage();
    const taskId = event.target.parentElement.parentElement.id;

    tasksToLocaStorage.forEach((task) => {
        if (task.id === taskId) task.done = !task.done;
    });

    tasks = tasksToLocaStorage;
    paintAllTaskToHtml(tasks);
    addTaskToLocalStorage();
};

// EVENTOS
formList.addEventListener("submit", (event) => {
    event.preventDefault();
    if (inputTask.value === "") {
        alert("NO PUEDES AGREGAR UNA TAREA VACIA");
        return;
    }

    if (inputTask.value) {
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

document.addEventListener("click", (event) => {
    let target = event.target;

    if (target.id === "editTask") {
        showInputEditTask(event);
    }

    if (target.id === "overwriteTask") {
        overwriteTask(event);
    }

    if (target.id === "deleteTask") {
        deleteTask(event);
    }

    if (target.id === "successTask") {
        succesTask(event);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    paintAllTasksToLocalStorage(tasks);
});
