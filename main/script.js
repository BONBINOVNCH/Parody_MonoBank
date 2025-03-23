function UserCard(index, saveData = null){
 
    this._balance = saveData ? saveData.balance : 100;
    this._transactionLimit = saveData ? saveData.transactionLimit : 100;
    this._historyLogs = saveData ? saveData.balance : [];
    this._key = index;
 
    let logOperation = (operationType, credits) => {
        this._historyLogs.push({
            operationType: operationType,
            credits: credits,
            operationTime: new Date().toLocaleString()
        })
    }
 
    this.getCardOptions = () => {
        return {
            balance: this._balance,
            transactionLimit: this._transactionLimit,
            historyLogs: this._historyLogs,
            key: this._key
        }
    }
 
    this.putCredits = (amount) => {
        this._balance += amount;
        logOperation("Received credits", amount)
        return this._balance;
    }
 
    this.takeCredits = (amount) =>{
        if(this._balance >= amount && this._transactionLimit >= amount){
            this._balance -= amount;
            logOperation('Withdrawn of credits', amount)
            return this._balance;
        } else{
            console.error("Not enough credits or transaction limit exceeded");
        }
    }
 
    this.setTransactionLimit = (amount) => {
        if(amount< 0 ){
            return console.error("Transaction limit can't be negative");
        } else{
            this._transactionLimit = amount;
            logOperation("Transaction limit changed", amount)
            return `Transaction limit set to ${this._transactionLimit}`
        }
 
    }
    this.transferCredits = (amount, card) => {
        const tax = amount * 0.005; 
        const totalAmount = amount + tax;
        if(totalAmount> this._balance){
            return console.warn("Not enough credits");
        }
 
        if( totalAmount > this._transactionLimit){
            return console.warn("Transaction limit exceeded");
        }
 
        this._balance -= totalAmount;
 
        card.putCredits(amount);
 
        logOperation("Withdrawn of credits", amount)
 
        return `Transfered ${amount} credits to card ${card.getCardOptions().key}`
 
    }
 
 
}
class UserAccount {
    constructor(name, email){
        this._name = name;
        this._email = email;
        this._cards = [];
    }
    addCard(savedCardData = null){
        if(this._cards.length >= 3){
            return console.warn("User can't have more than 3 cards");
        } else{
            const cardIndex = this._cards.length + 1
            const card = new UserCard(cardIndex, savedCardData)
            this._cards.push(card);
            saveCardToLocalStorage()
            return card;
        }
 
    }
 
    getCardByKey(key){
        if(key < 1 || key > 3){
            return console.error("Card with such key doesn't exist");
        }
 
        // return this._cards[key - 1];
 
        for(let card of this._cards){
            if(card._key === key){
                return card;
            }
        }
        return console.error("Card with such key doesn't exist");
    }
 
    getCards() {
        return this._cards
    }
        
}
 
function saveCardToLocalStorage(card) {
    const cardsDate = user.getCards().map(card => card.getCardOptions())
    localStorage.setItem("cardsData", JSON.stringify(cardsDate))
}

function getCardsFromLocalStorage(){
    const cardsDate = JSON.parse(localStorage.getItem("cardsDate"))
    return cardsDate
}
// MAIN PAGE
 
const transferInp = document.querySelector("#transferInp");
const transferCardInp = document.querySelector("#transferCardInp");
const transferBtn = document.querySelector("#transferBtn");

const boxInfo = document.querySelector(".boxInfo");
const depositeInp = document.querySelector("#depositeInp");
const depositeBtn = document.querySelector("#depositeBtn");
const withdrawBtn = document.querySelector("#withdrawBtn");
const withdrawInp = document.querySelector("#withdrawInp");
const setTransactionLimitBtn = document.querySelector("#setTransactionLimitBtn")
const setTransactionLimitInp = document.querySelector("#setTransactionLimitInp")

const transferInp2 = document.querySelector("#card2 #transferInp");
const transferCardInp2 = document.querySelector("#card2 #transferCardInp");
const transferBtn2 = document.querySelector("#card2 #transferBtn");

const boxInfo2 = document.querySelector(".boxInfo2");
const depositeInp2 = document.querySelector("#card2 #depositeInp");
const depositeBtn2 = document.querySelector("#card2 #depositeBtn");
const withdrawBtn2 = document.querySelector("#card2 #withdrawBtn");
const withdrawInp2 = document.querySelector("#card2 #withdrawInp");
const setTransactionLimitBtn2 = document.querySelector("#card2 #setTransactionLimitBtn")
const setTransactionLimitInp2 = document.querySelector("#card2 #setTransactionLimitInp")

const historyLogs = document.querySelector(".historyLogs")
 
const userDB = JSON.parse(localStorage.getItem("user"));
 
const user = new UserAccount(userDB.name, userDB.email);
const savedCardsDate = getCardsFromLocalStorage();

if(savedCardsDate && savedCardsDate.length > 0) {
    for (let cardDate of savedCardsDate) {
        user.addCard(cardDate)
    }

} else {
    user.addCard()
    user.addCard()
    saveCardToLocalStorage()
}
 
