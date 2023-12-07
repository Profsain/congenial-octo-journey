const loginCustomerOnServer = async (username, password) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  
  const loginData = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch(`${apiUrl}/api/customer/login`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

      const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: 'Login failed' };
  }
}

export default loginCustomerOnServer;