const addAuthor = async function (authorName) {
  try {
    const response = await fetch("127.0.0.1:8000/api/authors", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ authorName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status Code: ${response.status}`);
    }

    const data = response.json();
    console.log("New author added", data);
  } catch (err) {
    console.error(err);
  }
};

const addBook = async function (book) {
  try {
    const response = await fetch("127.0.0.1:8000/api/books", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(book),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status Code: ${response.status}`);
    }

    const data = response.json();
    console.log("New book added", data);
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

updateBookAvailability.addEventListener("submit", function (event) {
  event.preventDefault();

  const errorMessage = updateBookAvailability.querySelector(".error-message");

  if (!errorMessage.classList.contains("hidden")) {
    errorMessage.classList.add("hidden");
  }

  const authorIdInput = document.getElementById("update-book-author-id").value;
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

  if (authorIdInput <= 0) {
    updateBookAvailability
      .querySelector("#update-book-author-id")
      .classList.add("error-border");
    updateBookAvailability
      .querySelector(".error-message")
      .classList.remove("hidden");
  }

  if (authorIdInput <= 0 || typeof availability !== "boolean") {
    console.error("Invalid Author ID or Availability");
    return;
  }
});

addBookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (
    !addBookForm.querySelector(".error-message").classList.contains("hidden")
  ) {
    addBookForm.querySelector(".error-message").classList.add("hidden");
  }

  const titleInput = document.getElementById("title").value.trim();
  const authorIdInput = document
    .getElementById("add-book-author-id")
    .value.trim();
  const yearInput = document.getElementById("year").value;
  let availability = document
    .getElementById("add-book-isAvailable")
    .value.trim()
    .toLowerCase();

  if (availability === "true") {
    availability = true;
  } else if (availability === "false") {
    availability = false;
  } else {
    addBookForm
      .querySelector("#add-book-isAvailable")
      .classList.add("error-border");
    addBookForm.querySelector(".error-message").classList.remove("hidden");
  }

  if (!titleInput) {
    addBookForm.querySelector("#title").classList.add("error-border");
  }

  if (authorIdInput <= 0) {
    addBookForm
      .querySelector("#add-book-author-id")
      .classList.add("error-border");
  }

  if (yearInput <= 0) {
    addBookForm.querySelector("#year").classList.add("error-border");
  }

  if (
    !titleInput ||
    authorIdInput <= 0 ||
    year <= 0 ||
    typeof availability !== "boolean"
  ) {
    console.error("Invalid Title, Author ID, Year or Availability");
    addBookForm.querySelector(".error-message").classList.remove("hidden");
    return;
  }

  addBook({ titleInput, authorIdInput, yearInput, availability });

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
