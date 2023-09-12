import { DataBase } from "./classes/Database.js";

if (String(sessionStorage.getItem("loggedAs"))!="null") {
    window.location.href = 'src/search.html';
}

const loginButton = document.getElementById("login") as HTMLButtonElement;
const registerButton = document.getElementById("register") as HTMLButtonElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const errorText = document.getElementById('errorText') as HTMLParagraphElement;

loginButton.addEventListener('click', () => {
    errorText.style.display = 'none';
    try {
        DataBase.loginUser(usernameInput.value, passwordInput.value)
        window.location.href = 'src/search.html';
    } catch (error) {
        const newError = error as Error
        errorText.style.display = 'block';
        errorText.style.color = "#FF0000";
        errorText.textContent = newError.message
    }
})

registerButton.addEventListener('click', () => {
    errorText.style.display = 'none';
    try {
        const success = DataBase.registerUser(usernameInput.value, passwordInput.value)
        if (success) {
            errorText.style.display = 'block';
            errorText.style.color = "#00FF00";
            errorText.textContent = "User registered!"
        }
    } catch (error) {
        const newError = error as Error
        errorText.style.display = 'block';
        errorText.style.color = "#FF0000";
        errorText.textContent = newError.message
    }
})
