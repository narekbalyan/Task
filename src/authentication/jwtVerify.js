import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";

export async function jwtVerify(req, res, next) {

    try {
        const curr_date = Math.floor(Date.now() / 1000);
        const exp_time = process.env.EXP_TIME;

        if (checkUrlMatching(req.url)) {
            return next();
        }
    
        const authHeader = req.headers['authorization'] || req.headers['Authorization'] || req.body['token'];
    
        if (!authHeader) {
            throw new Error("Unauthorized");
        }
    
        const token  = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
            throw new Error();
        }
    
        const secret_key = process.env.SECRET_KEY;
        const tokenData = jwt.verify(token, secret_key);
    
        if (!tokenData) {
            throw new Error();
        }

        const {id} = tokenData;
        
        const user = await User.findOne({
            id
        })

        if (!user) {
            throw new Error();
        }

        if (user.status === "deleted" || user.status === "inactive") {
            throw new Error();
        }

        const session = await Session.findOne({
            user_id: id,
        });

        if (curr_date - session.exp >= exp_time) {
            throw new Error();
        }
        
        session.exp = curr_date;
        await session.save();
        
        next();
    } catch (err) {
        res.sendStatus(401);
    }
}

function checkUrlMatching(url) {
    const nonTokenizedUrls = ['/users/register', '/users/login'];
    const actualUrl = url.replace('/api', '');
    let hasMatched = false;

    for (const key in nonTokenizedUrls) {
        if (actualUrl === nonTokenizedUrls[key]) {
            hasMatched = true;
            break;
        }
    }

    return hasMatched;
}