import express from "express";
import { loginController } from "../controllers/login.js";
import { userController } from "../controllers/user.js";

export const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
    res.send(await userController.getUsers());
})

userRouter.post("/register", async (req, res) => {
    try {
        await userController.register(req);

        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
})

userRouter.post("/login", async (req, res) => {
    try {
        res.send(await loginController.login(req));
    } catch (e) {
        res.sendStatus(500);
    }
})

userRouter.delete("/:id", async (req, res) => {
    try {
        await userController.deleteUser(req);

        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }

})

userRouter.post("/logout", async (req, res) => {
    try {
        await userController.logout(req);

        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
})