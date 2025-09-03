import {getTaskJson, showNotification, getLastId, deleteAnimation} from '../utils/helper.js'
import { testApiURL, textarea, appState } from './taskModel.js';
import { renderFilteredTask } from '../filters/filters.js';

export async function editTask(){ 
    
    if(textarea.value.trim().length > 0 && confirm("Сохранить изменения?")){
        try{

            const editTask = await getTaskJson(appState.editID);
            const status = document.querySelector('select');
            const newTaskJson =  {
                userId: editTask.userId, 
                id: editTask.id, 
                title: textarea.value, 
                completed:  status.selectedIndex ? false : true
            }
        
            const response = await fetch(testApiURL + appState.editID, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newTaskJson),

            })

            if(!response.ok){
                throw new Error('Задачу не получилось отредактировать. Повторить попытку позже')
            }else{

                const task = document.getElementById(appState.editID);
                if(newTaskJson.completed){
                    task.classList.add('done')
                    document.querySelector(`[data-textid="${appState.editID}"]`).textContent = newTaskJson.title;
                    document.querySelector(`[data-inputid="${appState.editID}"]`).checked = true;
                  }else{  
                    task.classList.remove('done')
                    document.querySelector(`[data-inputid="${appState.editID}"]`).checked = false;
                }

                showNotification({
                    type: 'success',
                    message: 'Задача обновлена',
                    details: ""
                });
            }
        }catch(error){
            showNotification({
                type: 'error',
                message: 'Что-то пошло не так',
                details: error.message
            });
        }
    }else{
        showNotification({
            type: 'warning',
            message: 'Проверьте корректность данных',
            details: "Задача не может быть пустой или состоять только из пробелов"
        });
    }
}



export async function addTask(){

    let taskText = document.getElementById('newTask');
    let id = getLastId();
    if (taskText.value.trim().length > 0){

        try{
            const newTask = {userId: 1, id: id, title: taskText.value, completed: false}
            const response = await fetch(testApiURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newTask),
            })

            if(response.ok){

                showNotification({
                    type: 'success',
                    message: 'Задача добавлене',
                    details: `Текст задачи: ${taskText.value}`
                });
                appState.tasks.push(newTask)
                renderFilteredTask(appState.tasks)
                console.log(appState.tasks)
                taskText.value = '';
            }else {
                throw new Error("Ошибка добавления задачи попробуйте повторить попытку позже")
            }
        }catch(error){
            showNotification({
                type: 'error',
                message: 'Что-то пошло нет так...',
                details: error.message
            });
        }


    }else{
        showNotification({
            type: 'warning',
            message: 'Проверьте корректность данных',
            details: "Задача не может быть пустой или состоять только из пробелов"
        });
    }
}

export async function deleteTask(id){

    try{
        const response = await fetch(testApiURL + id, {
            method: "DELETE"
        })

        if (!response.ok) {
            throw new Error(`Ошибка при удалении: ${response.statusText}`);
        }

        const taskElement = document.getElementById(id);

        if (!taskElement) {
            throw new Error('Элемент не найден');
        }
        appState.tasks = appState.tasks.filter(item => item.id != id)
        deleteAnimation(taskElement);

    }catch(error){
        showNotification({
            type: 'error',
            message: 'При удалении возникла ошибка. Повторите попытку позже',
            details: error.message
        });
    }
}


export async function taskDone(id){
    try{
        const task = await getTaskJson(id);
        const updatedTask = document.getElementById(`${id}`);
        const newJson = {
            userId: task.userId, 
            id: task.id, 
            title: task.title, 
            completed: task.completed ? false : true
        }

        const toggleClass = () => 
                updatedTask.classList.toggle('done');

        toggleClass();

        const response = await fetch(testApiURL + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newJson),
        
        })

        if (!response.ok) {

            toggleClass();
            throw new Error('Ошибка при обновлении задачи');
        }

        let index = appState.tasks.findIndex(item => item.id == id)
        appState.tasks[index].completed = appState.tasks[index].completed ? false : true
        console.log(appState.tasks)

    }catch(error){
        console.error('Произошла ошибка:', error.message);

        showNotification({
            type: 'error',
            message: 'Что-то пошло не так',
            details: error.message
        });

    }

}
