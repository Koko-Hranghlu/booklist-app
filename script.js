/*
CLASSES:-
1. Class Book represents an object book to be created 

2. Class UI handles interface. It has 4 static methods:-
 - displayBooks: gets an array of books object from Store and loops through it, passing each book to addBookToList method of UI in each call, so that it retains the data when the page refreshes
 - addBookToList: takes book object that was passed and populates tds of a dynamically created tr with the books's properties, also adds a td of delete button and appends the tr to the bookList
 - deleteBook: if the clicked element that was passed is the delete button, it removes the book row that the delete button resides in 
 - clearFields: clears all the input values
 
3. Class Store handles localStorage. It has 3 static methods:
 - getBooks returns an array of empty or non-empty books from localStorage
 - addBook adds a specific book to books array of localStorage
 - removeBook removes a specific book from books array of localStorage
 
EVENTS:-
1. Form submit: 
 - prevents the default submit event
 - gets all the 3 input field values
 - Validates:
  - if any input field is empty, it alerts error messages
  - else, creates book object from Book Class using the values from input fields
  - calls and passes book object to addBookToList method of UI
  - calls and passes book object to addBook method of Store
  - calls the clearFields method of UI
  - alerts success message
  
2. BookList click:
 - delete button wanted, so gets the element that triggered the event
 - if it's delete button, it will get the textContent of isbn td tag, which is the previous, previous element sibling of delete's button parent
 - calls and passes the clickedEl to deleteBook method of UI
 - calls and passes the isbn to removeBook method of Store
 
3. Document DOMContentLoaded:
 - calls displayBooks method of UI
*/

const form = document.querySelector("#book-form")
const titleField = document.querySelector("#title")
const authorField = document.querySelector("#author")
const isbnField = document.querySelector("#isbn")
const bookList = document.querySelector('#book-list')
let selectedRow = null
let index
class Book {
  constructor(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn  
  }
}

class UI {
  static displayBooks() {
      const books = Store.getBooks()
      books.forEach(book => UI.addBookToList(book))
  }
  
  static addBookToList(book) {
      let row = document.createElement('tr');
      row.innerHTML = `
                  <td>${book.title}</td>
                  <td>${book.author}</td>
                  <td>${book.isbn}</td>
                  <td id="edit">Edit</td>
                  <td><a href="#" class="fa-solid fa-trash-can" id="delete"></a></td>
                `
      bookList.appendChild(row)
  }
  
  static updateBook (book) {
  selectedRow.cells[0].innerText = book.title
  selectedRow.cells[1].innerText = book.author
  selectedRow.cells[2].innerText = book.isbn
  
  }
  
  static updateInput(isbn) {
    titleField.value = selectedRow.cells[0].innerText
    authorField.value = selectedRow.cells[1].innerText
    isbnField.value = selectedRow.cells[2].innerText
    const books = Store.getBooks()
    index = books.findIndex(book => book.isbn == isbn)
  }
  
  static deleteBook(el) {
    el.parentElement.parentElement.remove()
    alert('Book Removed!')
  }
  
  static validateForm(title, author, isbn) {
    const empty = title === "" || author === "" || isbn === ""
    if (empty) return true
  }

  static clearFields() {
    titleField.value = ''
    authorField.value = ''
    isbnField.value = ''
  }
  
  
  //optional
  /*static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);
  
      // Vanish in 3 seconds
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }*/
}


class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('brad-books') === null) books = []
    else books = JSON.parse(localStorage.getItem('brad-books'));
    return books
  }
  
  static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('brad-books', JSON.stringify(books));
  }
  
  static updateBook(book) {
    const books = Store.getBooks()
    const currentBook = books[index]
    currentBook.title = book.title
    currentBook.author = book.author
    currentBook.isbn = book.isbn
    localStorage.setItem('brad-books', JSON.stringify(books))
  }
  
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn == isbn) books.splice(index, 1);
    });

    localStorage.setItem('brad-books', JSON.stringify(books));
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleField.value
  const author = authorField.value
  const isbn = isbnField.value
  const isEmpty = UI.validateForm(title, author, isbn)
  
  if (isEmpty) alert('fill shits')
  else {
    const book = new Book(title, author, isbn)
    if (selectedRow == null) {
      UI.addBookToList(book)
      Store.addBook(book)
    }
    else {
      UI.updateBook(book)
      Store.updateBook(book)
    }
    UI.clearFields();
  }
  
  
});

bookList.addEventListener('click', e => {
  const clickedEl = e.target
  selectedRow = clickedEl.closest('tr')
  const isbn = selectedRow.cells[2].innerText
  if (clickedEl.id == "delete") {
    UI.deleteBook(clickedEl);
    Store.removeBook(isbn);
  }
  
  if (clickedEl.id == "edit") UI.updateInput(isbn)
    
});

document.addEventListener('DOMContentLoaded', UI.displayBooks)
