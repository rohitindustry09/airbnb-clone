function timeDisplay(createdAt) {
    const timeDifferenceMs = new Date() - new Date(createdAt);
    const secondsDifference = Math.floor(timeDifferenceMs / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);

    return daysDifference > 0
        ? `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`
        : hoursDifference > 0
            ? `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`
            : minutesDifference > 0
                ? `${minutesDifference} minute${minutesDifference !== 1 ? 's' : ''} ago`
                : `${secondsDifference} second${secondsDifference !== 1 ? 's' : ''} ago`;
}
