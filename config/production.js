module.exports = {
    db: {
        host: 'localhost',
        port: process.env.DB_PORT || 5632,
        database: process.env.DB_NAME || "pandemix",
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        force_update: process.env.DB_FORCE_UPDATE || false,
    },
};