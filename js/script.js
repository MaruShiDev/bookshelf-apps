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

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  // const checkBox = document.querySelector("inputBookIsComplete");
  // checkBox.addEventListener("click", function () {
  //   addBookToComplete(id);
  // });

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
    });

    buttonInputSection.append(completeButton, eraseButton);
  }

  return inputSection;
}

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    false
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBook() {
  const searchBar = document
    .form("searchBook")
    .querySelector("searchBookTitle");

  if (bookTitle == bookObject) {
    return bookObject;
  }
}

function addBookToComplete(bookId /* HTMLELement */) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBookFromComplete(bookId /* HTMLELement */) {
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

  // clearing list item
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

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
  // alert() = 'test';
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
