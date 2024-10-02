import { useSelector } from "react-redux";
import extractToken from "./extractToken";

export const GetInitialToken = (name: string) => {
  const token = useSelector((state: any) => state.order[name]);
  
  const userDetails = extractToken(token as string);
  
  return userDetails || null;
};
