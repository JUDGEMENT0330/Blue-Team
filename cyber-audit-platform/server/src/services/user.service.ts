import { User } from '../models/user.model';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

const usersPath = path.join(__dirname, '../data/users.json');

async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(usersPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');
}

export const userService = {
  async findUserByUsername(username: string): Promise<User | undefined> {
    const users = await readUsers();
    return users.find((user) => user.username === username);
  },

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const users = await readUsers();

    if (users.length > 0) {
      throw new Error('An admin user already exists.');
    }

    const hashedPassword = crypto.createHash('sha256').update(userData.password).digest('hex');

    const newUser: User = {
      id: 1,
      username: userData.username,
      password: hashedPassword,
    };

    users.push(newUser);
    await writeUsers(users);
    return newUser;
  },
};
