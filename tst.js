function getAdjustedHourAndDay() {
    // Get the current time
    let now = new Date();

    // Extract day of the week, hours, and minutes
    let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
    let currentDay = daysOfWeek[now.getDay()];
    let currentHour = now.getHours();
    let currentMinute = now.getMinutes();

    let adjustedHour;
    if (currentMinute > 30) {
        adjustedHour = (currentHour + 1) % 24; // Ensure it wraps around 24-hour format
    } else {
        adjustedHour = currentHour;
    }

    // Format the result as HH:00
    let adjustedTime = adjustedHour.toString().padStart(2, '0') + ":00";

    // Combine the day and adjusted time
    let adjustedDateTime = `${currentDay} ${adjustedTime}`;

    return adjustedDateTime;
}

// Example usage
console.log(getAdjustedHourAndDay());
