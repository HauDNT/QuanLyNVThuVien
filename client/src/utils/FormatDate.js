export const formatAndDisplayDate = (dateString) => {
    const date = new Date(dateString);
    dateString = 
        `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    return dateString;
};