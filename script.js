/*
3 class:
1. Book
2. UI for elements in interface
3. Store for elements in localStorage

Steps: 
1. Code the interactivity in the userinterface
2. Make the messages of validation, successes simple
3. Add interactivity in localStorage
4. Add more beautiful messages of the step 2
*/

// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
  }
}

// UI Class: Handle UI Tasks
class UI {
  // method 1
  static displayBooks() {
    const StoredBooks = Store.getBooks()
      const books = StoredBooks
      books.forEach(book => UI.addBookToList(book))
  }
  
  // Method 2 : appends each book to the list
  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="fa-solid fa-trash-can"></a></td>
    `;

    list.appendChild(row);
  }
  // Method 3: removes book row from UI if the clicked element is the remove button
  static deleteBook(el) {
    if(el.classList.contains('fa-trash-can')) {
      el.parentElement.parentElement.remove();
    }
  }

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
  // Method 4: Clears the input values
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  // Method 1: Get books from localStotage
  static getBooks() {
    let books;
    // if there is no books, set books to empty array
    if(localStorage.getItem('books') === null) books = []
    // else get the books
      else books = JSON.parse(localStorage.getItem('books'));
    // returns empty or non-empty books
    return books;
  }
  
  // method 2: Takes book and pushes it to books and sets it to localStorage
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  
  // method 3: removes the specific book and resets from the localStorage
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      // removes the book, if its isbn equals the isbn of book to be removed
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event: Add a Book to UI and Store when the form is submitted
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get input values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Validate
  const emptyField = title === "" || author === "" || isbn === ""
  if(emptyField) alert('fill the shits!')
   else {
    // Instatiate book
    const book = new Book(title, author, isbn);

    UI.addBookToList(book);

    Store.addBook(book);
    
    /*UI.showAlert('Book Added', 'success')*/

    UI.clearFields();
  }
});

// Event: Remove a Book from UI and locaStorage
document.querySelector('#book-list').addEventListener('click', e => {
  const clickedEl = e.target
  
  const isbn = clickedEl.parentElement.previousElementSibling.textContent
  // Remove book from UI
  UI.deleteBook(clickedEl);

  // Remove book from store
  Store.removeBook(isbn);

  /*UI.showAlert('Book Removed', 'success');*/
});

