export function extractTime(dateString: string): string {
	const date = new Date(dateString);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
}
export function extractDate(dateString: string): string {
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

