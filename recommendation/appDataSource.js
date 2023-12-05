const { createConnection } = require('typeorm');
let connection;
const initializeConnection = async () => {
    try {
        connection = await createConnection({
            type: "mysql",
            host: "rds 주소",
            port: 3306,
            username: "root",
            password: "password",
            database: "assignment4",
        });
        console.log("Connection has been initialized!");
    } catch (error) {
        console.error(`Initialize Connection Error: ${error}`);
    }
};
module.exports = {
    initializeConnection,
    getConnection: () => connection,
};
