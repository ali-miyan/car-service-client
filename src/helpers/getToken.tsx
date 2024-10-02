import extractToken from "./extractToken";
import { useSelector } from "react-redux";

export const GetInitialToken = (name: string) => {

  const token = useSelector((state: any) => state.order[name]);

  const userDetails = extractToken(token as string);
  return userDetails || null;
};
