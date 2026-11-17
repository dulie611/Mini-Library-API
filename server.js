import http from "node:http";
import fs from "node:fs";

const server = http.createServer((req, res) => {
  const { url, method } = req;
  const parts = url.split("/");
  console.log(url, method);

  // CORS Preflight request
  if (url === "/api/books" && method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*", // which website is allowed to send request to server
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // what http methods are allowed to be sent to server
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  } else if (url.startsWith("/api/books/") && method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*", // which website is allowed to send request to server
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS", // what http methods are allowed to be sent to server
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  } else if (url === "/api/authors" && method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*", // which website is allowed to send request to server
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // what http methods are allowed to be sent to server
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // books routes
  if (parts.at(2) === "books") {
    // GET /api/books
    if (parts.at(-1) === "books" && method === "GET") {
      fs.readFile("./library/library.json", "utf-8", (err, data) => {
        if (err) {
          res.writeHead(500, {
            "Content-type": "text/plain",
          });
          res.end("Error reading file.");
          return;
        }

        const { books } = JSON.parse(data);

        res.writeHead(200, {
          "Content-type": "application/json",
        });
        res.end(JSON.stringify(books));
        return;
      });

      // GET /api/books/:id
    } else if (
      parts.at(2) === "books" &&
      !Number.isNaN(Number(parts.at(-1))) &&
      method === "GET"
    ) {
      const id = Number(parts.at(-1));
      fs.readFile("./library/library.json", "utf-8", (err, data) => {
        if (err) {
          res.writeHead(500, {
            "Content-type": "text/plain",
          });
          res.end("Error reading file.");
        }

        const { books } = JSON.parse(data);
        const book = books.find((el) => el.id === id);

        if (!book) {
          res.writeHead(404, {
            "Content-type": "text/plain",
          });
          res.end("Book does not exist!");
          return;
        }

        res.writeHead(200, {
          "Content-type": "application/json",
        });
        res.end(JSON.stringify(book));
        return;
      });
      // POST /api/books
    } else if (parts.at(-1) === "books" && method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const bookData = JSON.parse(body);

        if (
          bookData.title === "" ||
          bookData.authorId <= 0 ||
          bookData.year <= 0 ||
          typeof bookData.available !== "boolean" ||
          typeof bookData.title !== "string" ||
          typeof bookData.authorId !== "number" ||
          typeof bookData.year !== "number"
        ) {
          res.writeHead(400, {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(JSON.stringify({ message: "Invalid author data!" }));
          return;
        }

        fs.readFile("./library/library.json", "utf-8", (err, data) => {
          if (err) {
            res.writeHead(500, {
              "Content-type": "application/json",
            });
            res.end(JSON.stringify({ message: "Error reading file." }));
          }

          const { authors, books } = JSON.parse(data);
          const author = authors.find((el) => el.id === bookData.authorId);

          if (!author) {
            res.writeHead(400, {
              "Content-type": "application/json",
            });
            res.end(JSON.stringify({ message: "Author does not exist!" }));
            return;
          }

          bookData.id =
            books.length >= 1 ? Math.max(...books.map((el) => el.id)) + 1 : 1;

          books.push(bookData);

          fs.writeFile(
            "./library/library.json",
            JSON.stringify({ authors, books }),
            "utf-8",
            (err) => {
              if (err) {
                res.writeHead(500, {
                  "Content-type": "application/json",
                });
                res.end(JSON.stringify({ message: "Error writing file!" }));
              }
              res.writeHead(201, {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
              });
              res.end(JSON.stringify(bookData));
            },
          );
        });
      });
      // PATCH /api/books/:id
    } else if (
      parts.at(2) === "books" &&
      !Number.isNaN(Number(parts.at(-1))) &&
      method === "PATCH"
    ) {
      const id = Number(parts.at(-1));
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const bookData = JSON.parse(body);

        if (
          typeof bookData.available !== "boolean" ||
          typeof bookData.id !== "number" ||
          bookData.id <= 0
        ) {
          res.writeHead(400, {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(
            JSON.stringify({ message: "Invalid Author ID or Availability!" }),
          );
          return;
        }

        fs.readFile("./library/library.json", "utf-8", (err, data) => {
          if (err) {
            res.writeHead(500, {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            });
            res.end(JSON.stringify({ message: "Error reading file!" }));
            return;
          }

          const { books, authors } = JSON.parse(data);
          const bookToUpdate = books.find((el) => el.id === id);

          if (!bookToUpdate) {
            res.writeHead(400, {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            });
            res.end(JSON.stringify({ message: "Author does not exist!" }));
            return;
          }

          bookToUpdate.available = bookData.available;

          fs.writeFile(
            "./library/library.json",
            JSON.stringify({ books, authors }),
            "utf-8",
            (err) => {
              if (err) {
                res.writeHead(500, {
                  "Content-type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                });
                res.end(JSON.stringify({ message: "Error writing file" }));
                return;
              }
              res.writeHead(200, {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
              });
              res.end(JSON.stringify(bookToUpdate));
              return;
            },
          );
        });
      });
      // DELETE /api/books/:id
    } else if (
      parts.at(2) === "books" &&
      !Number.isNaN(Number(parts.at(-1))) &&
      method === "DELETE"
    ) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const bookIdData = JSON.parse(body);
        console.log(bookIdData);

        if (bookIdData <= 0 || typeof bookIdData !== "number") {
          res.writeHead(400, {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(JSON.stringify({ message: "Invalid Book ID" }));
          return;
        }

        fs.readFile("./library/library.json", "utf-8", (err, data) => {
          if (err) {
            res.writeHead(500, {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            });
            res.end(JSON.stringify({ message: "Error reading file!" }));
            return;
          }

          const { authors, books } = JSON.parse(data);

          const bookToDelete = books.find((el) => el.id === bookIdData);
          if (!bookToDelete) {
            res.writeHead(400, {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            });
            res.end(JSON.stringify({ message: "Book does not exist!" }));
            return;
          }

          const newBooksData = books.filter((el) => el.id !== bookToDelete.id);

          fs.writeFile(
            "./library/library.json",
            JSON.stringify({ authors, books: newBooksData }),
            "utf-8",
            (err) => {
              if (err) {
                res.writeHead(500, {
                  "Content-type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                });
                res.end(JSON.stringify({ message: "Error writing file!" }));
                return;
              }

              res.writeHead(204, {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
              });
              res.end();
            },
          );
        });
      });
      //   GET /api/books/available
    } else if (
      parts.at(2) === "books" &&
      parts.at(3) === "available" &&
      parts.at(-1) === "available" &&
      method === "GET"
    ) {
      fs.readFile("./library/library.json", "utf-8", (err, data) => {
        if (err) {
          res.writeHead(500, {
            "Content-type": "text/plain",
          });
          res.end("Error reading file!");
          return;
        }

        const { books } = JSON.parse(data);

        const availableBooks = books.filter((el) => el.available === true);
        res.writeHead(200, {
          "Content-type": "application/json",
        });
        res.end(JSON.stringify(availableBooks));
      });
      //   GET /api/books/stats
    } else if (
      parts.at(2) === "books" &&
      parts.at(3) === "stats" &&
      parts.at(-1) === "stats" &&
      method === "GET"
    ) {
      fs.readFile("./library/library.json", "utf-8", (err, data) => {
        if (err) {
          res.writeHead(500, {
            "Content-type": "text/plain",
          });
          res.end("Error reading file!");
          return;
        }

        const { books } = JSON.parse(data);
        const stats = books.reduce(
          (acc, el) => {
            acc.totalBooks += 1;
            el.available === true
              ? (acc.availableBooks += 1)
              : (acc.checkedOutBooks += 1);

            return acc;
          },
          {
            totalBooks: 0,
            availableBooks: 0,
            checkedOutBooks: 0,
          },
        );

        res.writeHead(200, {
          "Content-type": "application/json",
        });
        res.end(JSON.stringify(stats));
      });
    } else {
      res.writeHead(404, {
        "Content-type": "text/plain",
      });
      res.end("Page not found");
      return;
    }
    // authors routes
  } else if (parts.at(2) === "authors") {
    // GET /api/authors
    if (parts.at(-1) === "authors" && method === "GET") {
      fs.readFile("./library/library.json", "utf-8", (err, data) => {
        if (err) {
          res.writeHead(500, {
            "Content-type": "text/plain",
          });
          res.end("Error reading file!");
          return;
        }

        const { authors } = JSON.parse(data);

        res.writeHead(200, {
          "Content-type": "application/json",
        });
        res.end(JSON.stringify(authors));
      });
      // GET /api/authors/:id
    } else if (
      parts.at(2) === "authors" &&
      !Number.isNaN(Number(parts.at(-1))) &&
      method === "GET"
    ) {
      const id = Number(parts.at(-1));
      console.log(id);

      fs.readFile("./library/library.json", "utf-8", (err, data) => {
        if (err) {
          res.writeFile(500, {
            "Content-type": "text/plain",
          });
          res.end("Error reading file");
          return;
        }

        const { authors } = JSON.parse(data);
        const authorData = authors.find((el) => el.id === id);
        if (!authorData) {
          res.writeHead(404, {
            "Content-type": "text/plain",
          });
          res.end("Author does not exist");
          return;
        }
        res.writeHead(200, {
          "Content-type": "application/json",
        });
        res.end(JSON.stringify(authorData));
      });
      //   POST /api/authors
    } else if (parts.at(2) === "authors" && method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const authorData = JSON.parse(body);
        if (authorData.name === "" || typeof authorData.name !== "string") {
          res.writeHead(400, {
            "Content-type": "application/json",
          });
          res.end(JSON.stringify({ message: "Invalid author name" }));
          return;
        }

        fs.readFile("./library/library.json", "utf-8", (err, data) => {
          if (err) {
            res.writeHead(500, {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            });
            res.end(JSON.stringify({ message: "Error reading file" }));
            return;
          }

          const { authors, books } = JSON.parse(data);
          if (authors.some((el) => el.name === authorData.authorName)) {
            res.writeHead(400, {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            });
            res.end(JSON.stringify({ message: "Author already exists" }));
            return;
          }

          authorData.id =
            authors.length >= 1
              ? Math.max(...authors.map((el) => el.id)) + 1
              : 1;

          authors.push(authorData);
          console.log(authors);

          fs.writeFile(
            "./library/library.json",
            JSON.stringify({ authors, books }),
            "utf-8",
            (err) => {
              if (err) {
                res.writeHead(500, {
                  "Content-type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                });
                res.end(JSON.stringify({ message: "Error writing file" }));
                return;
              }

              res.writeHead(200, {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
              });
              res.end(
                JSON.stringify({ message: "Successfully added author!" }),
              );
            },
          );
        });
      });
      //   GET /api/authors/:id/books
    } else if (
      parts.at(2) === "authors" &&
      !Number.isNaN(Number(parts.at(3))) &&
      parts.at(4) === "books" &&
      method === "GET"
    ) {
      const authorID = Number(parts.at(3));

      fs.readFile("./library/library.json", "utf-8", (err, data) => {
        if (err) {
          res.writeHead(500, {
            "Content-type": "text/plain",
          });
          res.end("Error reading file");
          return;
        }

        const { books } = JSON.parse(data);
        res.end(JSON.stringify(books.filter((el) => el.authorId === authorID)));
      });
    } else {
      res.writeHead(404, {
        "Content-type": "text/plain",
      });
      res.end("Page not found");
      return;
    }
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening...");
});
