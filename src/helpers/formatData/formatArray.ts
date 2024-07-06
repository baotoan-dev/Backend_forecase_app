const formatToArrayNumber = (data: any) : number[] => {
    if (!data) return [];
    if (Array.isArray(data)) {
        return data.map((item) => Number(item));
    } else {
        return [Number(data)];
    }
}

const formatToStringNumberArray = (data: any) : string[] => {
    if (!data) return [];
    if (Array.isArray(data)) {
        return data.map((item) => String(item));
    } else {
        return [String(data)];
    }
}

export { formatToArrayNumber, formatToStringNumberArray };