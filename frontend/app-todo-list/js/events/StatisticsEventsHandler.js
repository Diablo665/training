import { setMainStatistic } from "../statPanel/panelModel.js";
import { loadOtherTasksFromStorage } from "../statPanel/panelFunc.js";

export function storageListener(){
    window.addEventListener('storage', (event) => {
        
        if(event.key === 'MainStatistics'){
            setMainStatistic();
        }else if(event.key === 'addTaskList'){
            loadOtherTasksFromStorage('addTaskList');
        }else if(event.key === 'deletedTaskList'){
            loadOtherTasksFromStorage('deletedTaskList');
        }else if(event.key === 'editTaskList'){
            loadOtherTasksFromStorage('editTaskList');
        }else if(event.key === 'doneTaskList'){
            loadOtherTasksFromStorage('doneTaskList');
        }else{
            return;
        }
        
    });
}