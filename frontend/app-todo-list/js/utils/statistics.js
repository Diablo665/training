import { taskManager } from '../main';

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

const addTaskList = [];
const editTaskList = [];
const deletedTaskList = [];
const doneTaskList = [];

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

    localStorage.setItem('mainStatistics', JSON.stringify(mainStatistics));
}

export function updateStorage(type, data, time) {
    data.timeEvent = time;

    switch (type) {
        case 'add':
            addTaskList.push(data);
            localStorage.setItem('addTaskList', JSON.stringify(addTaskList));
            break;
        case 'edit':
            editTaskList.push(data);
            localStorage.setItem('editTaskList', JSON.stringify(editTaskList));
            break;
        case 'deleted':
            deletedTaskList.push(data);
            localStorage.setItem('deletedTaskList', JSON.stringify(deletedTaskList));
            break;
        case 'done':
            doneTaskList.push(data);
            localStorage.setItem('doneTaskList', JSON.stringify(doneTaskList));
            break;
    }

    localStorage.setItem('mainStatistics', JSON.stringify(mainStatistics));
}

export async function measureFunction(func, ...args) {
    const start = performance.now();
    const result = await func(...args);
    const end = performance.now();
    const timeEvent = end - start;

    console.log(result);

    updateStorage(result[0], result[1], timeEvent);

    setMainStatistic(1);
}
