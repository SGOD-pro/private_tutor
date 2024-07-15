export const filterBatches = (data:any[]) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDay = daysOfWeek[new Date().getDay()];
    const currentTime = new Date();
    const updatedTime:any = new Date(currentTime.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);

    const filteredBatches = data.filter(batch => {
        const batchDays = batch.days.split(', ').map((day:any) => day.trim());
        if (!batchDays.includes(currentDay)) {
            return false;
        }

        const [startTime, endTime] = batch.time.split(' - ').map((time:any) => {
            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            return date;
        });

        return updatedTime > startTime && endTime < updatedTime;
    });
    if (filteredBatches.length === 0) return null;

    let recentBatch = filteredBatches[0];
    let minDifference = Infinity;
    filteredBatches.forEach(batch => {
        const endTime = batch.time.split(' - ')[1];
        const [hours, minutes] = endTime.split(':');
        const endDate = new Date();
        endDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        const endTimeDiff:any = new Date(endDate.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000)
        const difference = Math.abs(updatedTime - endTimeDiff);
        if (difference < minDifference) {
            minDifference = difference;
            recentBatch = batch;
        }
    });
    return {code:recentBatch._id,name:recentBatch.subject};
};
