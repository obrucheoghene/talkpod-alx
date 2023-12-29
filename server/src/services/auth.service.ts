import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import DB from "../lib/db"
import { createRoom } from "./room.service";
import { SignInData, SignUpData, User } from "../interfaces/services";



export const signUp = async (data: SignUpData): Promise<User | null> => {
    try {
        const { name, email, password } = data;

        const foundUser = await DB.user.findFirst({
            where: {
                email: email
            }
        });

        if (foundUser) {
            return null;
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await DB.user.create({
            data: {
                name: name,
                email: email,
                password: hashPassword
            }
        });


        // Create default Home room for new user
        await createRoom({
            userId: user.id,
            name: 'Home Room'
        })
        return {
            data: user,
            token: jwt.sign({
                name: user.name,
                email: user.email
            }, process.env.JWT_SECRET || "invalid_hash")
        }
    } catch (error) {
        console.log("signUp", error)
        return null;
    }
}


export const signIn = async (data: SignInData): Promise<User | null> => {
    try {
        const { email, password } = data;
        const user = await DB.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            return null;
        } else {
            const hash = user.password;
            if (await bcrypt.compare(password, hash)) {
                return {
                    data: user,
                    token: jwt.sign({
                        name: user.name,
                        email: user.email
                    }, process.env.JWT_SECRET || "invalid_hash")
                }
            } else {
                return null;
            }
        }
    } catch (error) {
        console.log("signIn", error)
        throw error
    }
}
