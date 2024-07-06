const applicationStatusHandler = (applicationStatus: number): number => {
    if (applicationStatus === 4 || applicationStatus === 3 || applicationStatus === 2) {
        return applicationStatus; // Rejected
    }
    else {
        return 1; // Pending
    }
}

export default applicationStatusHandler;