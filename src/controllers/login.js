import { loginService } from "../services/login.js";

class LoginController{
    async login(req) { 
        return await loginService.login(req.body);
    }
}

export const loginController = new LoginController();