export class Book {
    private _id:string
    private _titulo:string
    private _autor:string

    constructor(id:string, titulo:string, autor:string | Array<string>) {
        this._id = id
        this._titulo = titulo

        if (Array.isArray(autor)) {
            let autor_novo:string="";
            try {
                autor.forEach((author:string) => {autor_novo += `${Book.capitalizeFirstLetter(author)}, `})
                autor_novo = autor_novo.slice(0, -2)
            } catch (error) {
                autor_novo = "???"
            }
            autor = autor_novo
        }

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