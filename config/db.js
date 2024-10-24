const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((con) => {
      console.log(`connected mongodb : ${con.connection.host}`);
    })
    .catch((err) => {
      console.error(`ERROR DB: ${err}`);
      process.exit(1);
    });
};
