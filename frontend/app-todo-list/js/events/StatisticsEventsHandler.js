import { setMainStatistic } from "../statPanel/panelModel";
import { loadOtherTasksFromStorage } from "../statPanel/panelFunc";

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