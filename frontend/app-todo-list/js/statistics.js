import { setMainStatistic } from "./statPanel/panelModel.js";
import { storageListener } from "./events/StatisticsEventsHandler.js";
import { loadAllTask } from "./statPanel/panelFunc.js";

import '../css/statistics.css';
import '../img/iconStat.ico';


document.addEventListener('DOMContentLoaded', function(){
    setMainStatistic()
    storageListener()
    loadAllTask()
}) 