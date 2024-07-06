const isNumber = (value: any): boolean => {
    return (typeof value === 'number' || value instanceof Number) ||
        (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value)));
}

const isArrayNumber = (value: any): boolean => {
    if (Array.isArray(value)) {
        return value.every((item) => isNumber(item));
    }
    return false;
}

export { isNumber, isArrayNumber };