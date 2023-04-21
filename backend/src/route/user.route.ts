import { Request, Response, Router } from "express";
import { getUserDetails } from "../controller/user.controller";

const userRoute = Router();

userRoute.get("/user/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const user = await getUserDetails(id);
        res.status(200).send({
            message: "User details",
            user: user
        });
    }
    catch (err) {
        res.status(404).send({
            message: "User not found",
            error: err
        });
    }

});

export default userRoute;