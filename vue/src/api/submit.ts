type SubmitResult = {
    kind: string;
    errors: {
        field: string;
        path: string;
        title: string;
        detail: string;
    }[]
}

export const submit = async (data: any) => {
    const response = await fetch("/portfolio/submit", {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        throw new Error(await response.text())
    }

    return await response.json() as SubmitResult
  }