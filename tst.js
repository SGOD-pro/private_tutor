function arrayDifference(array1, array2) {
    const array1Set = new Set(array1);
    const array2Set = new Set(array2);

    const decrease = array1.filter(element => !array2Set.has(element));
    const increase = array2.filter(element => !array1Set.has(element));

    return { decrease, increase };
}

const array1 = [1, 2, 3, 4, 5];
const array2 = [4, 5, 6, 7, 8];

const result = arrayDifference(array1, array2);
console.log("decrease", result.decrease);
console.log("increase", result.increase);
