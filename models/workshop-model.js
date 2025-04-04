const pool = require('../database/');

async function getWorkshopsByLocation(city, zipcode) {
try {
    const sql = `SELECT workshop_name, address, services, city, zipcode, photo_url FROM workshop WHERE city = $1 AND zipcode =$2`;
    const result = await pool.query(sql, [city, zipcode]);
    return result.rows;
} catch (error) {
    console.error('Database query error:', error);
    throw error;
}
}

module.exports = { getWorkshopsByLocation};