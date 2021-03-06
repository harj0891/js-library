// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDSLiGFQkvvCNWpgfO9XGbmxfmyyES8qb8",
    authDomain: "odin-project-library-dc003.firebaseapp.com",
    projectId: "odin-project-library-dc003",
    storageBucket: "odin-project-library-dc003.appspot.com",
    messagingSenderId: "118159933627",
    appId: "1:118159933627:web:6387830b9d61d7ae19e99e",
    measurementId: "G-L4ZC1VFV3K"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

class Book  {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
    info() {
        return `${this.title} by ${this.author}, ${this.pages} pages. Current status: ${this.read}`;
    }
    setRead(status) {
        this.read = status;
    }
}

function displayLibrary() {
    // reset display
    SECTION_LIBRARY.innerHTML = "";
    
    // load from local storage
    let library = loadFromStorage();

    // display each book
    for (book in library) {
        let bookIndex = library.indexOf(library[book]);

        let titleElement = document.createElement("p");
        let titleValue = document.createTextNode(library[book].title);
        titleElement.appendChild(titleValue);

        let authorElement = document.createElement("p");
        let authorValue = document.createTextNode(library[book].author);
        authorElement.appendChild(authorValue);

        let pagesElement = document.createElement("p");
        let pagesValue = document.createTextNode(`${library[book].pages} pages`);
        pagesElement.appendChild(pagesValue);
        
    
        let readElement = document.createElement("input");
        readElement.setAttribute("type", "checkbox");        
        readElement.checked = library[book].read;
        readElement.setAttribute("id", "book-read-status");
        readElement.addEventListener("change", updateReadStatus);

        let readSlider = document.createElement("span");
        readSlider.setAttribute("class", "slider");
        
        let readLabel = document.createElement("label");
        readLabel.setAttribute("class","switch");
        readLabel.appendChild(readElement);
        readLabel.appendChild(readSlider);


        let removeButton = document.createElement("button");
        removeButton.textContent = "Delete";
        removeButton.setAttribute("id", 'button-remove-book');        
        removeButton.addEventListener("click", openDeleteModal);

        let bookElement = document.createElement("section");
        bookElement.setAttribute("id", `libary-element-${bookIndex}`);
        bookElement.setAttribute("data-book-id", `${bookIndex}`);
        bookElement.setAttribute("class", "book");
        if (!readElement.checked) {
            bookElement.setAttribute("class", "book book-unread");
        }
        bookElement.appendChild(titleElement);
        bookElement.appendChild(authorElement);
        bookElement.appendChild(pagesElement);
        bookElement.appendChild(readLabel);
        bookElement.appendChild(removeButton);

        SECTION_LIBRARY.appendChild(bookElement);            
    };

}


function addBook() {
    // read input fields
    let titleInput = document.querySelector("#input-title").value;
    let authorInput = document.querySelector("#input-author").value;
    let pagesInput = document.querySelector("#input-pages").value;
    let readInput = document.querySelector("#input-read").checked;
    let errorSpan = document.querySelector("#form-error");


    if (titleInput != "" && authorInput != "" && pagesInput != "") {
        errorSpan.innerHTML = "";

        //  add book to library
        let newBook = new Book (titleInput, authorInput, pagesInput, readInput)
        currentLibrary.push(newBook);
        saveToStorage();

        // redisplay library
        closeBookModal();
        displayLibrary();
    } else {
        errorSpan.innerHTML = "Please enter your book";

    }
    

}

function updateReadStatus(e) {
    let bookId = e.target.parentElement.parentElement.dataset.bookId;
    let readStatus = document.querySelectorAll("#book-read-status")[bookId].checked;
    
    currentLibrary[bookId].read = readStatus;
    saveToStorage();

    displayLibrary();
}

function removeBook(bookId) {
    // remove from library
    currentLibrary.splice(bookId,1);

    // redisplay library
    saveToStorage();
    displayLibrary();
}
        

function saveToStorage() {
    if (useFirebase) {
        // test
    } else if (!useFirebase && storageAvailable('localStorage')) {
        localStorage.library = JSON.stringify(currentLibrary);
    }  else {
        localSessionLibrary.push(book);
    }
}

