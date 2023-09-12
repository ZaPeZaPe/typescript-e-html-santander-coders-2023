export class DataBase {
    private static validateUsername(username:string) {
        return /^(?!null$|db$)[a-zA-Z0-9._]+$/.test(username)
    }

    public static registerUser(username:string, password:string) {
        if (!this.validateUsername(username)) {
            throw new Error("Username must folow regex [a-z0-9._]");
        }
        if (sessionStorage.getItem(username)) {
            throw new Error("This user is already registered...")
        }
        const data = { "user" : username, "password" : password, "borrowed" : [] }
        sessionStorage.setItem(username, JSON.stringify(data))
        return true
    }

    public static loginUser(username:string, password:string) {
        const user = JSON.parse(sessionStorage.getItem(username) || '{}');
        if (Object.keys(user).length == 0) {
            throw Error("User is not registered, please register")
        }
        try {
            if (password != user["password"]) {
                throw Error("Wrong password...")
            }
        } catch {
            throw new Error("Wrong password...")
        }
        sessionStorage.setItem("loggedAs", username)
        console.log("loggedAs:", sessionStorage.getItem("loggedAs"))
    }

    public static getBooksFromUser() {
        const userData = JSON.parse(sessionStorage.getItem(sessionStorage.getItem("loggedAs") as string) || '{}')
        return userData["borrowed"]
    }

    public static setBooksFromUser(data:Array<object>) {
        const username = sessionStorage.getItem("loggedAs") as string
        const userData = JSON.parse(sessionStorage.getItem(username) || '{}')
        userData["borrowed"] = data
        sessionStorage.setItem(username, JSON.stringify(userData))
    }
}