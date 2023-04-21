import { Request, Response, Router } from "express";
import { signUp } from "../controller/auth.controller";

const authRoute = Router();

// authRoute.post("/login", async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     await login
// })

authRoute.post('/sign-up', async (req: Request, res: Response) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
        const user = await signUp(email, password);
        res.status(201).send({
            message: "User created successfully",
            user: user
        });
    }
    catch (err) {
        res.status(500).send({
            message: "User creation failed",
            error: err
        });
    }
});

export default authRoute;