function TwoSum_v1(nums, target){

    for(let i = 0; i < nums.length; i++){
        let secondNum = target - nums[i];

        if(nums.includes(secondNum)){
            return [i, nums.lastIndexOf(secondNum)]
        }
        
    }

    return "Нет подходящих чисел"
}
