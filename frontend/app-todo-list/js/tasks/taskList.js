import {getTaskJson, showNotification, getLastId, deleteAnimation} from '../utils/helper.js';
import { testApiURL, textarea, appState } from './taskModel.js';
import { renderFilteredTask } from '../filters/filters.js';

export async function editTask() {
    if (textarea.value.trim().length > 0 && confirm("Сохранить изменения?")) {
        try {
            const editTask = await getTaskJson(appState.editID);
            const status = document.querySelector('select');
            const newTaskJson = {
                userId: editTask.userId,
                id: editTask.id,
                title: textarea.value,
                completed: status.selectedIndex === 0
            };

            const response = await fetch(testApiURL + appState.editID, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newTaskJson),
            });

            if (!response.ok) {
                throw new Error('Задачу не получилось отредактировать. Повторить попытку позже');
            } else {
                const index = appState.tasks.findIndex(item => item.id === appState.editID);
                if (index !== -1) {
                    appState.tasks[index].title = newTaskJson.title;
                    appState.tasks[index].completed = newTaskJson.completed;
                }

                renderFilteredTask(appState.tasks);

                showNotification({
                    type: 'success',
                    message: 'Задача обновлена',
                    details: ""
                });
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

export async function addTask() {
    const taskText = document.getElementById('newTask');
    const id = getLastId();

    if (taskText.value.trim().length > 0) {
        try {
            const newTask = { userId: 1, id: id, title: taskText.value.trim(), completed: false };
            const response = await fetch(testApiURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                showNotification({
                    type: 'success',
                    message: 'Задача добавлена',
                    details: `Текст задачи: ${taskText.value.trim()}`
                });

                appState.tasks.push(newTask);
                renderFilteredTask(appState.tasks);

                taskText.value = '';
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

export async function deleteTask(id) {
    try {
        const response = await fetch(testApiURL + id, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Ошибка при удалении: ${response.statusText}`);
        }

        const taskElement = document.getElementById(id);

        if (!taskElement) {
            throw new Error('Элемент не найден');
        }

        appState.tasks = appState.tasks.filter(item => item.id !== id);
        deleteAnimation(taskElement);

    } catch (error) {
        showNotification({
            type: 'error',
            message: 'При удалении возникла ошибка. Повторите попытку позже',
            details: error.message
        });
    }
}

export async function taskDone(id) {
    try {
        const task = await getTaskJson(id);
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

        const response = await fetch(testApiURL + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newJson),
        });

        if (!response.ok) {

            updatedTask.classList.toggle('done');
            throw new Error('Ошибка при обновлении задачи');
        }

        const index = appState.tasks.findIndex(item => item.id === id);
        if (index !== -1) {
            appState.tasks[index].completed = newJson.completed;
        }

    } catch (error) {
        console.error('Произошла ошибка:', error.message);

        showNotification({
            type: 'error',
            message: 'Что-то пошло не так',
            details: error.message
        });
    }
}