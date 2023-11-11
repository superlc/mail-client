export const download = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
};

export const getSizeDes = (size: number) => {
    const units = ['B', 'KB', 'MB', 'G'];
    let i = 0;
    while (size > 1024 && i < units.length) {
        size = size / 1024;
        i += 1;
    }
    return `${size.toFixed(2)}${units[i]}`;
};
