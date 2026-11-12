const addAuthor = async function (authorName) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/authors", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name: authorName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status Code: ${response.status}`);
    }

    const data = await response.json();
    console.log("New author added", data);
  } catch (err) {
    console.error(err);
  }
};

const addBook = async function (book) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/books", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(book),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status Code: ${response.status}`);
    }

    const data = await response.json();
    console.log("New book added", data);
  } catch (err) {
    console.error(err);
  }
};

const updateBook = async function (book) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(book),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status Code: ${response.status}`);
    }

    const data = await response.json();
    console.log("Book updated", data);
  } catch (err) {
    console.error(err);
  }
};

const deleteBook = async function (authorId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/books/${authorId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(authorId),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      throw new Error(`HTTP Error! Status Code: ${response.status}`);
    } else {
      console.log("Book deleted!");
    }
  } catch (err) {
    console.error(err);
  }
};

const addAuthorForm = document.getElementById("add-author-form");
const addBookForm = document.getElementById("add-book-form");
const updateBookAvailability = document.getElementById(
  "update-book-availability-form",
);
const deleteBookForm = document.getElementById("delete-book-form");

deleteBookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const errorMessage = deleteBookForm.querySelector(".error-message");

  if (!errorMessage.classList.contains("hidden")) {
    errorMessage.classList.add("hidden");
  }

  const authorId = Number(
    document.getElementById("delete-book-id").value.trim(),
  );
  const authorIdElement = document.getElementById("delete-book-id");

  if (authorId <= 0) {
    errorMessage.classList.remove("hidden");
    authorIdElement.classList.add("error-border");
    console.error("Invalid Author ID!");
    return;
  }

  if (authorIdElement.classList.contains("error-border")) {
    authorIdElement.classList.remove("error-border");
  }
  deleteBook(authorId);
  deleteBookForm.reset();
});

updateBookAvailability.addEventListener("submit", function (event) {
  event.preventDefault();

  const errorMessage = updateBookAvailability.querySelector(".error-message");

  if (!errorMessage.classList.contains("hidden")) {
    errorMessage.classList.add("hidden");
  }

  const bookIdInput = Number(document.getElementById("update-book-id").value);
  let availability = document
    .getElementById("update-book-isAvailable")
    .value.trim()
    .toLowerCase();

  if (availability === "true") {
    availability = true;
  } else if (availability === "false") {
    availability = false;
  } else {
    updateBookAvailability
      .querySelector("#update-book-isAvailable")
      .classList.add("error-border");
    updateBookAvailability
      .querySelector(".error-message")
      .classList.remove("hidden");
  }

  if (bookIdInput <= 0) {
    updateBookAvailability
      .querySelector("#update-book-id")
      .classList.add("error-border");
    updateBookAvailability
      .querySelector(".error-message")
      .classList.remove("hidden");
  }

  if (bookIdInput <= 0 || typeof availability !== "boolean") {
    console.error("Invalid Author ID or Availability");
    return;
  }

  const bookIdElement = document.getElementById("update-book-id");
  const availableElement = document.getElementById("update-book-isAvailable");

  if (
    bookIdElement.classList.contains("error-border") ||
    availableElement.classList.contains("error-border")
  ) {
    bookIdElement.classList.remove("error-border");
    availableElement.classList.remove("error-border");
  }

  updateBook({ id: bookIdInput, available: availability });

  updateBookAvailability.reset();
});

addBookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (
    !addBookForm.querySelector(".error-message").classList.contains("hidden")
  ) {
    addBookForm.querySelector(".error-message").classList.add("hidden");
  }

  const title = document.getElementById("title").value.trim();
  const authorId = Number(document.getElementById("add-book-author-id").value);
  const year = Number(document.getElementById("year").value);
  let available = document
    .getElementById("add-book-isAvailable")
    .value.trim()
    .toLowerCase();

  if (available === "true") {
    available = true;
  } else if (available === "false") {
    available = false;
  } else {
    addBookForm
      .querySelector("#add-book-isAvailable")
      .classList.add("error-border");
    addBookForm.querySelector(".error-message").classList.remove("hidden");
  }

  if (!title) {
    addBookForm.querySelector("#title").classList.add("error-border");
  }

  if (authorId <= 0) {
    addBookForm
      .querySelector("#add-book-author-id")
      .classList.add("error-border");
  }

  if (year <= 0) {
    addBookForm.querySelector("#year").classList.add("error-border");
  }

  if (!title || authorId <= 0 || year <= 0 || typeof available !== "boolean") {
    console.error("Invalid Title, Author ID, Year or Availability");
    addBookForm.querySelector(".error-message").classList.remove("hidden");
    return;
  }

  addBook({ title, authorId, year, available });

  const authorIdElement = document.getElementById("add-book-author-id");
  const bookTitleElement = document.getElementById("title");
  const yearElement = document.getElementById("year");
  const availableElement = document.getElementById("add-book-isAvailable");

  if (
    authorIdElement.classList.contains("error-border") ||
    bookTitleElement.classList.contains("error-border") ||
    yearElement.classList.contains("error-border") ||
    availableElement.classList.contains("error-border")
  ) {
    authorIdElement.classList.remove("error-border");
    bookTitleElement.classList.remove("error-border");
    yearElement.classList.remove("error-border");
    availableElement.classList.remove("error-border");
  }

  addBookForm.reset();
});

addAuthorForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (
    !addAuthorForm.querySelector(".error-message").classList.contains("hidden")
  ) {
    addAuthorForm.querySelector(".error-message").classList.add("hidden");
  }

  const authorInput = document.getElementById("author").value.trim();

  if (authorInput === "") {
    console.error("Enter a valid author name!");
    addAuthorForm.querySelector(".error-message").classList.remove("hidden");
    return;
  }

  addAuthor(authorInput);

  addAuthorForm.reset();
});
