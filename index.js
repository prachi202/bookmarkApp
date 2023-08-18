import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCn6IOqIqctE4Cz9nFv8mE5IPThCX4fOKU",
   authDomain: "bookmarkapp-75d30.firebaseapp.com",
   projectId: "bookmarkapp-75d30",
   storageBucket: "bookmarkapp-75d30.appspot.com",
   messagingSenderId: "898413952639",
   appId: "1:898413952639:web:462a0a74cb7b066c33094a"
 };
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "bookmarks");

function deleteEvent() {   
    const deleteButtons = document.querySelectorAll(".cmp-bookmarkApp__container__bookmark__cards__card__subInformation--delete");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", event => {
            const deleteRef = doc(db, "bookmarks", button.dataset.id);
            deleteDoc(deleteRef)
                .then(() => {
                    button.parentElement.parentElement.parentElement.remove();
                })
        })
    });
}

function generateTemplate(response, id) {
    return `<div class="cmp-bookmarkApp__container__bookmark__cards__card">
                <p class="cmp-bookmarkApp__container__bookmark__cards__card--title">${response.title}</p>
                <div class="cmp-bookmarkApp__container__bookmark__cards__card__subInformation">
                    <p>
                        <span class="cmp-bookmarkApp__container__bookmark__cards__card__subInformation__category cmp-bookmarkApp__container__bookmark__cards__card__subInformation__category--${response.category}">${response.category[0].toUpperCase()}${response.category.slice(1)}</span>
                    </p>
                    <a href="${response.link}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square cmp-bookmarkApp__container__bookmark__cards__card__subInformation--website"></i></a>
                    <a href="https://www.google.com/search?q=${response.title}" target="_blank"><i class="fa-brands fa-google cmp-bookmarkApp__container__bookmark__cards__card__subInformation--search"></i></a>
                    <span>
                        <i class="fa-solid fa-trash-can cmp-bookmarkApp__container__bookmark__cards__card__subInformation--delete" data-id="${id}"></i>
                    </span>
                </div>
            </div>`
}
const cards = document.querySelector(".cmp-bookmarkApp__container__bookmark__cards");
function showCard() {   
    cards.innerHTML = ""; 
    getDocs(colRef)
        .then(data => {
            // console.log(data);
            data.docs.forEach(document => {
                // console.log(document.data(), document.id);
                cards.innerHTML += generateTemplate(document.data(), document.id);
            })
            deleteEvent();
    })
        .catch(error => {
            console.log(error);
        })
}
showCard();

const addForm = document.querySelector(".cmp-bookmarkApp__container__create__add");
addForm.addEventListener("submit", event => {
    event.preventDefault();
    addDoc(colRef, {
        link: addForm.link.value,
        title: addForm.title.value,
        category: addForm.category.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addForm.reset();
        showCard();
    })
});

function filteredCards(category) {
    if(category === "All"){
        showCard();
    }
    else{
        const qRef = query(colRef, where("category", "==", category.toLowerCase()));
        cards.innerHTML = "";
        getDocs(qRef)
        .then(data => {
            data.docs.forEach(document => {
                cards.innerHTML += generateTemplate(document.data(), document.id);
            })
            deleteEvent();
        })
        .catch(error => {
            console.log(error);
        })
    }
}
    

const categoryList = document.querySelector(".cmp-bookmarkApp__container__bookmark__categoryList");
const categorySpan = document.querySelector(".cmp-bookmarkApp__container__bookmark__categoryList").querySelectorAll("span");
categoryList.addEventListener("click", event => {
    if(event.target.tagName === "SPAN"){
        filteredCards(event.target.innerText);
        categorySpan.forEach(element => element.classList.remove("cmp-bookmarkApp__container__bookmark__categoryList--active"));
        event.target.classList.add("cmp-bookmarkApp__container__bookmark__categoryList--active");
        
    }
})