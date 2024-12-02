const app = require('./app');
const sequelize = require('./config/db');
const PORT = process.env.PORT || 8080;

sequelize.sync()
    .then(() => {
        console.log("Database syncronized");
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
        });
    })
    .catch(error => {
        console.log("Faild to sync with database: ", error.message);
    });
