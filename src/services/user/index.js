const { queryDatabase } = require('../db'); // Import the MySQL query helper

/**
 * Fetch the username by UID from the MySQL database.
 * @param {string} uid - The UID of the user.
 * @returns {Promise<string|null>} - The username if found, otherwise null.
 */
async function getUsernameByUID(uid) {
  if (!uid) {
    console.error('UID is required');
    return null;
  }

  try {
    // Query the "users" table to find the user with the specified UID
    const results = await queryDatabase('SELECT name FROM users WHERE uid = ?', [uid]);

    if (results.length > 0) {
      const username = results[0].name;
      return username;
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }

  return null;
}

module.exports = getUsernameByUID;