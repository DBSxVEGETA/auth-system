const app = require("./app");
const DB = require("./db/index");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await DB.connectToDatabase();
    console.log("Database connection open");

    app.listen(PORT, () => {
      console.log(`Express server started at PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(`Cannot start the server at the moment, ${error.message}`);
  }
})();
