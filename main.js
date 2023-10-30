const bookShelf = {
  books: JSON.parse(localStorage.getItem("books")) || [],

  addBook(book) {
    this.books.push(book);
    this.saveBooks();
    this.displayBooks();
  },

  searchBooks(query) {
    const filteredBooks = this.books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    this.displayBooks(filteredBooks);
  },

  markComplete(bookId) {
    const book = this.books.find((book) => book.id === bookId);
    book.isComplete = true;
    this.saveBooks();
    this.displayBooks();
  },

  undoComplete(bookId) {
    const book = this.books.find((book) => book.id === bookId);
    book.isComplete = false;
    this.saveBooks();
    this.displayBooks();
  },

  removeBook(bookId) {
    this.books.splice(
      this.books.findIndex((book) => book.id === bookId),
      1
    );
    this.saveBooks();
    this.displayBooks();
  },

  saveBooks() {
    localStorage.setItem("books", JSON.stringify(this.books));
  },

  displayBooks(books = this.books) {
    const unfinishedList = document.querySelector("#incomplete");
    const finishedList = document.querySelector("#complete");

    unfinishedList.innerHTML = "";
    finishedList.innerHTML = "";

    books.forEach((book) => {
      const article = document.createElement("article");
      article.classList.add("book_item");

      const title = document.createElement("h3");
      title.innerText = book.title;

      const author = document.createElement("p");
      author.innerText = `Author: ${book.author}`;

      const year = document.createElement("p");
      year.innerText = `Tahun: ${book.year}`;

      article.appendChild(title);
      article.appendChild(author);
      article.appendChild(year);

      const action = document.createElement("div");
      action.classList.add("action");

      const finishButton = document.createElement("button");
      finishButton.id = book.id;
      finishButton.classList.add("fa-solid", "fa-check", "green");
      finishButton.addEventListener("click", () => this.markComplete(book.id));

      const undoButton = document.createElement("button");
      undoButton.id = book.id;
      undoButton.classList.add("fa-solid", "fa-check", "orange");
      undoButton.addEventListener("click", () => this.undoComplete(book.id));

      const deleteButton = document.createElement("button");
      deleteButton.id = book.id;
      deleteButton.classList.add("fa-solid", "fa-xmark", "red");
      deleteButton.addEventListener("click", (event) => {
        event.preventDefault();

        Swal.fire({
          title: "Kamu yakin menghapus buku ini?",
          text: "Buku yang dihapus, tidak dapat dikembalikan",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#C265E3",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya Hapus!",
        }).then((result) => {
          if (result.isConfirmed) {
            // Delete the book.
            this.removeBook(book.id);
            Swal.fire({
              title: "Buku berhasil dihapus",
              text: "",
              icon: "success",
              timer: 2000,
            });
          }
        });
      });

      if (book.isComplete) {
        action.appendChild(undoButton);
      } else {
        action.appendChild(finishButton);
      }
      action.appendChild(deleteButton);

      article.appendChild(action);

      if (book.isComplete) {
        finishedList.appendChild(article);
      } else {
        unfinishedList.appendChild(article);
      }
    });
  },
};
bookShelf.displayBooks();

// Event Listener
document.querySelector("#bookForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const yearInput = document.querySelector("#year");
  const yearValue = parseInt(yearInput.value);

  if (yearValue >= 1600 && yearValue <= 2100) {
    const book = {
      id: +new Date(),
      title: document.querySelector("#title").value,
      author: document.querySelector("#author").value,
      year: yearValue,
      isComplete: document.querySelector("#status").checked,
    };

    const clear = () => {
      document.getElementById("title").value = "";
      document.getElementById("author").value = "";
      yearInput.value = "";
      document.querySelector("#status").checked = false;
    };

    bookShelf.addBook(book);
    clear();
  } else {
    Swal.fire({
      title: "Error",
      text: "Mohon isi tahun dari jangka waktu (1600-2100)",
      icon: "error",
    });
  }
});

document.querySelector("#search").addEventListener("click", (event) => {
  event.preventDefault();
  const query = document.querySelector("#searchBook").value.toLowerCase();
  const filteredBooks = bookShelf.searchBooks(query);
  if (filteredBooks && filteredBooks.length === 0) {
    Swal.fire(
      "Not Found",
      "The book you searched for is not found!",
      "warning"
    );
  }
});
