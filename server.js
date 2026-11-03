import http from "node:http";
import fs from "node:fs";

const server = http.createServer((req, res) => {
  const { url, method } = req;
  const parts = url.split("/");

  // books routes
  if (parts.at(2) === "books") {
    // GET /api/books
    if (parts.at(-1) === "books" && method === "GET") {
      // GET /api/books/:id
    } else if (
      parts.at(2) === "books" &&
      !Number.isNaN(Number(parts.at(-1))) &&
      method === "GET"
    ) {
      // POST /api/books
    } else if (parts.at(-1) === "books" && method === "POST") {
      // PATCH /api/books/:id
    } else if (
      parts.at(2) === "books" &&
      !Number.isNaN(Number(parts.at(-1))) &&
      method === "PATCH"
    ) {
      // DELETE /api/books/:id
    } else if (
      parts.at(2) === "books" &&
      !Number.isNaN(Number(parts.at(-1))) &&
      method === "DELETE"
    ) {
    }
    // authors routes
  } else if (parts.at(2) === "authors") {
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening...");
});
