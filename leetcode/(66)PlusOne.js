function plusOne(stringArray) {
  
  let newNumber = +stringArray.join('') + 1;

  let  newArray = String(newNumber).split('');
  
  return newArray.map(elem => parseInt(elem))
  
}