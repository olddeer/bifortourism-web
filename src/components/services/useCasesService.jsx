export const fetchUseCases = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/useCases');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching use cases:", error);
        throw error;
    }
};

export const saveUseCases = async (requestBody) => {
    try {
        const response = await fetch("http://localhost:8080/api/useCases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching use cases:", error);
        throw error;
    }
};