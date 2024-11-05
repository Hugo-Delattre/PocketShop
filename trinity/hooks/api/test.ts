const API_URL = 'https://world.openfoodfacts.org/api/v2/product/';

export async function fetchByCode(code: string): Promise<any> {
    const url = `${API_URL}${code}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}