// Define a function to handle adminRoles
const handleAdminRoles = (user, setAdminRoles) => {
  if (user?.adminRoles?.length > 1) {
    setAdminRoles(user?.adminRoles);
  } else {
    const roles = user?.adminRoles[0]?.split(",");
    setAdminRoles(roles);
  }
};

export default handleAdminRoles;