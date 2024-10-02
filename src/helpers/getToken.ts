import Cookies from "js-cookie";
import extractToken from "./extractToken";

export const getInitialToken = (name: string) => {
  const token = Cookies.get(name);

  const userDetails = extractToken(token as string);
  return userDetails || null;
};
