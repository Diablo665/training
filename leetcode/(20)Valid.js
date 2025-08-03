
function isValid(bracketString){

    const bracketMap = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    const bracketStack = [];
    
    for (let char of bracketString) {

        if (bracketMap[char]) {
          
            const topElement = bracketStack.length > 0 ? bracketStack.pop() : '#';
            
            if (bracketMap[char] !== topElement) {
                return false;
            }
        } else {
          
            bracketStack.push(char);
        }
    }
    
    return bracketStack.length === 0;
    
}