const books = [];
const RENDER_EVENT = "render-book";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function checkButton() {
  const checkBox = document.querySelector("#inputBookIsComplete");
  checkBox.addEventListener("checked", function () {
    if (checkBox == isComplete) addBookToComplete(id);
  });
}

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis : " + author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun : " + year;

  const buttonInputSection = document.createElement("div");
  buttonInputSection.classList.add("action");

  const inputSection = document.createElement("article");
  inputSection.classList.add("book_item");
  inputSection.append(textTitle, textAuthor, textYear);
  inputSection.append(buttonInputSection);
  inputSection.setAttribute("id", `book-${id}`);

  if (isComplete) {
    const notCompleteButton = document.createElement("button");
    notCompleteButton.classList.add("green");
    notCompleteButton.innerText = "Belum selesai dibaca";
    notCompleteButton.addEventListener("click", function () {
      removeBookFromComplete(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      deleteBookFromComplete(id);
      alert("Yakin hapus dari daftar Selesai dibaca?");
    });

    buttonInputSection.append(notCompleteButton, deleteButton);
  } else {
    const completeButton = document.createElement("button");
    completeButton.classList.add("green");
    completeButton.innerText = "Selesai dibaca";
    completeButton.addEventListener("click", function () {
      addBookToComplete(id);
    });

    const eraseButton = document.createElement("button");
    eraseButton.classList.add("red");
    eraseButton.innerText = "Hapus buku";
    eraseButton.addEventListener("click", function () {
      deleteBookFromComplete(id);
      alert("Yakin hapus dari daftar Belum selesai dibaca?");
    });

    buttonInputSection.append(completeButton, eraseButton);
  }

  return inputSection;
}

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document
  .getElementById("searchSubmit")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const searchBook = document
      .getElementById("searchBookTitle")
      .value.includes(books)
      .toLowerCase();
    const bookList = document.querySelectorAll(".book_item > h3");
    for (const books of bookList) {
      if (searchBook !== books.innerText.toLowerCase()) {
        books.parentElement.style.display = "none";
      } else {
        books.parentElement.style.display = "block";
      }
    }
  });

function addBookToComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBookFromComplete(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompleteBOOKList = document.getElementById("incompleteBookshelfList");
  const listComplete = document.getElementById("completeBookshelfList");

  uncompleteBOOKList.innerHTML = "";
  listComplete.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      listComplete.append(bookElement);
    } else {
      uncompleteBOOKList.append(bookElement);
    }
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK-APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
