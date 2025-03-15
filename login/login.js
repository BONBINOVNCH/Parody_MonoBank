const login = document.getElementById("loginInp")
const password = document.getElementById("passwordInp")
const loginBtn = document.getElementById("loginBtn")

loginBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"))
    console.log(user)
    if (login.value != user.email){
        alert("Неправильний емейл")
    } else if(password.value != user.password){
        alert("Неправильний пароль")
    } else {
        
        window.location.href = "../main/main.html"
        
    }
})