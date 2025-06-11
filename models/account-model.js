const pool = require("../database");

/* **********************
 *   Register a new account
 * ********************* */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    console.log("model var passed to db:", account_password);
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    console.error("Error registering account:", error);
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Get account by email
 * ********************* */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching account by email:", error);
    return new Error("No account found with that email");
  }
}

async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
  } catch (error) {
    console.error("Error updating account:", error);
    return error.message;
  }
}

async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1";
    const result = await pool.query(sql, [account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    return new Error("No account found with that ID");
  }
}
//// Export the functions for use in other modules

module.exports = {
  getAccountById,
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  updateAccount,
};
