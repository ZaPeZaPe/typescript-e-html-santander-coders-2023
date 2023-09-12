if (String(sessionStorage.getItem("loggedAs"))=="null") {
    window.location.href = '../index.html'
}

class MyBook {
    private _id:string
    private _titulo:string
    private _autor:string

    constructor(id:string, titulo:string, autor:string) {
        this._id = id
        this._titulo = titulo
        this._autor = autor
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
        return str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") 
    }
}

const meuResultadoContainer = document.getElementById('searchResults') as HTMLDivElement
const mySearchButton = document.getElementById('searchButton') as HTMLButtonElement
const mySearchInput = document.getElementById('searchInput') as HTMLInputElement
const myLogoutButton = document.getElementById('logoutButton') as HTMLInputElement;
const userData = JSON.parse(sessionStorage.getItem(sessionStorage.getItem("loggedAs") as string) || '{}')
showMyBooks(userData["borrowed"])

myLogoutButton.addEventListener('click', () => {
    sessionStorage.setItem("loggedAs", "null")
    location.reload()
})

mySearchButton.addEventListener('click', () => {
    let newUserData = JSON.parse(sessionStorage.getItem(sessionStorage.getItem("loggedAs") as string) || '{}')
    showMyBooks(newUserData["borrowed"], mySearchInput.value)
    searchInput.value = ""
})

function unborrowBook(id:string) {
    const username = sessionStorage.getItem("loggedAs") as string
    let newUserData = JSON.parse(sessionStorage.getItem(username) || '{}')
    const newBooks = newUserData["borrowed"].filter((book:any) => book.id !== id)
    newUserData["borrowed"] = newBooks
    sessionStorage.setItem(username, JSON.stringify(newUserData))
}

function showMyBook(livro:any) {
    const book = new MyBook(livro.id, livro.titulo, livro.author)

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
        const username = sessionStorage.getItem("loggedAs") as string
        let newUserData = JSON.parse(sessionStorage.getItem(username) || '{}')
        showMyBooks(newUserData["borrowed"])
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
