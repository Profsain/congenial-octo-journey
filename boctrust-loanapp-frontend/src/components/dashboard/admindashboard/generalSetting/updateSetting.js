const apiUrl = import.meta.env.VITE_BASE_URL;

const updateSettings = async (updatedSettings) => {
    try {
        const response = await fetch(`${apiUrl}/api/settings/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSettings)
        });

        if (!response.ok) {
            throw new Error('Failed to update settings');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating settings:', error.message);
        throw error;
    }
};

export default updateSettings;

// Usage example:
// const updatedSettings = {
//     siteTitle: 'Updated Site Title',
//     address: 'Updated Address',
//     // Include other updated properties as needed
// };

// updateSettings(updatedSettings)
//     .then(data => console.log('Settings updated:', data))
//     .catch(error => console.error('Failed to update settings:', error));
