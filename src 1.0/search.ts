class ApiAuth {
    public static getKey() {
        return "APIKEY"
    }
}

if (String(sessionStorage.getItem("loggedAs"))=="null") {
    window.location.href = '../index.html';
}

class MakeSearch {
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

class Book {
    private _id:string;
    private _titulo:string;
    private _autor:string;

    constructor(id:string, titulo:string, autor:string[]) {
        this._id = id
        this._titulo = titulo
        
        let autor_novo:string="";
        try {
            autor.forEach((author:string) => {autor_novo += `${Book.capitalizeFirstLetter(author)}, `})
            autor_novo = autor_novo.slice(0, -2)
        } catch (error) {
            autor_novo = "???"
        }

        this._autor = autor_novo
    }

    
    public get id() : string {
        return this._id
    }

    public get titulo() : string {
        return this._titulo
    }
    
    public get autor() : string {
        return this._autor
    }

    static capitalizeFirstLetter(str:string) {
        return str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "); 
    }

}

class User {
    private _username:string;
    private _books:Array<object>;

    constructor(id:string, books:Array<object>) {
        this._username = id
        this._books = books
    }

    public get username() : string {
        return this._username
    }
    
    public get books() : Array<object> {
        return this._books
    }
}

const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const logoutButton = document.getElementById('logoutButton') as HTMLInputElement;

searchButton.addEventListener('click', async () => {
    await MakeSearch.searchBook(searchInput.value).then((data) => {
        showResults(data)
    })
    searchInput.value = ""
})

logoutButton.addEventListener('click', () => {
    sessionStorage.setItem("loggedAs", "null")
    location.reload()
})

const resultadoContainer = document.getElementById('searchResults') as HTMLDivElement;

function showBook(livro:any) {
    const book = new Book(livro.id, livro.volumeInfo.title, livro.volumeInfo.authors)

    const livroElement = document.createElement('div');
    livroElement.id = `${book.id}`
    livroElement.classList.add('livro');

    const tituloElement = document.createElement('h2');
    tituloElement.textContent = book.titulo;
    livroElement.appendChild(tituloElement);

    const autorElement = document.createElement('p');
    autorElement.textContent = `Autor: ${book.autor}`;
    livroElement.appendChild(autorElement);

    livroElement.addEventListener('click', () => {
        borrowBook(book.id, book.titulo, book.autor)
        livroElement.style.color = "#00FF00"
    })

    resultadoContainer.appendChild(livroElement);
}

function showResults(results:any) {
    resultadoContainer.innerHTML = '';
    if (results) {
        const livros = results["items"]
        console.log(livros)
        livros.forEach((livro:any) => {
            showBook(livro)
        })
    }
}

function borrowBook(id:string, titulo:string, author:string) {
    const username = sessionStorage.getItem("loggedAs") as string
    const userData = JSON.parse(sessionStorage.getItem(username) || '{}');
    const user = new User(username, userData["borrowed"])
    
    if (!user.books.some((book:any) => book['id'] == id)) {
        const book = { id: id, titulo: titulo, author: author }
        user.books.push(book)
        userData["borrowed"] = user.books
        sessionStorage.setItem(user.username, JSON.stringify(userData))
        return true
    }
    
    return false
}
