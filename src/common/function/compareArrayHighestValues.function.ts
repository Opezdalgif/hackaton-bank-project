export function compareArrayValues(arr: any[]) {
    let counts = {};

    for (let i = 0; i < arr.length; i++) {
        let value = arr[i];
        counts[value] = (counts[value] || 0) + 1;
    }

    let mostCommonValues = [];
    let leastCommonValues = [];
    let maxCount = 10;
    let minCount = 3;

    for (var value in counts) {
        if (counts[value] >= maxCount) {
            console.log(counts[value])
            mostCommonValues.push(value);
        } 


        if (counts[value] <= minCount) {
            leastCommonValues.push(value);
        } 
    }

    let averageValueArray: string[] = []

    arr.forEach(value => {
        if (!mostCommonValues.includes(value) && !leastCommonValues.includes(value)) {
            averageValueArray.push(value);
        }
    });

    averageValueArray = Array.from(new Set(averageValueArray));
    
    return {
        mostCommonValues,
        leastCommonValues,
        averageValueArray
    };
}