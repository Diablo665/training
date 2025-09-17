import { deleteTask } from "../tasks/taskList.js";

export function chooseAll() {
    const notChecked = document.querySelectorAll('input[name="Check"]:not(:checked)');

    notChecked.forEach(input => {
        input.checked = true;
    });
}

export function doneAll() {
    const checkedCheckboxes = document.querySelectorAll('input[name="Check"]:checked');

    checkedCheckboxes.forEach(checkbox => {
        const taskId = checkbox.dataset.id;
        const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);

        if (taskElement && !taskElement.classList.contains('done')) {
            taskElement.classList.add('done');
        }
    });
}

export function deleteAll() {
    const checkedCheckboxes = document.querySelectorAll('input[name="Check"]:checked');

    checkedCheckboxes.forEach(checkbox => {
        const taskId = checkbox.dataset.id;
        if (taskId) {
            deleteTask(taskId);
        }
    });
}