export class User {
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