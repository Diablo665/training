import {editTask, addTask, taskDone, deleteTask} from '../tasks/taskList.js'
import { openTaskEdit, closeTaskEdit } from '../utils/helper.js';
import {textarea} from '../tasks/taskModel.js';
import { chooseAll, doneAll, deleteAll } from '../utils/massActions.js'

function addKeyListen(elemID, functionName){
    let elem = document.getElementById(elemID);

    elem.addEventListener("keypress", function(elem) {
    if (elem.keyCode == 13){
        functionName()
    }
    })
}

export function menuButtonListener(){
    const filtersToggle = document.querySelector('#filtersToggle');
    const filtersMenu = document.querySelector('.filters-menu');
    const filterLine = document.querySelector('.filter-line')

    filtersToggle.addEventListener('click', () => {
        if (filtersMenu.style.display === 'none') {
            filtersMenu.style.display = 'block';
            filtersMenu.classList.add('active');
            filterLine.innerHTML = 'Скрыть меню'
        } else {
            filtersMenu.classList.remove('active');
            setTimeout(() => {
                filtersMenu.style.display = 'none';
                filterLine.innerHTML = 'Открыть меню'
            }, 300);
        }
    })

}

export function autoResize() {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

export function keyListener(){
    addKeyListen("newTask", addTask); 
    addKeyListen("editForm", editTask); 
}

export function mainKeyHandler(){
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) { 
            return;
        }

        const action = btn.dataset.action;
        const id = Number(btn.dataset.id);

        switch (action) {

        case 'add':
            addTask();
            break;

        case 'done':
            taskDone(id);
            break;
        
        case 'delete':
            deleteTask(id);
            break

        case 'openEdit':
            openTaskEdit(id);
            break
        case 'closeEdit':
            closeTaskEdit();
            break

        case 'edit':
            editTask();
            break

        case 'selectAll':
            chooseAll();
            break

        case 'doneAll':
            doneAll();
            break

        case 'deleteAll':
            deleteAll();
            break
        }

        


        });
}