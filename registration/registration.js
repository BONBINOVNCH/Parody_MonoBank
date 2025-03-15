const email = document.getElementById("emailInp")
const name = document.getElementById("nameInp")
const surname = document.getElementById("surnameInp")
const password1 = document.getElementById("passwordInp1")
const password2 = document.getElementById("passwordInp2")
const registrationBtn = document.getElementById("registrationBtn")

registrationBtn.addEventListener('click', () => {
    if (email.value && name.value && password1.value && password2.value) {
        if (password1.value === password2.value) {
            const user = {
                email: email.value,
                name: name.value,
                surname: surname.value,
                password: password1.value,
            }

            localStorage.setItem("user", JSON.stringify(user))
            alert("Registration successfull")
            window.location.href = "../login/login.html"
        } else{
            alert("Password dont match")
        }
    } else{
        alert("Заповніть всі поля")
    }
})