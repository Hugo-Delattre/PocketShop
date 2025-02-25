import { jwtDecode } from "jwt-decode";
import { UserRole } from "./repositories/users/usersRepositories";

class Token {
  public getToken(key: string) {
    return localStorage.getItem(key);
  }

  public setToken(key: string, token: string) {
    localStorage.setItem(key, token);
    const { role } = jwtDecode<{ role: UserRole }>(token);
    return { role };
  }

  public removeToken(key: string) {
    localStorage.removeItem(key);
  }

  public decodeToken(key: string) {
    const token = this.getToken(key);
    if (!token) {
      return {};
    }
    const { role } = jwtDecode<{ role: UserRole }>(token);
    return { role };
  }
}
const token = new Token();
export default token;
