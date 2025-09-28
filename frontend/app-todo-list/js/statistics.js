import { setMainStatistic } from './statPanel/panelModel';
import { storageListener } from './events/StatisticsEventsHandler';
import { loadAllTask } from './statPanel/panelFunc';

import '../css/statistics.css';
import '../img/iconStat.ico';

document.addEventListener('DOMContentLoaded', function () {
    setMainStatistic();
    storageListener();
    loadAllTask();
});
