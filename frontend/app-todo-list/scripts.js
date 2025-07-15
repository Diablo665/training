document.addEventListener("DOMContentLoaded", function() {
    UpdateAll()

});

function UpdateAll(){
    updateCheckboxListener();
    updateTrashListener();
    checked();
}

var newTask = document.getElementById('addTask')
    newTask.addEventListener("click", function() {
        text = document.getElementById('newTask');
        if (text.value.trim().length > 0){
            taskList = document.querySelector('.taskList');
            taskList.insertAdjacentHTML('beforeend', `
            <div class = "task"> 
                    <input name = 'Check' type ="checkbox">
                    <span> ${text.value} </span>
                    <ion-icon name="trash" class = trash></ion-icon>
            </div> `);
            text.value = '';
            UpdateAll()
        }

    });

    /*================================================================== */



function checked(){
    var deleteAllChecked = document.querySelector('.deleteTask')
    var allChecked = document.getElementsByName('Check');
    for(let i = 0; i < allChecked.length; i++) {
        if(document.getElementsByName('Check')[i].checked){
            deleteAllChecked.classList.remove('deactive');
            break;
        }

        deleteAllChecked.classList.add('deactive')
    }
}



const deleteAll = document.querySelector('.deleteTask');
deleteAll.addEventListener("click", function(){
    const Checked = document.getElementsByName('Check');
    for(let i = 0; i < Checked.length; i++) {
        const elem = document.getElementsByName('Check')[i];
        if(elem.checked){
            elem.parentNode.remove();
            i--;
        }
    }
    UpdateAll()
});


    /* Обновляем класс элемента с задачей в зависимости от статуса чекбокса */ 
function updateCheckboxListener(){
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
          const inputField = task.querySelector('input[type="checkbox"]'); 
        
          if (inputField.checked) {
            task.classList.add('done');
            
          } else{
            task.classList.remove('done');
          }
          checked()
        });
      });
}
/* ======================================================================== */
/*Удаление элемента из списка задач */ 
function updateTrashListener(){
    const deleteItem = document.querySelectorAll('.task');
    deleteItem.forEach(delet => {
        const item = delet.querySelector('ion-icon[name="trash"]');
        item.addEventListener('click', function(){
            item.parentNode.remove();
        
        })
    })
}