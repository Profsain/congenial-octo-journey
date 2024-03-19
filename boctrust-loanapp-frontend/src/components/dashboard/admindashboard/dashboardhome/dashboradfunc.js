// get the current date and format it to the format "Month Day, Year"
const getCurrentDateFormatted = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    
    return `${month} ${day}, ${year}`;
}

// get the date of yesterday and format it to the format "Month Day, Year"
const getYesterdayDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const month = yesterday.toLocaleString('default', { month: 'long' });
    const day = yesterday.getDate();
    const year = yesterday.getFullYear();
    
    return `${month} ${day}, ${year}`;
}

// get current month and year
const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = months[monthIndex];
    
    return `${currentMonth}, ${year}`;
}

// get last month
const getLastMonthAndYear = () =>{
    const currentDate = new Date();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    
    // Subtract one month from the current month
    if (month === 0) { // January
        month = 11; // December
        year -= 1; // Decrease year by 1
    } else {
        month -= 1;
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const lastMonth = months[month];
    
    return `${lastMonth}, ${year}`;
}

// get current year
const getCurrentYear = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    
    return year;
}
export { getCurrentDateFormatted, getYesterdayDate, getCurrentMonthAndYear, getLastMonthAndYear, getCurrentYear}