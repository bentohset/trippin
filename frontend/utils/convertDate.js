export function convertDate(date) {
    if (!date) {
        return 'no date'
    }
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const day = date.slice(8, 10); //8 and 9
    const monthDec = date.slice(5, 7);
    const monthIndex = parseInt(date.slice(5, 7)); //5 and 6
    const year = date.slice(0, 4); //0-3 index
    const month = monthNames[monthIndex];
    return `${day}/${monthDec}`;
}

export function convertFullDate(date) {
    if (!date) {
        return 'no date'
    }
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const dateObject = new Date(date);
    const dayOfWeek = dateObject.getDay();
    const day = date.slice(8, 10); //8 and 9
    const monthDec = date.slice(5, 7);
    const monthIndex = parseInt(date.slice(5, 7)); //5 and 6
    const year = date.slice(0, 4); //0-3 index
    const month = monthNames[monthIndex - 1];
    return `${dayNames[dayOfWeek]}, ${day} ${month}`;
}