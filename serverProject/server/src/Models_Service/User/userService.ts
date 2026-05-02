import {User} from "./userModel";
import {IUser} from "./userModel";
import {logger} from "../../Utils/Logger";

export class UserService {
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        try {
            const user = new User(userData);
            await user.save();
            logger.info(`User created with username: ${user.name}`);
            return user;
        } catch (error) {
            logger.error(`Error creating user: ${error}`);
            throw error;
        }
    }

    async getUserByUsername(username: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ username });
            if (user) {
                logger.info(`User retrieved with username: ${username}`);
                return user;
            } else {
                logger.warn(`User not found with username: ${username}`);
                return null;
            }
        } catch (error) {
            logger.error(`Error retrieving user with username ${username}: ${error}`);
            throw error;
        }
    }
}