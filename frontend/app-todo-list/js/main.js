import {keyListener, menuButtonListener, autoResize, mainKeyHandler, selectListener, searchListener} from './events/eventHandlers.js';
import {loader} from './utils/helper.js'
import {textarea, renderTask} from './tasks/taskModel.js';
import { setThemeInLoad } from './utils/themes.js';
import { search } from './filters/filters.js';

document.addEventListener('DOMContentLoaded', function(){
    setThemeInLoad();
    loader(1);

    textarea.addEventListener('input', autoResize);

    menuButtonListener();
    renderTask()
    keyListener()
    mainKeyHandler()
    selectListener()
    searchListener()
});