export const waitUpToXSeconds = (seconds: number): Promise<true> => {
    const milliseconds = seconds * 1000
    const timeout = Math.ceil(Math.random() * milliseconds);
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve(true);
        }, timeout);
    })
}