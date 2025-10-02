import { setMainStatistic } from '../statPanel/panelModel';
import { loadOtherTasksFromStorage } from '../statPanel/panelFunc';
import { storage } from '../utils/localStorage';


const deleteButtons = document.querySelectorAll('.delete-button');

export const storageListener = () => {
    window.addEventListener('storage', (event) => {
        switch (event.key) {
            case 'mainStatistics':
                setMainStatistic();
                break;
            case 'addTaskList':
            case 'deletedTaskList':
            case 'editTaskList':
            case 'doneTaskList':
                loadOtherTasksFromStorage(event.key);
                break;
            default:
                return;
        }
    });
};


deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
        const key = button.dataset.key;

        const tableId = `#${key.replace(/List$/, 'Stat')}`;
        const tableBody = document.querySelector(`${tableId} tbody`);

        if (tableBody.children.length === 0) {
            return;
        }
        
        if (confirm(`Вы действительно хотите удалить все ${key} задачи?`)) {

            storage.clearKeys(key);

            tableBody.innerHTML = '';
            
        }
    });
});
