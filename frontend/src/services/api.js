const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const sendChatMessage = async (message) => {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 