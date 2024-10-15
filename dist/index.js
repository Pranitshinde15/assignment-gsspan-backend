"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 8080;
// Define the secret key (in a real app, store this in env variables)
const SECRET_KEY = 'your-secret-key';
// Login route for generating the JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Dummy authentication check (replace with actual auth logic)
    if (username === 'user' && password === 'password') {
        // Create payload with user information
        const payload = {
            username,
        };
        // Sign the token (expires in 1 hour)
        const token = jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        res.json({
            message: 'Login successful',
            token,
        });
    }
    else {
        res.status(401).json({
            message: 'Invalid credentials',
        });
    }
});
// Middleware to validate the token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({
            message: 'No token provided',
        });
    }
    // Verify the token
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid token',
            });
        }
        // Attach user info to request object for further use
        req.user = user;
        next();
    });
};
// Protected route (only accessible with valid token)
app.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'This is a protected route',
        user: req.user,
    });
});
// Start the server
app.listen(port, () => {
    console.log('Server running on port', port);
});
