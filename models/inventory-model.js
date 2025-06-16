const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

// Add a favorite
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("addFavorite error", error);
    throw error;
  }
}

// Remove a favorite
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2 RETURNING *`;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("removeFavorite error", error);
    throw error;
  }
}

/* ***************************
 * get user favorite vehicles
 * ************************** */
async function getUserFavorites(userId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.favorites AS f ON i.inv_id = f.inv_id 
      WHERE account_id = $1;`,
      [userId]
    );
    return data.rows;
  } catch (error) {
    console.error("getUserFavorites error " + error);
  }
}

/* ***************************
 *Determine if a vehicle is a favorite
 * ************************** */
async function isFavorite(userId, invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.favorites 
      WHERE account_id = $1 AND inv_id = $2`,
      [userId, invId]
    );
    return data.rows.length > 0;
  } catch (error) {
    console.error("isFavorite error " + error);
  }
}

/* ***************************
 *  Get inventory and classification data by inv_id
 *  Assignment 3, Task 1
 * ************************** */
async function getInventoryById(invId) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
      [invId]
    );
    return data.rows[0];
  } catch (error) {
    console.error(error);
  }
}

/* ***************************
 *  Add new classification data by classification_name
 * ************************** */
async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *",
      [classification_name]
    );
    return data.rows[0];
  } catch (error) {
    console.error("addClassification error " + error);
  }
}

/* ***************************
 *  Add new vehicle data by object
 * ************************** */
async function addVehicle(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    ]);
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return error.message;
  }
}

/* ***************************
 *  Update vehicle data by inv_id
 * ***************************/
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return error.message;
  }
}

/* ***************************
 * Delete vehicle data by inv_id
 * ***************************/
async function deleteVehicle(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1 RETURNING *";
    return await pool.query(sql, [inv_id]);
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return error.message;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addVehicle,
  updateInventory,
  deleteVehicle,
  addFavorite,
  removeFavorite,
  getUserFavorites,
  isFavorite,
};
