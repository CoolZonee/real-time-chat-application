import { AppDataSource } from "../config/orm.config";
import { User } from "../entity/User.entity";

const userRepository = AppDataSource.getRepository(User)

export const signUp = async (email: string, password: string) => {
    const user = new User();
    user.email = email;
    user.password = password;
    return await userRepository.save(user);
}