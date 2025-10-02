// Элементы верхнего списка

import { updateClass } from './panelFunc';
import {storage} from '../utils/localStorage'

const addStatusElem = document.querySelector('#addStat');
const editStatusElem = document.querySelector('#editStat');
const deletedStatusElem = document.querySelector('#deleteStat');
const markDoneStatusElem = document.querySelector('#markDoneStat');
const undoneStatusElem = document.querySelector('#UndoneStat');
const doneStatusElem = document.querySelector('#doneStat');

// Элементы среднего списка
const toDoListLoad = document.querySelector('#ToDoList');
const statisticsLoad = document.querySelector('#loadStatistics');

let start;

export function setMainStatistic() {
    const start = performance.now();
    try {

        const statistics = storage.get('mainStatistics');

        if (statistics) {
            addStatusElem.textContent = statistics.addTask;
            editStatusElem.textContent = statistics.editTask;
            deletedStatusElem.textContent = statistics.deletedTask;
            markDoneStatusElem.textContent = statistics.markDoneTask;
            undoneStatusElem.textContent = statistics.undoneTask;
            doneStatusElem.textContent = statistics.doneTask;
            toDoListLoad.textContent = `${statistics.renderTaskTime} мс`;

            statisticsLoad.textContent = `${Number(performance.now() - start).toFixed(2)} мс`;
            statisticsLoad.textContent = `${Number(performance.now() - start).toFixed(2)} мс`;

            updateClass(toDoListLoad, statistics.renderTaskTime);
        }
    } catch (error) {
        console.error('Ошибка получения статистики:', error);
    }
}

export function addTaskToTable(taskData, event) {
    const tbody = document.querySelector(`${event} tbody`);

    const newRow = document.createElement('tr');

    const cells = [
        document.createElement('td'),
        document.createElement('td'),
        document.createElement('td'),
        document.createElement('td'),
        document.createElement('td'),
        document.createElement('td'),
    ];

    cells[0].textContent = taskData.number || 'N/A';
    cells[1].textContent = taskData.text || 'Нет текста';
    cells[2].textContent = taskData.status || 'N/A';
    cells[3].textContent = taskData.date || 'N/A';
    cells[4].textContent = taskData.time || 'N/A';
    cells[5].textContent = taskData.duration || '0 мс';

    cells.forEach((cell) => newRow.appendChild(cell));

    tbody.appendChild(newRow);
}
