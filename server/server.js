// filepath: server/server.js
const app = require("./index");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
// This file initializes the server and listens on the specified port.
