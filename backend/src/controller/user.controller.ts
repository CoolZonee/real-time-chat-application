import { AppDataSource } from "../config/orm.config";
import { User } from "../entity/User.entity";

const userRepository = AppDataSource.getRepository(User)

export const getUserDetails = async (id: string) => {
    const user = await userRepository.findOne({
        where: {
            id: id
        }
    });
    return user;
}