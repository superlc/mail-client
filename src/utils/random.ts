export const randomCount = (count: number) => Math.floor(Math.random() * count);

export function randomPick<T>(arr: Array<T>): T {
    const count = arr.length;
    return arr[randomCount(count)];
}

export const randomRgb = () => {
    return `rgb(${randomCount(255)}, ${randomCount(255)}, ${randomCount(255)})`;
};