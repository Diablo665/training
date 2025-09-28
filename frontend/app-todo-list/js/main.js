import {
    keyListener,
    menuButtonListener,
    autoResize,
    mainKeyHandler,
    selectListener,
    searchListener,
} from './events/eventHandlers.js';
import { loader } from './utils/helper';
import { TaskManager } from './tasks/taskModel';
import { setThemeInLoad } from './utils/themes';

import '../css/main.css';
import '../css/categoryStyles.css';
import '../img/icon.ico';
import '../img/non-task.png';

export const taskManager = new TaskManager();
export const editConteiner = document.querySelector('.editConteiner');
export const textarea = document.querySelector('textarea');

document.addEventListener('DOMContentLoaded', async function () {
    setThemeInLoad();
    loader(1);

    textarea.addEventListener('input', autoResize);

    await taskManager.init();

    menuButtonListener();
    keyListener();
    mainKeyHandler();
    selectListener();
    searchListener();
});
