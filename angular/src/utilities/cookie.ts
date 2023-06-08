export const getCookies = (): Record<string, string> => document.cookie
    .split('; ')
    .reduce((acc, next) => {
        const [key, value] = next.split('=')
        if (!key) {
            return acc
        }

        return {
            ...acc,
            [key]: value
        }
    }, {})

export const SESSION_ID = 'demo-session-id'