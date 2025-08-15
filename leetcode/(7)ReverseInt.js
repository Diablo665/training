function reverseInt(number){
    let typeNum = number < 0;
    let reversedNum = 0;
  
    if(typeNum){
      number = -number
    }

    while (number > 0) {
        const digit = number % 10;
        reversedNum = reversedNum * 10 + digit;
        number = Math.floor(number / 10);
    }

    return typeNum ? -reversedNum : reversedNum
}
