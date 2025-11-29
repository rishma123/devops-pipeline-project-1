const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello Rishma — CI/CD pipeline project is running!");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
