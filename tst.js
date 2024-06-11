function findMissingElements(oldArray, newArray) {
    return oldArray.filter(item => !newArray.includes(item));
}

// Example usage:
const oldArray = [1, 2, 3, 4, 5];
const newArray = [1, 2, 5, 6, 7, 8];
const result = findMissingElements(oldArray, newArray);

console.log(result); // Output: [3, 4]
