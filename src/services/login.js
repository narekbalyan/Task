import {User} from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {Session} from "../models/session.js";

class LoginService {
    async login(body) {
        const expTime = Math.floor(Date.now() / 1000);
        const secretKey = process.env.SECRET_KEY || 'dummySecretKey';
        const {username, password} = body;

        const current_user = await User.findOne({ username: username });

        if (!current_user || current_user?.status === "deleted") {
            throw new Error();
        }

        const isPassMatched = await bcrypt.compare(password, current_user.password);

        if (!isPassMatched) {
            throw new Error();
        }

        const user_id = current_user.id

        const accessToken = jwt.sign({id: user_id}, secretKey);

        current_user.status = "active";

        delete current_user.password;

        const session = await Session.findOne({user_id: user_id})

        if (!session) {
            await Session.create({ user_id: user_id, exp: expTime });
        } else {
            session.exp = expTime;
            await session.save();
        }

        await current_user.save();

        return {
            current_user,
            token: accessToken
        };
    }
}

export const loginService = new LoginService();