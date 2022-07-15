export const getPortfolioStatus = async (portfolioId: string, headers: Record<string, string> = {}): Promise<any> => {
    const response = await fetch(`/portfolio/status?id=${portfolioId}`, {
        method: "GET",
        headers,
    });

    const data = await response.json()

    if (!response.ok) {
        throw new Error(JSON.stringify({
            message: await response.text(),
            status: response.status,
        }))
    }

    return data
}

export default getPortfolioStatus