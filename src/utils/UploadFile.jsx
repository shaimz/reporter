import instance from "./axios-instance";

// Function to upload a file by sending it to the backend
export const uploadFile = async (files, userId) => {
    try {
        console.log('Uploading file:', files, userId);
        if (!files) {
            throw new Error('No file provided');
        }

        if (!userId) {
            throw new Error('User ID is required');
        }

        // Create a FormData object to send the file and user ID
        const formData = new FormData();
        // formData.append('file', file);
        for (let i = 0; i < files.length; i++) {
            console.log('Appending file:', files[i]);
            formData.append('files', files[i]);
        }
        formData.append('userId', userId);

        // Send the file to the backend
        const response = await instance.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Return the response from the backend
        return response.data.filePath; // Assuming the backend returns the file path
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }
};