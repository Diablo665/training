const testApiURL = new URL("https://jsonplaceholder.typicode.com/todos/") // ссылка на тестовый API
const textarea = document.querySelector('textarea'); // 
const editConteiner = document.getElementsByClassName('editConteiner')[0];
let editID;

document.addEventListener("DOMContentLoaded", function() {
    loader(1);
    renderTask();
    addKeyListen("newTask", addTask); 
    addKeyListen("editForm", editTask); 

});


/* Функция для добавления отправки форм по кнопке Enter. В качестве парамента получает IDэлемента и название функции которую нужно будет выполнить */
function addKeyListen(elemID, functionName){
    let elem = document.getElementById(elemID);

    elem.addEventListener("keypress", function(elem) {
    if (elem.keyCode == 13){
        functionName()
    }
    })
}

/*--------------- Рендер тасков при загрузке страницы, а также удалении/добавлении таска ------------------ */
async function renderTask(){
    let taskList = await getTasks();
    taskPlace = document.querySelector('.taskList');
    
    if(taskList.length > 0){
        taskPlace.innerHTML = "";

        taskList.forEach(task => {
            taskPlace.insertAdjacentHTML('beforeend', 
                `
                <div class = 'task ${task.completed  ? "done" : ""}', id="${task.id}"> 
                    <input data-inputid="${task.id}" name = 'Check' type ="checkbox" ${task.completed ? "checked=checked" : ""} onclick = "taskDone(${task.id})">
                    <span data-textid="${task.id}"> ${task.title} </span>
                    <span class = taskButtons>
                        <ion-icon name="create" class = edit onclick="openTaskEdit(${task.id})"></ion-icon>
                        <ion-icon name="trash" class = trash onclick="deleteTask(${task.id})"></ion-icon>
                    </span>
                </div> 
                `
            )
        })

        loader(0)
    }else{
        taskPlace.innerHTML = "<h3> Новых задач пока нет </h3><img src='img/non-task.png' alt='Задачи отсутсвуют' width='300px' height='300px'>"
    }
}

/*--------------- Получаем список тасков с localStorage ------------------ */
async function getTasks(){
    try{
        const response = await fetch(testApiURL);

        if(response.ok){
            const json = await response.json();
            return json
        }else{
            throw new Error(`При загрузке задач произошла ошмбка. 
                Попробуйте перезагрузить страницу или немного подождать, мы уже пытаемся получить данные с сервера`)
        }

    }catch(error){
        showNotification({
            type: 'error',
            message: 'Что-то пошло не так',
            details: error.message
        });
        setTimeout(() => {getTasks(1)}, 3000)
    }
}

/*--------------- Удалить 1 таск по кнопке корзины в элементе ------------------ */
async function deleteTask(id){

    try{
        const response = await fetch(testApiURL + id, {
            method: "DELETE"
        })

        if (!response.ok) {
            throw new Error(`Ошибка при удалении: ${response.statusText}`);
        }

        const taskElement = document.getElementById(id);

        if (!taskElement) {
            throw new Error('Элемент не найден');
        }

        deleteAnimation(taskElement);

    }catch(error){
        showNotification({
            type: 'error',
            message: 'При удалении возникла ошибка. Повторите попытку позже',
            details: error.message
        });
    }
}


function deleteAnimation(element){
    element.classList.add('fade-out');
    
    // Удаляем элемент после завершения анимации
    setTimeout(() => {
        element.remove(); 

        showNotification({
            type: 'success',
            message: 'Задача удалена',
            details: ""
        });

    }, 250);
}

/*--------------- Удалить все таски которые отмечены решенными ------------------ */

function deleteAllChecked(){

    showNotification({
        type: 'info',
        message: 'Функция в разработке',
        details: ""
    });

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
async function addTask(){

    let taskText = document.getElementById('newTask');
    let id = getLastId();
    if (taskText.value.trim().length > 0){

        try{
            const newTask = {userId: 1, id: id, title: taskText.value, completed: false}
            const response = await fetch(testApiURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newTask),
            })

            if(response.ok){

                showNotification({
                    type: 'success',
                    message: 'Задача добавлене',
                    details: `Текст задачи: ${taskText.value}`
                });

                taskText.value = '';
            }else {
                throw new Error("Ошибка добавления задачи попробуйте повторить попытку позже")
            }
        }catch(error){
            showNotification({
                type: 'error',
                message: 'Что-то пошло нет так...',
                details: error.message
            });
        }


    }else{
        showNotification({
            type: 'warning',
            message: 'Проверьте корректность данных',
            details: "Задача не может быть пустой или состоять только из пробелов"
        });
    }
}

