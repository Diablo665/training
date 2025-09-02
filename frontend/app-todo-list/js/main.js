import {keyListener, menuButtonListener, autoResize, mainKeyHandler} from './events/eventHandlers.js';
import {loader} from './utils/helper.js'
import {textarea, renderTask} from './tasks/taskModel.js';
import { setThemeInLoad } from './utils/themes.js';

document.addEventListener('DOMContentLoaded', function(){
    setThemeInLoad();
    loader(1);

    menuButtonListener();
    keyListener()
    textarea.addEventListener('input', autoResize);

    renderTask()

    mainKeyHandler()
});