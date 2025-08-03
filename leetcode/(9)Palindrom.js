

/* Способ один: 
Преобразуем числа в строку, переверачиваем строку  и стравниваем с первым значением.
Если числа будут совпадать значит они палиндромы

*/
function isPalindrome_v1(number){

    return String(number) == String(number).split('').reverse().join('')

}

/* Способ два не преобразовывая число в строку.

1. Преобразовываем число в массив
2. копируем второй массив, но в перевёрнутом виде
3. Пробегаем по массиву и стравниваем числа
*/

function isPalindrome_v2(number){

    if(number < 0){
      return false
    }
  
    let numArray = Array.from(String(number), Number);
    let numReverse = numArray.slice(0).reverse()
    
    for(let i = 0; i < numArray.length; i++){
      
      if(numArray[i] != numReverse[i]){
        return false
      }
      
    }
    return true
}

/* Способ три, математический.

*/

function isPalindrome_v3(number){

    if (number < 0) {
        return false;
    }
    
    let originalNum = number;
    let reversedNum = 0;
    
    while (number > 0) {
        const digit = number % 10;
        reversedNum = reversedNum * 10 + digit;
        number = Math.floor(number / 10);
    }
    
    return originalNum === reversedNum;

}