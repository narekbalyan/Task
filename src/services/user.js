import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { helper } from "./helpers.js";
import {Session} from "../models/session.js";

class UserService {
    async getUsers() {
        const users = await User.find();
        return users;
    }

    async register(body) {
        const { username, password } = body;


        if (!(password && username)) {
            throw new Error();
        }

        const checkedUser = await User.findOne({
            username: username
        })

        if (checkedUser?.status === "active" || checkedUser?.status === "inactive") {
            throw new Error();
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const credentials = {username, password: hashedPassword};
        await User.create(credentials);
    }

    async deleteUser(req) {
        const id = helper.getIdFromToken(req);

        if (!id === req.params.id) {
            throw new Error();
        }

        const user = await User.findOne({
            id
        });

        await Session.deleteOne({
            user_id: id,
        });

        user.status = "deleted";
        await user.save();
    }

    async logout(req) {
        const id = helper.getIdFromToken(req);

        const user = await User.findOne({
            id,
        });

        await Session.deleteOne({
            user_id: id,
        });
        
        user.status = "inactive";
        await user.save();

    }
}

export const userService = new UserService();