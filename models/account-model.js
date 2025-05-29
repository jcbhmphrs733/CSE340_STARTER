const pool = require('../database');

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = 'INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *'
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
        console.error('Error registering account:', error);
        return error.message;
    }
}

module.exports = {
    registerAccount
};