export function arrayDifference(oldArray: any[], newArray: any[]): { decrease: any[], increase: any[] } {
    const array1Set = new Set(oldArray);
    const array2Set = new Set(newArray);

    const decrease = oldArray.filter(element => !array2Set.has(element));
    const increase = newArray.filter(element => !array1Set.has(element));

    return { decrease, increase };
}

// const array1 = [1, 2, 3, 4, 5];
// const array2 = [4, 5, 6, 7, 8];

// const result = arrayDifference(array1, array2);
// console.log("decrease", result.decrease);
// console.log("increase", result.increase);