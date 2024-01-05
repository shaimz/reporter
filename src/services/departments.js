const { queryDatabase } = require('./db');

// Add a department admin
const addDeptAdmin = async (email, dept) => {
  if (!email || !dept) {
    throw new Error('All fields are required');
  }

  const departmentMap = new Map([
    ['Accident', 'Accident'],
    ['Infrastructure', 'Infrastructure Issue'],
    ['Crime', 'Crime'],
    ['Suspicious activities', 'Suspicious activities'],
    ['Cybersecurity', 'Cybersecurity Concerns'],
    ['Social Issues', 'Social Issues'],
  ]);

  const deptName = departmentMap.get(dept);

  try {
    await queryDatabase(
      `INSERT INTO departments (emailID, department, departmentName, date) VALUES (?, ?, ?, ?)`,
      [email, dept, deptName, new Date()]
    );
    return { success: true, message: 'Admin added successfully' };
  } catch (error) {
    throw new Error('Error adding admin');
  }
};

module.exports = {
  addDeptAdmin,
};