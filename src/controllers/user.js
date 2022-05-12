import { userService } from "../services/user.js";

class UserController{
    async getUsers() {
        return await userService.getUsers();
    }

    async register(req) {
        await userService.register(req.body);
    }

    async deleteUser(req) {
        await userService.deleteUser(req);
    }

    async logout(req) {
        await userService.logout(req);
    }
}

export const userController = new UserController();
