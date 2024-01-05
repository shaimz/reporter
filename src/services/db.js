const mysql = require('mysql2/promise');

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL root password
  database: 'urban_report', // Replace with your database name
};

// MySQL query helper function
const queryDatabase = async (query, params = []) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(query, params);
    await connection.end();
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// CREATE TABLE IF NOT EXISTS users (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   emailID VARCHAR(255) NOT NULL,
//   name VARCHAR(255) NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   UNIQUE (emailID)
// );


// create table if not exists
// CREATE TABLE IF NOT EXISTS departments (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   emailID VARCHAR(255) NOT NULL,
//   department VARCHAR(255) NOT NULL,
//   departmentName VARCHAR(255) NOT NULL,
//   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   UNIQUE (emailID, department)
// );

// CREATE TABLE IF NOT EXISTS reports (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   uid VARCHAR(255) NOT NULL,
//   name VARCHAR(255) NOT NULL,
//   incidentType VARCHAR(255) NOT NULL,
//   description TEXT NOT NULL,
//   latitude FLOAT NOT NULL,
//   longitude FLOAT NOT NULL,
//   media TEXT,
//   anonymous BOOLEAN DEFAULT FALSE,
//   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (uid) REFERENCES users(id)
// );

// CREATE TABLE IF NOT EXISTS comments (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   report_id INT NOT NULL,
//   user_id INT NOT NULL,
//   comment TEXT NOT NULL,
//   date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (report_id) REFERENCES reports(id),
//   FOREIGN KEY (user_id) REFERENCES users(id)
// );

const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      emailID VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (emailID)
    )
  `;
  await queryDatabase(createTableQuery);
};

const createDepartmentsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS departments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      emailID VARCHAR(255) NOT NULL,
      department VARCHAR(255) NOT NULL,
      departmentName VARCHAR(255) NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (emailID, department)
    )
  `;
  await queryDatabase(createTableQuery);
};

const createReportsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      uid VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      incidentType VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      media TEXT,
      anonymous BOOLEAN DEFAULT FALSE,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (uid) REFERENCES users(id)
    )
  `;
  await queryDatabase(createTableQuery);
};

const createFilesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      file_path VARCHAR(255) NOT NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  await queryDatabase(createTableQuery);
};

const createCommentsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      report_id INT NOT NULL,
      user_id INT NOT NULL,
      comment TEXT NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (report_id) REFERENCES reports(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  await queryDatabase(createTableQuery);
};

// Create tables if they do not exist
const createTables = async () => { 
  await createUsersTable().catch((error) => {
    console.error('Error creating users table:', error);
  });
  await createDepartmentsTable().catch((error) => {
    console.error('Error creating departments table:', error);
  });
  await createReportsTable().catch((error) => {
    console.error('Error creating reports table:', error);
  });
  await createFilesTable().catch((error) => {
    console.error('Error creating files table:', error);
  });
  await createCommentsTable().catch((error) => {
    console.error('Error creating comments table:', error);
  });

  console.log('All tables created successfully');
}

createTables();
module.exports = { createTables, queryDatabase };