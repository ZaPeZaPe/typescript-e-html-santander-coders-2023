import { MakeSearch } from "./classes/Api.js";
import { Book } from "./classes/Book.js";
import { DataBase } from "./classes/Database.js";
import { User } from "./classes/User.js";

if (String(sessionStorage.getItem("loggedAs"))=="null") {
    window.location.href = '../index.html';
}

const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const logoutButton = document.getElementById('logoutButton') as HTMLInputElement;

searchButton.addEventListener('click', () => {
    MakeSearch.searchBook(searchInput.value).then((data) => {
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
    const user = new User(username, DataBase.getBooksFromUser())
    
    if (!user.books.some((book:any) => book['id'] == id)) {
        const book = { id: id, titulo: titulo, author: author }
        user.books.push(book)
        DataBase.setBooksFromUser(user.books)
        return true
    }
    
    return false
}
