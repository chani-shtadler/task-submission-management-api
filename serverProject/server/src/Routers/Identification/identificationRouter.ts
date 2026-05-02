import express, { Request, Response, Router } from 'express';
import { validateRegistration } from '../../Middlewares/userValidation';
import { logger } from '../../Utils/Logger';
import { UserService } from '../../Models_Service/User/userService';
import { User, IUser } from '../../Models_Service/User/userModel'; 
import { AuthService } from '../../Utils/Authentication';

const userService = new UserService();
const authService = new AuthService();

export const indetificationRouter: Router = express.Router();


indetificationRouter.post('/register', validateRegistration, async (req: Request, res: Response) => {
    const userData = req.body as IUser; 
    try {
        await userService.createUser(userData);
        logger.info(`User ${userData._id} registered successfully`);
        res.status(201).json({ message: `User ${userData._id} registered successfully` });
    }
    catch (err) {
        logger.error(`Error registering user: ${err}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


indetificationRouter.post('/login', async (req: Request, res: Response) => {
    const { _id, password } = req.body;

    try {
        
        const user = await User.findOne({ _id });

        
        if (!user || user.password !== password) {
            logger.warn(`Authentication failed for user ${_id}: Invalid ID or password`);
            return res.status(401).json({ error: 'Invalid ID or password' });
        }
        console.log(`DEBUG: Creating token for user: ${user._id}, with role: ${user.role}`);

        const token = authService.generateToken(user._id, user.role);

        logger.info(`User ${_id} logged in successfully with role: ${user.role}`);
        
       
        res.status(200).json({ 
            message: "Login successful",
            token,
            role: user.role 
        });

    } catch (err) {
        logger.error(`Error during login for user ${_id}: ${err}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});