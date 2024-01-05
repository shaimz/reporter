const { queryDatabase } = require('./db');

// Send a report
const sendReport = async (uid, u_name, incidentType, description, latitude, longitude, imageUrl, anonymousReporting, files = []) => {
  if (!description || latitude === -1 || longitude === -1 || !incidentType) {
    throw new Error('All fields are required');
  }

  const images = []
  
  const report = {
    uid: anonymousReporting ? null : uid,
    u_name: anonymousReporting ? null : u_name,
    incidentType,
    description,
    latitude,
    longitude,
    imageUrl,
    filed: false,
    anonymousReporting,
    timestamp: new Date(),
  };

  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds the limit of 5MB');
    }
    
    const imageUrl = await uploadFile(file, uid);
    if (!imageUrl) {
      throw new Error('Error uploading file');
    }

    images.push(imageUrl);
  }


  try {
    await queryDatabase(
      `INSERT INTO reports (uid, u_name, incidentType, description, latitude, longitude, imageUrl, filed, anonymousReporting, timestamp) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        report.uid,
        report.u_name,
        report.incidentType,
        report.description,
        report.latitude,
        report.longitude,
        images.join(','),
        report.filed,
        report.anonymousReporting,
        report.timestamp,
      ]
    );

    return { success: true, message: 'Report submitted successfully' };
  } catch (error) {
    throw new Error('Error submitting report');
  }
};

// Get all reports
const getAllReports = async () => {
  try {
    const results = await queryDatabase('SELECT * FROM reports WHERE filed = false ORDER BY timestamp ASC');
    return results;
  } catch (error) {
    throw new Error('Error fetching reports');
  }
};

// Get filed reports
const getFiledReports = async () => {
  try {
    const results = await queryDatabase('SELECT * FROM reports WHERE filed = true ORDER BY timestamp DESC');
    return results;
  } catch (error) {
    throw new Error('Error fetching filed reports');
  }
};

// Delete a report
const deleteReport = async (reportId) => {
  try {
    await queryDatabase('DELETE FROM reports WHERE id = ?', [reportId]);
    return { success: true, message: 'Report deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting report');
  }
};

// Update report state
const updateReportState = async (reportId) => {
  try {
    await queryDatabase('UPDATE reports SET filed = true WHERE id = ?', [reportId]);
    return { success: true, message: 'Report state updated successfully' };
  } catch (error) {
    throw new Error('Error updating report state');
  }
};

module.exports = {
  sendReport,
  getAllReports,
  getFiledReports,
  deleteReport,
  updateReportState,
};