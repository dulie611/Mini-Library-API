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

const addAuthorForm = document.getElementById("add-author-form");
const addBookForm = document.getElementById("add-book-form");
const updateBookAvailability = document.getElementById(
  "update-book-availability-form",
);
const deleteBookForm = document.getElementById("delete-book-form");

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
    console.log("here");
    addBookForm.querySelector("#add-book-isAvailable").style.border =
      "solid 2px red";
    addBookForm.querySelector(".error-message").classList.remove("hidden");
  }

  if (!titleInput) {
    addBookForm.querySelector("#title").style.border = "solid 2px red";
  }

  if (authorIdInput <= 0) {
    addBookForm.querySelector("#add-book-author-id").style.border =
      "solid 2px red";
  }

  if (yearInput <= 0) {
    addBookForm.querySelector("#year").style.border = "solid 2px red";
  }

  if (!titleInput || authorIdInput <= 0 || year <= 0) {
    console.error("Invalid Title, Author ID, Year or Availability");
    addBookForm.querySelector(".error-message").classList.remove("hidden");
    return;
  }
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
