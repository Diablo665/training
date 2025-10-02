import { taskManager } from '../main';
import { storage } from './localStorage';

const icon = document.querySelector('#iconType');
const saved = storage.get('appTheme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

export function setThemeInLoad() {
    if (saved === 'dark' || saved === 'light') {
        taskManager.setTheme(saved);
    } else {
        const prefers = prefersDark ? 'dark' : 'light';
        taskManager.setTheme(prefers);
    }

    document.documentElement.setAttribute('data-theme', taskManager.getTheme());
    updateThemeButton();
}

export function updateTheme() {
    const theme = taskManager.getTheme();

    if (theme === 'dark') {
        taskManager.setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        taskManager.setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    storage.set('appTheme', taskManager.getTheme());
    updateThemeButton();
}

function updateThemeButton() {
    if (!icon) return;
    if (taskManager.getTheme() === 'dark') {
        icon.setAttribute('name', 'sunny');
    } else {
        icon.setAttribute('name', 'moon');
    }
}
