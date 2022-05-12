import jwt from "jsonwebtoken";

class Helper {
    getIdFromToken(req) {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'] || req.body['token'];
        const token  = authHeader && authHeader.split(' ')[1]; 
        const secret_key = process.env.SECRET_KEY;
        const tokenData = jwt.verify(token, secret_key);
        const {id} = tokenData;

        return id;
    }
}

export const helper = new Helper();