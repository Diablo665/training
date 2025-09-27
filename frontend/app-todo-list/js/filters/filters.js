import { taskManager } from "../main.js";
import { showNotification } from "../utils/helper.js";

const sortElem = document.querySelector('.sort');

export function search(query) {
    const filter = taskManager.getFilters();
    if (!query) {
        return getFiltered(filter);
    }

    const tasks = taskManager.getTasksList()

    const filtered = tasks.filter(task => 
        task.title.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length !== 0) {
        renderFilteredTask(filtered);
    } else {
        showNotification(
            {
                type: 'info',
                message: 'Таких задач нет',
                details: "К сожалению нам не удалось найти такую задачу, поэтому мы отобразили все задачи с выбранным ранее фильтром "
            }
        );

        return getFiltered(filter);
    }
}

export function getFiltered(type) {
    const filteredList = taskManager.filtered(type);

    updateSortStatus();
    renderFilteredTask(filteredList);
}

export function sort(type) {
    const sortTasks = taskManager.sort(type) 

    renderFilteredTask(sortTasks);
}

function updateSortStatus() {
    const sortActive = taskManager.getSortStatus()
    if (sortActive) {
        sortElem.disabled = false;
        sortElem.style.opacity = '1';
        sortElem.style.cursor = 'pointer';
    } else {
        sortElem.disabled = true;
        sortElem.style.opacity = '0.5';
        sortElem.style.cursor = 'not-allowed';
    }
    sortElem.value = 'default';
}

export function renderFilteredTask(tasksArray) {
    const taskPlace = document.querySelector('.taskList');
    taskPlace.innerHTML = "";
    tasksArray.forEach(task => {
        taskPlace.insertAdjacentHTML('beforeend', 
            `
            <div data-id="${task.id}" class="task ${task.completed ? "done" : ""}" id="${task.id}"> 
                <span class="priority ${task.priority}" title='Изменение приоритета'><ion-icon name="information-circle-outline"></ion-icon></span>
                <input data-inputid="${task.id}" name="Check" type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}" data-action="done">
                <span data-textid="${task.id}">${task.title}</span>
                <span class="taskButtons">
                    <ion-icon name="create" class="edit" data-id="${task.id}" data-action="openEdit" tabindex="0"></ion-icon>
                    <ion-icon name="trash" class="trash" data-id="${task.id}" data-action="delete" tabindex="0"></ion-icon>
                </span>
            </div>
            `
        );
    });
}