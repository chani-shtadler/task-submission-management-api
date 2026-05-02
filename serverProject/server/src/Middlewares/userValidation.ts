//router.get("login", userValidation, (req, res) => {})

import { Request, Response, NextFunction } from "express";
import { User } from "../Models_Service/User/userModel";

export const validateRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id, password, name, email, role } = req.body;

        if (!_id || !password || !name) {
            return res.status(400).json({ 
                error: 'Missing required fields: _id, name, password',
                received: req.body
            });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters and include letters and numbers.' });
        }

        const existing = await User.findOne({ _id }).lean();
        if (existing) {
            return res.status(400).json({ error: 'ID already in use' });
        }
        
        next();
    } catch (err) {
        next(err);
    }
};