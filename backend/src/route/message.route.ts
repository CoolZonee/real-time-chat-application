import { Request, Response, Router } from "express";
import { getMessage, sendMessage } from "../controller/message.controller";

const messageRoute = Router();

messageRoute.post("/message", async (req: Request, res: Response) => {
    const { sender, receiver } = req.body;
    const messages = await getMessage(sender, receiver);
    res.status(200).send({
        messages: messages
    });
});

messageRoute.post("/message/send", async (req: Request, res: Response) => {
    const { sender, receiver, text } = req.body;
    const message = await sendMessage(sender, receiver, text);
    res.status(201).send({
        message: "Message sent successfully",
        content: message
    });
})

export default messageRoute;