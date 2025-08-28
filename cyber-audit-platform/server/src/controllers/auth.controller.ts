import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export const authController = {
  async register(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const existingUser = await userService.findUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      const newUser = await userService.createUser({ username, password });
      res.status(201).json({ message: 'Admin user created successfully', userId: newUser.id });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const user = await userService.findUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      if (user.password !== hashedPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  },
};
