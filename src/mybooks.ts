import { Book } from "./classes/Book.js"
import { DataBase } from "./classes/Database.js"

if (String(sessionStorage.getItem("loggedAs"))=="null") {
    window.location.href = '../index.html'
}

const meuResultadoContainer = document.getElementById('searchResults') as HTMLDivElement
const mySearchButton = document.getElementById('searchButton') as HTMLButtonElement
const mySearchInput = document.getElementById('searchInput') as HTMLInputElement
const myLogoutButton = document.getElementById('logoutButton') as HTMLInputElement;
showMyBooks(DataBase.getBooksFromUser())

myLogoutButton.addEventListener('click', () => {
    sessionStorage.setItem("loggedAs", "null")
    location.reload()
})

mySearchButton.addEventListener('click', () => {
    showMyBooks(DataBase.getBooksFromUser(), mySearchInput.value)
    mySearchInput.value = ""
})

function unborrowBook(id:string) {
    const newBooks = DataBase.getBooksFromUser().filter((book:any) => book.id !== id)
    DataBase.setBooksFromUser(newBooks)
}

function showMyBook(livro:any) {
    const book = new Book(livro.id, livro.titulo, livro.author)

    const livroElement = document.createElement('div')
    livroElement.id = `${book.id}`
    livroElement.classList.add('livro')

    const tituloElement = document.createElement('h2')
    tituloElement.textContent = book.titulo
    livroElement.appendChild(tituloElement)

    const autorElement = document.createElement('p')
    autorElement.textContent = `Autor: ${book.autor}`
    livroElement.appendChild(autorElement)

    livroElement.addEventListener('click', () => {
        unborrowBook(book.id)
        livroElement.remove()
        showMyBooks(DataBase.getBooksFromUser())
    })

    meuResultadoContainer.appendChild(livroElement)
}

function showMyBooks(myBooks:any, filter:string="") {
    meuResultadoContainer.innerHTML = ''
    if (myBooks) {
        const livros = myBooks
        if(""==filter) {
            for (let i = 0; i < 10 && i < livros.length; i++) {
                showMyBook(livros[i])
            }
        } else {
            filterMyBooks(livros, filter)
        }
    }
}

function filterMyBooks(livros:Array<object>, filter:string) {
    const livrosFiltrados = livros.filter((livro:any) =>
        livro.titulo.toLowerCase().includes(filter.toLowerCase())
    )
    const livrosAutorFiltrado = livros.filter((livro:any) =>
        livro.author.toLowerCase().includes(filter.toLowerCase())
    )
    let saveIndex = 0
    for (let i = 0; i < 10 && i < livrosFiltrados.length; i++) {
        showMyBook(livrosFiltrados[i])
        saveIndex = i
    }
    for (let i = 0; i < 10 && i < livrosAutorFiltrado.length && saveIndex < 10; i++) {
        showMyBook(livrosAutorFiltrado[i])
    }
}
