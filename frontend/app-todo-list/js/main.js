import {keyListener, menuButtonListener, autoResize, mainKeyHandler, selectListener, searchListener} from './events/eventHandlers.js';
import {loader} from './utils/helper.js'
import {TaskManager} from './tasks/taskModel.js';
import { setThemeInLoad } from './utils/themes.js';

import '../css/main.css';
import '../css/categoryStyles.css';
import '../img/icon.ico';
import '../img/non-task.png'; 

export const taskManager = new TaskManager();
export const editConteiner = document.querySelector('.editConteiner');

document.addEventListener('DOMContentLoaded', async function(){
    setThemeInLoad();
    loader(1);
    
    const textarea = document.querySelector('textarea');
    textarea.addEventListener('input', autoResize);

    await taskManager.init()

    menuButtonListener();
    keyListener()
    mainKeyHandler()
    selectListener()
    searchListener()

}); 
