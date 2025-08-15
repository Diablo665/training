function firstUnique(str){
  
    let LastIndex = -1;
    
    for(let i = 0; i < str.length; i++){
      if(str.indexOf(str[i]) == str.lastIndexOf(str[i])){
        LastIndex = i
        break
      }
    }
    
    return LastIndex
  }
  