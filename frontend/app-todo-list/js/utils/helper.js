import { testApiURL, editConteiner, textarea, appState} from '../tasks/taskModel.js';


export function loader(status){

    if(status){
        let taskPlace = document.querySelector('.taskList');
        taskPlace.insertAdjacentHTML('beforeend', "<div class='loader'> </div>")
    }else{
        document.querySelector('.loader').remove()
    }
}

export function showNotification({ type, message, details }) {
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


export function openTaskEdit(id){
   
    let taskText = document.querySelector(`[data-textid="${id}"]`).textContent;

    editConteiner.style.display = 'block';
    document.body.style.overflow = 'hidden';

    textarea.focus();
    textarea.value = taskText;

    appState.editID = id;

    autoResize()
    
}

/*--------------- Закрыть блок редактирования ------------------ */
export function closeTaskEdit(){

    editConteiner.style.display = 'none';
    document.body.style.overflow = '';

}

export async function getTaskJson(id) {

    try {
        let url = testApiURL + id;
        const response = await fetch(testApiURL + id);
        
        if (!response.ok) {
            console.log(response.status)
            console.log(url)
            throw new Error(`Ошибка запроса: ${response.statusText}`);
        }

        const json = await response.json();
        return json;

    } catch (error) {
        console.error('Произошла ошибка:', error.message);
    }
}

export function getLastId(){
    try{
        const item = document.getElementsByClassName("task");
        const lastchild = item[item.length-1];

        return Number(lastchild.id) + 1;
    }
    catch{
        return 1
    }
}

export function deleteAnimation(element){
    element.classList.add('fade-out');
    
    // Удаляем элемент после завершения анимации
    setTimeout(() => {
        element.remove(); 

        showNotification({
            type: 'success',
            message: 'Успешно удалено 👌',
            details: ""
        });

    }, 250);
}