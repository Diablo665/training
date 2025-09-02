import { appState } from "../tasks/taskModel.js";
const icon = document.querySelector('#iconType')

export function setThemeInLoad(){

    const saved = localStorage.getItem('appTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved === 'dark' || saved === 'light') {
        appState.theme = saved;
    }

    else {
        appState.theme = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', appState.theme);
    updateThemeButton()

    
}

export function updateTheme(){
    if(appState.theme === 'dark'){
        appState.theme = "light";
        icon.setAttribute('name', 'moon')
        
    }else{
        appState.theme = "dark";
        icon.setAttribute('name', 'sunny')
    }

    document.documentElement.setAttribute('data-theme', appState.theme);
    localStorage.setItem('appTheme', appState.theme)
}

function updateThemeButton(){
    (appState.theme === "dark") ? icon.setAttribute('name', 'sunny') : icon.setAttribute('name', 'moon');
}