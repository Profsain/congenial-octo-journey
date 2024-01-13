/* eslint-disable no-undef */
  // Function to set a cookie with a specified name, value, and expiration duration in days
  const setCookie= (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;`;
  }
  // Function to retrieve the value of a cookie by its name
  const getCookie = (name) => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  }

  export { setCookie, getCookie };