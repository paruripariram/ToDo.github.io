"use strict";

const inputTask = document.getElementById("task");
const submitBtn = document.querySelector(".btn-submit");
const radios = document.querySelectorAll(".radio");

//Фильтр
let currentFilter = "Все"; //Текущий фильтр

radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    currentFilter = radio.value;
    renderTasks();
  });
});

//Функция для добавления задачи в список
const addTask = () => {
  //Удаляем предупреждение из .block-push если оно есть
  const error = document.querySelector(".block-push .error");
  if (error) {
    error.remove();
  }

  if (inputTask.value.trim() != "") {
    //Создаемобъект для хранения данных в localStorage
    const task = {
      id: Date.now(), //генерируем уникальный id
      text: inputTask.value.trim(), //сохраняем текст задачи
      completed: false, //задача не выполнена по умолчанию
    };

    tasks.push(task);

    saveTasks();

    //Очищаем поле ввода
    inputTask.value = "";

    //Добавляем задачу в DOM
    renderTasks();
  } else {
    let errorAlert = document.createElement("div");
    errorAlert.classList.add("error");
    errorAlert.insertAdjacentHTML("beforeend", `Введите задачу!`);
    document.querySelector(".block-push").appendChild(errorAlert);

    //Удаляем предупреждение через 2 секунду
    setTimeout(() => {
      if (errorAlert) {
        errorAlert.remove();
      }
    }, 2000);
  }
};

//Добавляем реализацию добавления задачи при нажатии на кнопку и Enter
submitBtn.addEventListener("click", addTask);
inputTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask();
  }
});

//Сохраняем задачи в localStorage
let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Загрузка задач из localStorage
const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
  renderTasks();
}


function renderTasks() {
  const list = document.querySelector(".list");
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.insertAdjacentHTML(
      "beforeend",
      `<h2 class="block-title">Список задач пуст</h2>`
    );
  }

  //Добавляем реализацию фильтра задач
  const filtredTasks = tasks.filter((task) => {
    if (currentFilter === "Все") {
      return true;
    } else if (currentFilter === "Выполненные") {
      return task.completed;
    } else if (currentFilter === "Активные") {
      return !task.completed;
    }
  });

  filtredTasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add("task");
    if (task.completed) {
      taskElement.classList.add("completed");
    }

    taskElement.insertAdjacentHTML(
      "beforeend",
      `<p class="task-descr">${task.text}</p>
        <button class="task-del">&#128711;</button>`
    );

    //Добавляем id задачи в DOM для связи с данными
    taskElement.dataset.id = task.id;

    const deleteBtn = taskElement.querySelector(".task-del");
    deleteBtn.addEventListener("click", () => {
      //Удаляем задачу из списка
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      //Удаляем задачу из DOM
      renderTasks();
    });

    taskElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("task-descr")) {
        toggleTask(task.id);
      }
    });
    list.appendChild(taskElement);
  });
  updateCountLeftTasks();

}

//Функция для отметки задачи как выполненной
function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    taskElement.classList.toggle("completed");
    updateCountLeftTasks();
  }
}

function updateCountLeftTasks() {
  const counter = tasks.filter((task) => !task.completed).length;
  document.querySelector(".tasks-count").innerHTML = counter;
}

//Удаление всех выполненных задач
const clearBtn = document.querySelector(".btn-clear");
clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

updateCountLeftTasks();

//Смена темы
const switchBtn = document.querySelector(".switch-theme input");
const body = document.body;
const curTheme = localStorage.getItem("theme");
if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-theme");
}

document.addEventListener("DOMContentLoaded", () => {
  if (curTheme === "light") {
    switchBtn.checked = true;
  }
});

switchBtn.addEventListener("change", () => {
  body.classList.toggle("light-theme");

  if (body.classList.contains("light-theme")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});
