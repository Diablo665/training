import { taskManager, editConteiner, textarea} from "../main.js";

const taskPlace = document.querySelector('.taskList');

export function loader(status) {
    
    if (status) {
        if (!document.querySelector('.loader')) {
            taskPlace.insertAdjacentHTML('beforeend', "<div class='loader'></div>");
        }
    } else {
        const loader = document.querySelector('.loader');
        if (loader) loader.remove();
    }
}

export function showNotification({ type, message, details }) {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerHTML = `
        <p>${message}</p>
        <small>${details || ''}</small>
    `;

    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

export function openTaskEdit(id) {
    
    const taskElement = document.querySelector(`[data-textid="${id}"]`);
    if (!taskElement) {
        console.warn(`Элемент с data-textid="${id}" не найден.`);
        return;
    }
    const taskText = taskElement.textContent;

    editConteiner.style.display = 'block';
    document.body.style.overflow = 'hidden';

    textarea.value = taskText;
    textarea.focus();

    taskManager.setEditID(id);

    autoResize();
}

export function closeTaskEdit() {
    editConteiner.style.display = 'none';
    document.body.style.overflow = '';
}

export function getLastId() {
    try {
        const items = document.getElementsByClassName('task');
        if (items.length === 0) return 1;

        const lastChild = items[items.length - 1];
        return Number(lastChild.id) + 1 || 1;
    } catch {
        return 1;
    }
}

export function deleteAnimation(element) {
    if (!element) return;
    element.classList.add('fade-out');

    setTimeout(() => {
        element.remove();

        showNotification({
            type: 'success',
            message: 'Удалено 👌',
            details: ''
        });
    }, 250);
}