const extractToken = (token: string): string | null => {
  if (!token) {
    return null;
  }

  try {
    const tokenParts = JSON.parse(atob(token.split(".")[1]));
    return tokenParts.user;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default extractToken;
