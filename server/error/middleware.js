
import { config } from "dotenv";
import { Unauthorized } from "./error.js"
import jwt from 'jsonwebtoken';
config();

export default async function authorizeMiddleWare(req, res, next) {
    
    // TODO, create an API ending point to check for the current 
    // token if it's valid and extend the same time period.
    const AuthorizedHeaders = req.body.headers.Authorization;

    if (!AuthorizedHeaders || !AuthorizedHeaders.startsWith('Bearer ')){
        throw new Unauthorized('Invalid credentials.');
    }
    
    const token = AuthorizedHeaders.split(' ')[1];
    
    try {
    
        const authenticate = jwt.verify(token, process.env.JWT_SECRET);
    
        req.user = { userId: authenticate.userID, name: authenticate.name };
        next();
    
    } catch (error) {
    
        throw new Unauthorized('Did not verify token.');
    }
}