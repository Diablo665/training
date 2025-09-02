import { appState, taskPlace } from "../tasks/taskModel.js"
import { showNotification } from "../utils/helper.js";

const sortElem = document.querySelector('.sort')

export function search(query){
    if (!query) {
        return getFiltered(appState.filters);
    }

    const filtered = appState.tasks.filter(task => 
        task.title.toLowerCase().includes(query)
    );
    
    if(filtered.length != 0){
        renderFilteredTask(filtered);
    }else{
        showNotification(
            {
                type: 'info',
                message: 'Таких задач нёт',
                details: "К сожалению нам не удалось найти такую задачу, поэтому мы отобразили все задачи с выбранным ранее фильтром "
            }
        )

        return getFiltered(appState.filters);
    }

}

export function getFiltered(type){
    let filteredList
    if(type === "notCompleted"){
        filteredList = appState.tasks.filter(tasks => !tasks.completed)
        appState.sortActive = false
    }else if(type === 'completed'){
        filteredList = appState.tasks.filter(tasks => tasks.completed);
        appState.sortActive = false;
    }else{
        filteredList = appState.tasks,
        appState.sortActive = true
    }

    appState.filters = type
    updateSortStatus()
    renderFilteredTask(filteredList)

}

export function sort(type){
    let sorted
    const tasks = appState.tasks;

    if (type === 'completed-start') {

        sorted = tasks.slice().sort((a, b) => Number(b.completed) - Number(a.completed));
    } else if (type === 'completed-end') {

        sorted = tasks.slice().sort((a, b) => Number(a.completed) - Number(b.completed));
    }else{
        getFiltered('all');
        return;
    }   

    renderFilteredTask(sorted)
}

function updateSortStatus(){

    if(appState.sortActive){
        sortElem.disabled = false;
        sortElem.style.opacity = 1;
        sortElem.style.cursor = 'pointer';
    }else{
        sortElem.disabled = true;
        sortElem.style.opacity = 0.5;
        sortElem.style.cursor = 'not-allowed';
    }
    sortElem.value = 'default'
}

function renderFilteredTask(tasksArray){
    taskPlace.innerHTML = "";
    tasksArray.forEach(task => {
        taskPlace.insertAdjacentHTML('beforeend', 
            `
            <div data-id="${task.id}" class = 'task ${task.completed  ? "done" : ""}', id="${task.id}" > 
                <input data-inputid="${task.id}" name = 'Check' type ="checkbox" ${task.completed ? "checked=checked" : ""} data-id='${task.id}' data-action='done')">
                <span data-textid="${task.id}"> ${task.title} </span>
                <span class = taskButtons>
                    <ion-icon name="create" class = edit data-id='${task.id}' data-action='openEdit' tabindex="0"></ion-icon>
                    <ion-icon name="trash" class = trash data-id='${task.id}' data-action='delete' tabindex="0"></ion-icon>
                </span>
            </div> 
            `
        )
    })
}