/*--------------- Отметка тасков решенными/нерешенными ------------------ */
async function taskDone(id){
    try{
        const task = await getTaskJson(id);
        const updatedTask = document.getElementById(`${id}`);
        const newJson = {
            userId: task.userId, 
            id: task.id, 
            title: task.title, 
            completed: task.completed ? false : true
        }

        const toggleClass = () => 
                updatedTask.classList.toggle('done');

        toggleClass();

        const response = await fetch(testApiURL + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newJson),
        
        })

        if (!response.ok) {

            toggleClass();
            throw new Error('Ошибка при обновлении задачи');

        }
    }catch(error){
        console.error('Произошла ошибка:', error.message);

        showNotification({
            type: 'error',
            message: 'Что-то пошло не так',
            details: error.message
        });

    }

}

async function getTaskJson(id) {

    try {
        const response = await fetch(testApiURL + id);
        
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.statusText}`);
        }

        const json = await response.json();
        return json;

    } catch (error) {
        console.error('Произошла ошибка:', error.message);
    }
}
/*--------------- Редактирование тасков ------------------ */

async function editTask(){ 
    
    if(textarea.value.trim().length > 0 && confirm("Сохранить изменения?")){
        try{

            const editTask = await getTaskJson(editID);
            const status = document.querySelector('select');
            const newTaskJson =  {
                userId: editTask.userId, 
                id: editTask.id, 
                title: textarea.value, 
                completed:  status.selectedIndex ? false : true
            }
        
            const response = await fetch(testApiURL + editID, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newTaskJson),

            })

            if(!response.ok){
                throw new Error('Задачу не получилось отредактировать. Повторить попытку позже')
            }else{

                const task = document.getElementById(editID);
                if(newTaskJson.completed){
                    task.classList.add('done')
                    document.querySelector(`[data-textid="${editID}"]`).textContent = newTaskJson.title;
                    document.querySelector(`[data-inputid="${editID}"]`).checked = true;
                  }else{  
                    task.classList.remove('done')
                    document.querySelector(`[data-inputid="${editID}"]`).checked = false;
                }

                showNotification({
                    type: 'success',
                    message: 'Задача обновлена',
                    details: ""
                });
            }
        }catch(error){
            showNotification({
                type: 'error',
                message: 'Что-то пошло не так',
                details: error.message
            });
        }
    }else{
        showNotification({
            type: 'warning',
            message: 'Проверьте корректность данных',
            details: "Задача не может быть пустой или состоять только из пробелов"
        });
    }
}

/*--------------- Открыть блок редактирования ------------------ */
function openTaskEdit(id){
    let taskText = document.querySelector(`[data-textid="${id}"]`).textContent;

    editConteiner.style.display = 'block';
    document.body.style.overflow = 'hidden';

    textarea.focus();
    textarea.value = taskText;

    editID = Number(id);

    autoResize()
    
}

/*--------------- Закрыть блок редактирования ------------------ */
function closeTaskEdit(){

    editConteiner.style.display = 'none';
    document.body.style.overflow = '';

}


/*--------------- Ресайз блока редактирования ------------------ */
function autoResize() {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

try{
    textarea.addEventListener('input', autoResize);
}catch{
    textarea.attachEvent('oninput', autoResize);
}



function loader(status){

    if(status){
        let taskPlace = document.querySelector('.taskList');
        taskPlace.insertAdjacentHTML('beforeend', "<div class='loader'> </div>")
    }else{
        document.querySelector('.loader').remove()
    }
}

function showNotification({ type, message, details }) {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerHTML = `
        <p>${message}</p>
        <small>${details}</small>
    `;
    
    notification.style.opacity = 0;
    notification.style.transform = 'translateY(-20px)';
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.opacity = 1;
        notification.style.transform = 'translateY(0)';
    });

    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
