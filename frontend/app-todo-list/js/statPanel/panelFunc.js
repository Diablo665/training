import { addTaskToTable } from './panelModel';

const elemTag = {
    addTaskList: '#addTaskStat',
    deletedTaskList: '#deleteTaskStat',
    editTaskList: '#editTaskStat',
    doneTaskList: '#markDoneTaskStat',
};

export function updateClass(elem, time) {
    elem.classList.value = time < 3000 ? 'green' : 'red';
}

export function loadOtherTasksFromStorage(type) {
    const tasks = JSON.parse(localStorage.getItem(type)) || [];

    if (tasks.length === 0) return;

    const tbody = document.querySelector(`${elemTag[type]} tbody`);
    tbody.innerHTML = '';

    tasks.forEach((task) => {
        const formattedTask = {
            number: task.id,
            text: task.title || 'Нет заголовка',
            status: task.status,
            date: task.date,
            time: task.time,
            duration: task.timeEvent || '0 мс',
        };

        addTaskToTable(formattedTask, elemTag[type]);
    });
}

export function loadAllTask() {
    ['addTaskList', 'deletedTaskList', 'editTaskList', 'doneTaskList'].forEach((type) => {
        loadOtherTasksFromStorage(type);
    });
}
