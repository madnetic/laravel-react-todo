export const toCamelCase = (obj) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        const newKey = key.replace(/(_[a-z])/g, (str) => str[1].toUpperCase());
        newObj[newKey] = obj[key];
    });
    return newObj;
}

export const getCSRF = () => {
    return document.head.querySelector('meta[name="csrf-token"]').getAttribute('content');
}
