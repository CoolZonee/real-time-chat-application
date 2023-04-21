import { AppDataSource } from "../config/orm.config";
import { Message } from "../entity/Message.entity";
import { User } from "../entity/User.entity";

const messageRepository = AppDataSource.getRepository(Message);
const userRepository = AppDataSource.getRepository(User);

export const getMessage = async (sender: string, receiver: string) => {
    const messages = await messageRepository.find({
        where: [{
            sender: {
                id: sender
            },
            receiver: {
                id: receiver
            }
        }, {
            sender: {
                id: receiver
            },
            receiver: {
                id: sender
            }
        }],
        order: {
            createdAt: "ASC"
        }
    });
    return messages.map(message => {
        return {
            id: message.id,
            sender: message.sender.id,
            receiver: message.receiver.id,
            text: message.text,
        }
    });
}

export const sendMessage = async (sender: string, receiver: string, text: string) => {
    const message = new Message();

    const s = await userRepository.findOne({
        where: {
            id: sender
        }
    });

    const r = await userRepository.findOne({
        where: {
            id: receiver
        }
    });

    if (!s || !r) {
        throw new Error("User not found");
    }

    message.sender = s;
    message.receiver = r;
    message.text = text;
    await messageRepository.save(message);
    return message;
}