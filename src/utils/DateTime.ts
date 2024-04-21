export function extractTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function extractDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// // Example usage:
// const dateValue = "Sun Apr 07 2024 01:50:29 GMT+0530";
// const time = extractTime(dateValue);
// const date = extractDate(dateValue);
// console.log("Time:", time); // Output: Time: 01:50
// console.log("Date:", date); // Output: Date: 07-04-2024
