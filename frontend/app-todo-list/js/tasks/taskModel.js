export const testApiURL = new URL("https://jsonplaceholder.typicode.com/todos/")
export const textarea = document.querySelector('textarea'); // 
export const editConteiner = document.getElementsByClassName('editConteiner')[0];
export const appState = {
    editID: null
   };

import {showNotification, loader} from '../utils/helper.js'


export async function renderTask(){
    let taskList = await getTasks();
    let taskPlace = document.querySelector('.taskList');
    
    if(taskList.length > 0){
        taskPlace.innerHTML = "";
        
        taskList.forEach(task => {
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

        loader(0)
    }else{
        taskPlace.innerHTML = "<h3> Новых задач пока нет </h3><img src='img/non-task.png' alt='Задачи отсутсвуют' width='300px' height='300px'>"
    }
}

/*--------------- Получаем список тасков с localStorage ------------------ */
export async function getTasks(){
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_page=0&_limit=12');

        if(response.ok){
            const json = await response.json();
            return json
        }else{
            throw new Error(`При загрузке задач произошла ошмбка. 
                Попробуйте перезагрузить страницу или немного подождать, мы уже пытаемся получить данные с сервера`)
        }

    }catch(error){
        showNotification({
            type: 'error',
            message: 'Что-то пошло не так',
            details: error.message
        });
        setTimeout(() => {getTasks(1)}, 3000)
    }
}