user.addCard();
user.addCard();
 
const card1 = user.getCardByKey(1);
const card2 = user.getCardByKey(2);
 
console.log(card1.getCardOptions().balance);
 
function refreshInfoBox(card,boxInfo){
    boxInfo.innerHTML = "";
    boxInfo.innerHTML += `
    <h2>Info about card</h2>
    <h3>Card number: <span class="cardNumber"> ${card.getCardOptions().key}</span></h3>
        <h3>Card balance: <span class="cardBalance">${card.getCardOptions().balance}</span></h3>
        <h3>Card transaction limit: <span class="cardTransactionLimit">${card.getCardOptions().transactionLimit}</span></h3>
    `;
    // console.log(card1.getCardOptions().historyLogs[card1.getCardOptions().historyLogs.length -1].operationType)
    //   <h3>Card history logs: <span class="cardHistoryLogs">${card.getCardOptions().historyLogs}</span></h3>
}
 
refreshInfoBox(card1, boxInfo);
refreshInfoBox(card2, boxInfo2);

 
depositeBtn.addEventListener("click", () => {
    if(+depositeInp.value < 0) {
        alert("Не може бути від'ємним")
    } else if (+depositeInp.value > card1.getCardOptions().transactionLimit) {
         alert("Виходить за ліміт")
    } 
     else {
        card1.putCredits(+depositeInp.value);
      refreshInfoBox(card1, boxInfo)
    }

    console.log(card1.getCardOptions())
    historyBoxRender(card1)

   })

withdrawBtn.addEventListener("click", () => {
    if(+withdrawInp.value < 0) {
        alert("Не може бути від'ємним")
    } else if (+withdrawInp.value > card1.getCardOptions().transactionLimit) {
      alert("Виходить за ліміт")
 }  else {
        card1.takeCredits(+withdrawInp.value);
    refreshInfoBox(card1, boxInfo)
    }

    console.log(card1.getCardOptions())
    historyBoxRender(card1)
    
})

setTransactionLimitBtn.addEventListener("click", () => {
   card1.setTransactionLimit(+setTransactionLimitInp.value)
   refreshInfoBox(card1, boxInfo)
})

depositeBtn2.addEventListener("click", () => {
   if(+depositeInp2.value < 0) {
       alert("Не може бути від'ємним")
   } else if (+depositeInp2.value > card2.getCardOptions().transactionLimit) {
        alert("Виходить за ліміт")
   } 
    else {
       card2.putCredits(+depositeInp2.value);
     refreshInfoBox(card2, boxInfo2)
   }
   historyBoxRender(card2)
  })

withdrawBtn2.addEventListener("click", () => {
   if(+withdrawInp2.value < 0) {
       alert("Не може бути від'ємним")
   } else if (+withdrawInp2.value > card2.getCardOptions().transactionLimit) {
     alert("Виходить за ліміт")
}  else {
       card2.takeCredits(+withdrawInp2.value);
   refreshInfoBox(card2, boxInfo2)
   }
   historyBoxRender(card2)
})

setTransactionLimitBtn2.addEventListener("click", () => {
  card2.setTransactionLimit(+setTransactionLimitInp2.value)
  refreshInfoBox(card2, boxInfo2)
})

transferBtn.addEventListener("click", () => {
   if(+transferInp < 0){
      alert("Не може бути від'ємним")
   } else if (+transferInp.value > card2.getCardOptions().transactionLimit) {
      alert("Виходить за ліміт")
   } else if(+transferCardInp.value != 2){
      alert("Нема такої карти")
   } else{
      card1.takeCredits(+transferInp.value);
      card2.putCredits(+transferInp.value);
      refreshInfoBox(card1, boxInfo)
      refreshInfoBox(card2, boxInfo2)
   }
})
transferBtn2.addEventListener("click", () => {
   if(+transferInp2 < 0){
      alert("Не може бути від'ємним")
   } else if (+transferInp2.value > card2.getCardOptions().transactionLimit) {
      alert("Виходить за ліміт")
   } else if(+transferCardInp2.value != 1){
      alert("Нема такої карти")
   } else{
      card2.takeCredits(+transferInp2.value);
      card1.putCredits(+transferInp2.value);
      refreshInfoBox(card1, boxInfo)
      refreshInfoBox(card2, boxInfo2)
   }
})

function historyBoxRender(card) {
     historyLogs.innerHTML = ``

    card.getCardOptions().historyLogs.forEach(transaction => {
        console.log(transaction.operationType)

        let color = "red"
       
        if (transaction.operationType == "Received credits") {
            color = "green"
        } 
        
        historyLogs.innerHTML += `
        <li class="transaction">
                <img src="../img/pngtree-green-arrow-png-image_4323663.png" alt="" class="imgLogoTransaction">
                <div class="transactionInfo">
                    <h5 class="transactionTitle">${transaction.operationType}</h5>
                    <span class="transactionDate">${transaction.operationTime}</span>
                </div>
                <span style="color: ${color}" class="transactionAmount">${transaction.credits}</span>
            </li>
        `
    })
}

historyBoxRender(card1)