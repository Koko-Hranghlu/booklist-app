/*
CLASSES:-
1. Class Book represents a book to be created 
2. Class UI handles interface. It has 4 static methods:
 - displayBooks method that gets called when the DOM is loaded, which in turn calls another function, to retain the data that had been added
 - addBookToList method that adds book's data row to the table
 - deleteBook method deletes the row associated with the remove button
 - clearFields method clears all the input values
3. Class Store handles localStorage. It has 3 static methods:
 - getBooks method returns an array of empty or non- empty books from localStorage
 - addBook method adds a specific book to books array of localStorage
 - removeBook method removes a specific book from books array of localStorage
3. Store for elements in localStorage

Steps: 
1. Code the interactivity in the userinterface
2. Make the messages of validation, successes simple
3. Add interactivity in localStorage
4. Add more beautiful messages of the step 2
*/

class Book {
  constructor(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
  }
}

class UI {
  static displayBooks() {
    const StoredBooks = Store.getBooks()
      const books = StoredBooks
      books.forEach(book => UI.addBookToList(book))
  }
  
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
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) books = []
    else books = JSON.parse(localStorage.getItem('books'));
    return books;
  }
  
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) books.splice(index, 1);
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  const emptyField = title === "" || author === "" || isbn === ""
  if(emptyField) alert('fill the shits!')
   else {
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

document.addEventListener('DOMContentLoaded', UI.displayBooks)

