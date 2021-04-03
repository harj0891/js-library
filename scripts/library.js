class Book  {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
    info() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read} pages read`;
    }
    setRead(status) {
        this.read = status;
    }
}

function displayLibrary() {
    // reset display
    SECTION_LIBRARY.innerHTML = "";
    
    // display each book
    for (book in myLibrary) {
        let bookIndex = myLibrary.indexOf(myLibrary[book]);

        let titleElement = document.createElement("p");
        let titleValue = document.createTextNode(myLibrary[book].title);
        titleElement.appendChild(titleValue);

        let authorElement = document.createElement("p");
        let authorValue = document.createTextNode(myLibrary[book].author);
        authorElement.appendChild(authorValue);

        let pagesElement = document.createElement("p");
        let pagesValue = document.createTextNode(myLibrary[book].pages);
        pagesElement.appendChild(pagesValue);
        
        let readElement = document.createElement("input");
        readElement.setAttribute("type", "checkbox");
        readElement.checked = myLibrary[book].read;
        readElement.addEventListener("change", updateReadStatus);

        let removeButton = document.createElement("button");
        removeButton.textContent = "Delete";
        removeButton.setAttribute("id", 'button-remove-book');        
        removeButton.addEventListener("click", removeBook);

        let bookElement = document.createElement("section");
        bookElement.setAttribute("id", `libary-element-${bookIndex}`);
        bookElement.setAttribute("data-book-id", `${bookIndex}`);
        bookElement.setAttribute("class", "book");
        bookElement.appendChild(titleElement);
        bookElement.appendChild(authorElement);
        bookElement.appendChild(pagesElement);
        bookElement.appendChild(readElement);
        bookElement.appendChild(removeButton);

        SECTION_LIBRARY.appendChild(bookElement);            
    };

}


function addBook() {
    // read input fields
    let titleInput = document.querySelector("#input-title").value;
    let authorInput = document.querySelector("#input-author").value;
    let pagesInput = document.querySelector("#input-pages").value;
    let readInput = document.querySelector("#input-read").value;

    /*
        add some validation
    */

    //  add book to library
    let newBook = new Book (titleInput, authorInput, pagesInput, readInput)
    myLibrary.push(newBook);

    // clear input fields
    document.querySelector("#input-title").value = null;
    document.querySelector("#input-author").value = null;
    document.querySelector("#input-pages").value = null;
    document.querySelector("#input-read").value = null;
    closeBookModal();

    // redisplay library
    displayLibrary();

}

function updateReadStatus(e) {
    let bookId = e.target.parentElement.dataset.bookId;
    console.log(e)



}

function removeBook(e) {
    let bookId = e.target.parentElement.dataset.bookId;

    myLibrary.splice(bookId,1);

    // redisplay library
    displayLibrary();
}
        

function openBookModal() {
    BOOK_MODAL.style.display = "block";
    // BOOK_MODAL.addEventListener("click", closeBookModal);

    window.onclick = function(event) {
        if (event.target == BOOK_MODAL) {
            closeBookModal();
        }
    }

    const ADD_BOOK_BUTTON = document.querySelector("#button-add-book");
    ADD_BOOK_BUTTON.addEventListener("click", addBook);
    
    const CANCEL_BUTTON = document.querySelector("#button-cancel");
    CANCEL_BUTTON.addEventListener("click", closeBookModal);
}  

function closeBookModal() {
    BOOK_MODAL.style.display = "none";
}
    


let myLibrary = [];
const SECTION_LIBRARY = document.querySelector("#section-library");
const BOOK_MODAL= document.querySelector("#container-modal");

const OPEN_BOOK_MODAL = document.querySelector("#button-modal-open");
OPEN_BOOK_MODAL.addEventListener("click", openBookModal);

// START - mocking books
let hobbit = new Book("The Hobbit", "Tolkien", 400, true);
let lotrFellowship = new Book("LOTR - Fellowship of the ring", "Tolkien", 550, false);
let hpPhilosopher = new Book("HP - Philosopher's Stone", "J. K. Rowling", 300, true);
myLibrary.push(hobbit);
myLibrary.push(lotrFellowship);
myLibrary.push(hpPhilosopher);
displayLibrary();
// END - mocking books






