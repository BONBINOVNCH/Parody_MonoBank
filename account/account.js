let user = JSON.parse(localStorage.getItem("user"))
const userData = document.querySelector(".userData")
const save = document.querySelector(".save")

refreshData()

function refreshData() {
    

    userData.innerHTML = ``
    userData.innerHTML = `
                    <input type="email" class="userEmail" placeholder="${user.email}" value="${user.email}">
                    <input type="text" class="userName" placeholder="${user.name}" value="${user.name}">
                    <input type="text" class="userSurname" placeholder="${user.surname}" value="${user.surname}">
                    <input type="password" class="userPassword" placeholder="${user.password}" value="${user.password}">
`
    //тут мені джпт поміг

    window.userEmail = document.querySelector(".userEmail");
    window.userName = document.querySelector(".userName");
    window.userSurname = document.querySelector(".userSurname");
    window.userPassword = document.querySelector(".userPassword");
}


save.addEventListener("click", () => {
    user.email = userEmail.value;
    user.name = userName.value;
    user.surname = userSurname.value;
    user.password = userPassword.value;

    console.log(user);
    localStorage.setItem("user", JSON.stringify(user));
    refreshData(); 
    alert("Дані успішно змінено")
})