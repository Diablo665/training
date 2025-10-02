import { taskManager } from '../main';
import { storage } from './localStorage';

export const mainStatistics = {
    haveTask: 0,
    editTask: 0,
    deletedTask: 0,
    addTask: 0,
    markDoneTask: 0,
    doneTask: 0,
    undoneTask: 0,
    renderTaskTime: 0,
};

export function setMainStatistic(haveTasks) {
    mainStatistics.doneTask = 0;
    mainStatistics.undoneTask = 0;

    const tasks = taskManager.getTasksList();

    if (haveTasks) {
        tasks.forEach((task) => {
            if (task.completed) {
                mainStatistics.doneTask += 1;
            } else {
                mainStatistics.undoneTask += 1;
            }
        });

        mainStatistics.renderTaskTime = taskManager.getRenderTime();
    }

    storage.set('mainStatistics', mainStatistics);
}

export function updateStorage(type, data, time) {

    data.timeEvent = time;

    switch (type) {
        case 'add':
            const addTaskList = storage.get('addTaskList') || [];
            addTaskList.push(data);
            storage.set('addTaskList', addTaskList);
            break;
        case 'edit':
            const editTaskList = storage.get('editTaskList') || [];
            editTaskList.push(data);
            storage.set('editTaskList', editTaskList);
            break;
        case 'deleted':
            const deletedTaskList = storage.get('deletedTaskList') || [];
            deletedTaskList.push(data);
            storage.set('deletedTaskList', deletedTaskList);
            break;
        case 'done':
            const doneTaskList = storage.get('doneTaskList') || [];
            doneTaskList.push(data);
            storage.set('doneTaskList', doneTaskList);
            break;
    }

    const mainStatistics = storage.get('mainStatistics') || {};
    storage.set('mainStatistics', mainStatistics);
}

export async function measureFunction(func, ...args) {
    const start = performance.now();
    try {
        const result = await func(...args);
        const end = performance.now();
        const timeEvent = end - start;

        console.log(`Результат выполнения функции:`, result);

        if (result) {
            updateStorage(result[0], result[1], timeEvent);
            setMainStatistic(1);
        } else {
            console.warn('Результат функции пустой, статистика не обновлена');
        }
    } catch (error) {
        console.error('Ошибка при выполнении функции:', error);
    }
}

export function createTaskData(id, title, status) {
    return {
        id: id,
        title: title,
        status: status,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toISOString().slice(11, 19),
    };
}