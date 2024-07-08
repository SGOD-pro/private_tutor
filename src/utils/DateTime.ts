export function extractTime(dateString: string): string {
	const date = new Date(dateString);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
}
export function extractDate(dateString: string|Date): string {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
}
export function getNextHour(timeStr: string) {
	if (timeStr.trim() === "") {
		return;
	}
	let [hours, minutes] = timeStr.split(":").map(Number);
	hours += 1;
	if (hours === 24) {
		hours = 0;
	}
	let nextHourStr = hours.toString().padStart(2, "0") + `:${minutes}`;

	return nextHourStr;
}
export function getPreviousHour(timeStr: string) {
	if (timeStr.trim() === "") {
		return;
	}
	let [hours, minutes] = timeStr.split(":").map(Number);
	hours -= 1;
	if (hours === -1) {
		hours = 23;
	}
	let nextHourStr = hours.toString().padStart(2, "0") + `:${minutes}`;

	return nextHourStr;
}

export function getMonthName(dateObj: Date): string {
	const monthsArray: string[] = [
		"January",
		"Febuary",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const date = new Date(dateObj);
	const index = date.getMonth();
	return monthsArray[index];
}

export function getNextMonth(dateObj: Date): Date {
	const latestPaidMonth = new Date(dateObj);
	latestPaidMonth.setFullYear(latestPaidMonth.getFullYear());
	latestPaidMonth.setMonth(latestPaidMonth.getMonth() + 1);
	return latestPaidMonth;
}

export function monthsDifference(date1:Date|string, date2:Date|string):number {
    const startDate = date1 < date2 ? new Date(date1) : new Date(date2);
    const endDate = date1 < date2 ? new Date(date2) : new Date(date1);
    
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    
    const yearDiff = endYear - startYear;
    const monthDiff = endMonth - startMonth;
    
    const totalMonths = yearDiff * 12 + monthDiff;
    
    return totalMonths;
}

