import { openTaskEdit, closeTaskEdit } from '../utils/helper';
import { taskManager, textarea } from '../main';
import { chooseAll, doneAll, deleteAll } from '../utils/massActions';
import { search, sort, getFiltered } from '../filters/filters';
import { updateTheme } from '../utils/themes';
import { measureFunction } from '../utils/statistics';

const filtersMenu = document.querySelector('.filters-menu');
const filterLine = document.querySelector('.filter-line');

function addKeyListen(elemID, callback) {
    const elem = document.getElementById(elemID);
    if (!elem) return;

    elem.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            callback();
        }
    });
}

export function menuButtonListener() {
    const filtersToggle = document.querySelector('#filtersToggle');
    if (!filtersToggle || !filtersMenu || !filterLine) return;

    filtersToggle.addEventListener('click', () => {
        if (
            filtersMenu.style.display === 'none' ||
            getComputedStyle(filtersMenu).display === 'none'
        ) {
            filtersMenu.style.display = 'block';
            filtersMenu.classList.add('active');
            filterLine.textContent = 'Скрыть меню';
        } else {
            filtersMenu.classList.remove('active');
            setTimeout(() => {
                filtersMenu.style.display = 'none';
                filterLine.textContent = 'Открыть меню';
            }, 300);
        }
    });
}

export function autoResize() {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

export function keyListener() {
    addKeyListen('newTask', taskManager.addTask.bind(taskManager));
    addKeyListen('editForm', taskManager.editTask.bind(taskManager));
}

export function mainKeyHandler() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const id = Number(btn.dataset.id);

        switch (action) {
            case 'add':
                measureFunction(taskManager.addTask.bind(taskManager));
                break;
            case 'done':
                measureFunction(taskManager.taskDone.bind(taskManager), id);
                break;
            case 'delete':
                measureFunction(taskManager.deleteTask.bind(taskManager), id);
                break;
            case 'openEdit':
                openTaskEdit(id);
                break;
            case 'closeEdit':
                closeTaskEdit();
                break;
            case 'edit':
                measureFunction(taskManager.editTask.bind(taskManager));
                break;
            case 'selectAll':
                chooseAll();
                break;
            case 'doneAll':
                doneAll();
                break;
            case 'deleteAll':
                deleteAll();
                break;
            case 'search':
                search();
                break;
            case 'setTheme':
                updateTheme();
                break;
            default:
                break;
        }
    });

    document.addEventListener('keydown', (e) => {
        const element = e.target.closest('[data-action]');
        if (!element) return;

        const tagName = e.target.tagName;
        const isInteractive = ['A', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(tagName);
        if (isInteractive) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click();
        }
    });
}

export function selectListener() {
    const selectors = document.querySelectorAll('.categoryFilter');
    selectors.forEach((elem) => {
        elem.addEventListener('change', (event) => {
            const type = event.target.value;
            if (['all', 'completed', 'notCompleted'].includes(type)) {
                getFiltered(type);
            } else if (['default', 'completed-start', 'completed-end'].includes(type)) {
                sort(type);
            }
        });
    });
}

export function searchListener() {
    let searchTimeout;
    const searchInput = document.querySelector('#searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            search(query);
        }, 500);
    });
}
