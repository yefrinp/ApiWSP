var config = {
	debug: false,
	database: {
	    connectionLimit: 500,
	    host: "108.167.183.88",
	    user: "ceylinks_UserApp",
	    password: "PasswordApp",
	    database: "ceylinks_WaBotOK2025",
	    charset : "utf8mb4",
	    debug: false,
	    waitForConnections: true,
	    multipleStatements: true
	},
	cors: {
		origin: '*',
 		optionsSuccessStatus: 200
	}
}

module.exports = config; 