import {keyListener, menuButtonListener, autoResize, mainKeyHandler} from './events/eventHandlers.js';
import {loader} from './utils/helper.js'
import {textarea, renderTask} from './tasks/taskModel.js';

document.addEventListener('DOMContentLoaded', function(){

    loader(1);

    menuButtonListener();
    keyListener()
    textarea.addEventListener('input', autoResize);

    renderTask()

    mainKeyHandler()
});