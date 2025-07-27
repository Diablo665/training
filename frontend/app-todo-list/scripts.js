/*--------------- Выполняем рендер когда страница загрузится ------------------ */
document.addEventListener("DOMContentLoaded", function() {
    renderTask()
    /*--------------- Добавление возможности отправки формы по кнопке Enter ------------------ */
let enterForm = document.getElementById("newTask");
enterForm.addEventListener("keypress", function(elem) {
     if (elem.keyCode == 13){
        addTask()
     }
})

});


/*--------------- Рендер тасков при загрузке страницы, а также удалении/добавлении таска ------------------ */
function renderTask(){
    let taskList = getTasks();
    if(taskList.length > 0){

        taskPlace = document.querySelector('.taskList');
        taskPlace.innerHTML = "";
        taskList.forEach(task => {
            taskPlace.insertAdjacentHTML('beforeend', 
                `
                <div class = 'task ${task.completed  ? "done" : ""}', id="${task.id}"> 
                    <input name = 'Check' type ="checkbox" ${task.completed ? "checked=checked" : ""} onclick = "taskDone(this)">
                    <span> ${task.text} </span>
                    <ion-icon name="trash" class = trash onclick="deleteTask(this)"></ion-icon>
                </div> 
                `
            )
        })
        
    }else{
        // Место для будущей заглушки если созданных тасков ещё нет
    }
    deleteAllButtonStatus()
}

/*--------------- Получаем список тасков с localStorage ------------------ */
function getTasks(){
    const taskList = localStorage.getItem('tasks');
    if(taskList) {
        return JSON.parse(taskList)
    }
    return [];
}

/*--------------- Удалить 1 таск по кнопке корзины в элементе ------------------ */
function deleteTask(elem){
    let id = Number(elem.parentNode.id);
    let tasks = getTasks();
    tasks = tasks.filter(task => Number(task.id) !== id)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    document.getElementById(id).remove();
    renderTask()

}

/*--------------- Удалить все таски которые отмечены решенными ------------------ */

function deleteAllChecked(){
    let allCheckeElement = document.querySelectorAll('input[name="Check"]:checked');
    let tasks = getTasks();
    for (let element of allCheckeElement) {
        tasks = tasks.filter(task => Number(task.id) !== Number(element.parentNode.id))
        document.getElementById(element.parentNode.id).remove();
    }
    localStorage.setItem('tasks', JSON.stringify(tasks))
    renderTask()
}


/*--------------- Получить последний ID элемента + 1 ------------------ */
function getLastId(){
    try{
        const item = document.getElementsByClassName("task");
        const lastchild = item[item.length-1];
        return Number(lastchild.id) + 1;
    }
    catch{
        return 1
    }
}


/*--------------- Добавление нового таска ------------------ */
function addTask(){
    let taskText = document.getElementById('newTask');
    if (taskText.value.trim().length > 0){
        const newTask = {id: getLastId(), text: taskText.value, completed: false}
        let tasks = getTasks();
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks))
        renderTask();
        taskText.value = '';
        }
}

/*--------------- Отметка тасков решенными/нерешенными ------------------ */
function taskDone(elem){
    let id = Number(elem.parentNode.id);
    let tasks = getTasks();
    const index = tasks.findIndex(task => task.id === id);
    
    if (index !== -1) {
        tasks[index].completed = tasks[index].completed ? false : true;
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTask()
    }else{
        alert('Ошибка удаления')
    }
      
}


/*--------------- Активация/деактивация кнопки удаления нескольких тасков ------------------ */
function deleteAllButtonStatus(){
    let allCheckeElement = document.querySelectorAll('input[name="Check"]:checked');
    var deleteAllChecked = document.querySelector('.deleteTask')
    if(allCheckeElement.length > 0){
        deleteAllChecked.classList.remove('deactive');
    }else{
        deleteAllChecked.classList.add('deactive');
    }
}

