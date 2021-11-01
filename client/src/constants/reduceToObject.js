export default function reduceArrayToObject (array) {
    return array.reduce((acc, key) => ({ ...acc, [key]: key }));
}
