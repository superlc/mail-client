export const randomCount = (count: number) => Math.floor(Math.random() * count);

export function randomPick<T>(arr: Array<T>): T {
    const count = arr.length;
    return arr[randomCount(count)];
}

export const randomRgb = () => {
    return `rgb(${randomCount(255)}, ${randomCount(255)}, ${randomCount(255)})`;
};

const RedColors = ['#f46e65', '#f04134', '#d73435', '#bd2636', '#a31837'];
const GreenColors = ['#3dbd7d', '#00a854', '#00924c', '#007b43', '#00643b'];
const BlueColors = ['#49a9ee', '#108ee9', '#108ee9', '#0c60aa', '#09488a'];
const PinkColors = ['#f7629e', '#f5317f', '#dc277d', '#c11c7b', '#a71278'];
const OrangeColors = ['#f78e3d', '#f56a00', '#d75000', '#b93600', '#991b00'];
const PurpleColors = ['#948aec', '#948aec', '#948aec', '#533eb4', '#42299a'];

const Colors = [...RedColors, ...GreenColors, ...BlueColors, ...PinkColors, ...OrangeColors, ...PurpleColors];

export const hashAvatarBgColor = (c: string) => {
    return Colors[(c.charCodeAt(0) - 'A'.charCodeAt(0)) % Colors.length];
};