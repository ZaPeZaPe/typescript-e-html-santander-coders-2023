class ApiAuth {
    public static getKey() {
        return "APIKEY"
    }
}

export class MakeSearch {
    static baseUrl = `https://www.googleapis.com/books/v1/volumes?key=${ApiAuth.getKey()}&`
    public static async searchBook(search:string) {
        return fetch(this.baseUrl+`q=${encodeURIComponent(search)}`).then(response => {
            if (!response.ok) {
                throw new Error(`Erro de rede - ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }
}