async function loadFromFirebase() {
    let fbLibrary;
        
    firebaseDbRef.get().then(function(snap) {
        
        if (snap.exists()) {
            
            console.log(fbLibrary = snap.val());
            
        } else {
            return fbLibrary = undefined;
        }
    }).catch(function(error) {
        console.log(error);
    });

}


function loadFromStorage() {
    // set empty array to hold objects if nothing already there
    let initLibrary = [];

    // START - mocking books
    let hobbit = new Book("The Hobbit", "Tolkien", 400, true);
    let lotrFellowship = new Book("LOTR - Fellowship of the ring", "Tolkien", 550, true);
    let hpPhilosopher = new Book("HP - Philosopher's Stone", "J. K. Rowling", 300, true);
    let hpChamber = new Book("HP - Philosopher's Stone", "J. K. Rowling", 300, false);
    initLibrary.push(hobbit);
    initLibrary.push(lotrFellowship);
    initLibrary.push(hpPhilosopher);
    initLibrary.push(hpChamber);
    // END - mocking books

    if (useFirebase) {
        let fbLibrary = loadFromFirebase();
        console.log(fbLibrary);


            // if (fbLibrary) {
    //     return JSON.parse(fbLibrary);
    // } else {
    //     // save initLibrary to local storage
    //     loadFromStorage();
    // }
    } else if (!useFirebase && storageAvailable('localStorage')) {
        if (localStorage.library) {            
            return JSON.parse(localStorage.library);
        } else {
            localStorage.library = JSON.stringify(initLibrary);
            loadFromStorage();
        }
    } else {
        return initLibrary;
    }
    
}

function openBookModal() {
    ADD_BOOK_MODAL.style.display = "block";

    const ADD_BOOK_BUTTON = document.querySelector("#button-add-book");
    ADD_BOOK_BUTTON.addEventListener("click", addBook);
    
    const CANCEL_BUTTON = document.querySelector("#button-cancel");
    CANCEL_BUTTON.addEventListener("click", closeBookModal);

    window.onclick = function(event) {
        if (event.target == ADD_BOOK_MODAL) {
            closeBookModal();
        }
    }
}  


function closeBookModal() {
    // clear input fields
    document.querySelector("#input-title").value = null;
    document.querySelector("#input-author").value = null;
    document.querySelector("#input-pages").value = null;
    document.querySelector("#input-read").checked = false;
    document.querySelector("#form-error").innerHTML = "";

    ADD_BOOK_MODAL.style.display = "none";
}
    

function openDeleteModal(e) {
    let bookId = e.target.parentElement.dataset.bookId;
    REMOVE_BOOK_MODAL.style.display = "block";

    const REMOVE_BOOK_BUTTON = document.querySelector("#button-remove-confirm");
    REMOVE_BOOK_BUTTON.addEventListener("click", function() {
        removeBook(bookId);
        closeDeleteModal();
    });
    
    const CANCEL_BUTTON = document.querySelector("#button-remove-cancel");
    CANCEL_BUTTON.addEventListener("click", closeDeleteModal);
    
    window.onclick = function(event) {
        if (event.target == REMOVE_BOOK_MODAL) {
            closeDeleteModal();
        }
    }
}

function closeDeleteModal() {
    REMOVE_BOOK_MODAL.style.display = "none";
}


function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        let x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}


// use firebase
let useFirebase = false;
const firebaseDbRef = firebase.database().ref().child('library');




let currentLibrary = loadFromStorage();

const SECTION_LIBRARY = document.querySelector("#section-library");
const ADD_BOOK_MODAL= document.querySelector("#container-modal-add");
const REMOVE_BOOK_MODAL= document.querySelector("#container-modal-remove");

const OPEN_BOOK_MODAL = document.querySelector("#button-modal-open");
OPEN_BOOK_MODAL.addEventListener("click", openBookModal);


displayLibrary();





/* ---- TO DO ---- *//*
Use persistent storage 
- firebase

Tidy up html + css
- book tile styles
- button styles (add and delete)

Use forms
- have inline error messages
*//* --------------- */