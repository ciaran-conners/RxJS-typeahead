const path = require("path");
const app = require("./app");
const { PORT } = require("./constants.js");

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "index.html"))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
