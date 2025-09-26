import { showNotification, getLastId, deleteAnimation } from '../utils/helper.js';
import { renderFilteredTask } from '../filters/filters.js';
import { MainStatistics } from '../utils/statistics.js';

export class TaskManager {
    constructor() {
        this.tasks = [];
        this.testApiURL = 'https://jsonplaceholder.typicode.com/todos/';
        this.editID = null;
        this.theme = 'dark';
        this.filters = 'all';
        this.renderTime = 0;
        this.taskPlace = document.querySelector('.taskList');
        this.appState = {
            editID: null,
            filters: 'all',
            renderTime: 0,
            sortActive: false,
        };
    }

    async getTasks() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_page=0&_limit=12');
            if (response.ok) {
                const json = await response.json();
                this.tasks = json.map(task => ({ ...task, priority: 'low' }));
            } else {
                throw new Error('Ошибка при загрузке задач');
            }
        } catch (error) {
            console.error("Ошибка "+ error);
        }
    }


    renderTasks() {
        const start = performance.now();
        this.taskPlace.innerHTML = '';
        
        if (this.tasks.length > 0) {
            this.tasks.forEach(task => {
                this.taskPlace.insertAdjacentHTML('beforeend', `
                    <div data-id="${task.id}" class="task ${task.completed ? 'done' : ''}" id="${task.id}">
                        <span class="priority ${task.priority}" title="Изменение приоритета"><ion-icon name="information-circle-outline"></ion-icon></span>
                        <input data-inputid="${task.id}" name="Check" type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" data-action="done">
                        <span data-textid="${task.id}">${task.title}</span>
                        <span class="taskButtons">
                            <ion-icon name="create" class="edit" data-id="${task.id}" data-action="openEdit" tabindex="0"></ion-icon>
                            <ion-icon name="trash" class="trash" data-id="${task.id}" data-action="delete" tabindex="0"></ion-icon>
                        </span>
                    </div>
                `);
            });
        } else {
            this.taskPlace.innerHTML = `<h3>Новых задач пока нет</h3><img src='img/non-task.png' alt='Задачи отсутствуют' width='300px' height='300px'>`;
        }

        const end = performance.now();
        this.renderTime = Math.trunc(end - start);
    }

    async editTask() {
        if (textarea.value.trim().length > 0 && confirm("Сохранить изменения?")) {
            try {
                const editTask = await this.getTaskJson(this.appState.editID);
                const status = document.querySelector('#editSelect');
                const priority = document.querySelector('#editPrioritySelect');
    
                const newTaskJson = {
                    userId: editTask.userId,
                    id: editTask.id,
                    title: textarea.value,
                    completed: status.selectedIndex === 0,
                    priority: priority.value
                };
    
                const response = await fetch(this.testApiURL + this.appState.editID, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(newTaskJson),
                });
    
                if (!response.ok) {
                    throw new Error('Задачу не получилось отредактировать. Повторить попытку позже');
                } else {
                    const index = this.tasks.findIndex(item => item.id === this.appState.editID);
                    if (index !== -1) {
                        this.tasks[index].title = newTaskJson.title;
                        this.tasks[index].completed = newTaskJson.completed;
                        this.tasks[index].priority = newTaskJson.priority;
                    }
                    renderFilteredTask(this.tasks);
    
                    MainStatistics.editTask += 1;
    
                    showNotification({
                        type: 'success',
                        message: 'Задача обновлена',
                        details: ""
                    });
    
                    return ['edit', {
                        id: this.appState.editID,
                        title: newTaskJson.title,
                        status: newTaskJson.completed ? "Решено" : 'Не решено',
                        date: new Date().toISOString().slice(0, 10),
                        time: new Date().toISOString().slice(11, 19),
                        status: 'Не выполнено'
                    }];
                }
            } catch (error) {
                showNotification({
                    type: 'error',
                    message: 'Что-то пошло не так',
                    details: error.message
                });
            }
        } else {
            showNotification({
                type: 'warning',
                message: 'Проверьте корректность данных',
                details: "Задача не может быть пустой или состоять только из пробелов"
            });
        }
    }

    async addTask() {
        const taskText = document.getElementById('newTask');
        const id = getLastId();
        const priority = document.getElementById('taskCategory').value;
    
        if (taskText.value.trim().length > 0) {
            try {
                const text = taskText.value.trim();
                const newTask = {
                    userId: 1,
                    id: id,
                    title: text,
                    completed: false,
                    priority: priority
                };
    
                const response = await fetch(this.testApiURL, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json;charset:utf-8'
                    },
                    body: JSON.stringify(newTask)
                });
    
                if (response.ok) {
                    showNotification({
                        type: 'success',
                        message: 'Задача добавлена',
                        details: `Текст задачи: ${taskText.value.trim()}`
                    });
    
                    this.tasks.push(newTask);
                    renderFilteredTask(this.tasks);
                    MainStatistics.addTask += 1;
    
                    taskText.value = '';
    
                    return ['add', {
                        id: id,
                        title: text,
                        date: new Date().toISOString().slice(0, 10),
                        time: new Date().toISOString().slice(11, 19),
                        status: 'Не выполнено'
                    }];
                } else {
                    throw new Error("Ошибка добавления задачи, попробуйте повторить попытку позже");
                }
            } catch (error) {
                showNotification({
                    type: 'error',
                    message: 'Что-то пошло не так...',
                    details: error.message
                });
            }
        } else {
            showNotification({
                type: 'warning',
                message: 'Проверьте корректность данных',
                details: "Задача не может быть пустой или состоять только из пробелов"
            });
        }
    }
    
    async deleteTask(id) {
        try {
            const response = await fetch(this.testApiURL + id, {
                method: "DELETE"
            });
    
            if (!response.ok) {
                throw new Error(`Ошибка при удалении: ${response.statusText}`);
            }

            const taskElement = document.getElementById(id);
    
            if (!taskElement) {
                throw new Error('Элемент не найден');
            }
            
            this.tasks = this.tasks.filter(item => item.id !== id);
            MainStatistics.deletedTask += 1;
    
            const taskText = document.querySelector(`[data-textid="${id}"]`).textContent;
            deleteAnimation(taskElement);
    
            return ['deleted', {
                id: id,
                title: taskText,
                status: 'Удалена',
                date: new Date().toISOString().slice(0, 10),
                time: new Date().toISOString().slice(11, 19)
            }];
        } catch (error) {
            showNotification({
                type: 'error',
                message: 'При удалении возникла ошибка. Повторите попытку позже',
                details: error.message
            });
        }
    }

    async taskDone(id) {
        try {
            const task = this.getTaskJson(id);
            const updatedTask = document.getElementById(`${id}`);
       
            if (!updatedTask) {
                throw new Error('Элемент задачи не найден');
            }
            const newJson = {
                userId: task.userId,
                id: task.id,
                title: task.title,
                completed: !task.completed
            };
       
            updatedTask.classList.toggle('done');
       
            const response = await fetch(this.testApiURL + id, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json;charset:utf-8'
                },
                body: JSON.stringify(newJson)
            });
       
            if (!response.ok) {
                updatedTask.classList.toggle('done');
                throw new Error('Ошибка при обновлении задачи');
            }
       
            const index = this.tasks.findIndex(item => item.id === id);

            if (index !== -1) {
                this.tasks[index].completed = newJson.completed;
                newJson.completed ? MainStatistics.markDoneTask += 1 : MainStatistics.markDoneTask -= 1;
            }
       
            return ['done', {
                id: id,
                title: task.title,
                status: newJson.completed ? "Решено" : 'Не решено',
                date: new Date().toISOString().slice(0, 10),
                time: new Date().toISOString().slice(11, 19)
            }];

        } catch (error) {
            console.error('Произошла ошибка:', error.message);
            
            showNotification({
                type: 'error',
                message: 'Что-то пошло не так',
                details: error.message
            });
        }
       }

    getTaskJson(id) {
        try {
            return this.tasks.find(item => item.id === id);
        }catch{
            console.log('Элемент не найден');
        }
    }

    filtered(type){

        if (type === "notCompleted") {
            this.appState.sortActive = false;
            return this.tasks.filter(task => !task.completed);
        } else if (type === 'completed') {
            this.appState.sortActive = false;
            return this.tasks.filter(task => task.completed);
        } else {
            this.appState.sortActive = true;
            return this.tasks;
        }
    }

    sort(type){
 
        if (type === 'completed-start') {
            return this.tasks.slice().sort((a, b) => Number(b.completed) - Number(a.completed));
        } else if (type === 'completed-end') {
            return this.tasks.slice().sort((a, b) => Number(a.completed) - Number(b.completed));
        } else {
            return this.tasks;
        }
    }
       
    async init() {

        await this.getTasks();
        this.renderTasks();
    }

    setTheme(theme) {
        this.theme = theme;
    }

    setEditID(id){
        this.appState.editID = id;
    }

    setFilters(type){
        this.appState.filters = type;
    }

    setSortStatus(stat){
        this.appState.sortActive = stat;
    }

    getEditID(){
        return this.appState.editID;
    }

    getTheme(){
        return this.theme;
    }

    getFilters(){
        return this.appState.filters;
    }

    getTasksList(){
        return this.tasks;
    }

    getSortStatus(){
        return this.appState.sortActive;
    }

    getRenderTime(){
        return this.renderTime;
    }
}