import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const app = express();
app.use(express.json());
const port = 8080;

const SECRET_KEY = 'ffefwfewfef';

interface UserPayload extends JwtPayload {
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

app.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === 'user' && password === 'password') {
        const payload: UserPayload = {
            username,
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
        });
    } else {
        res.status(401).json({
            message: 'Invalid credentials',
        });
    }
});

const authenticateToken: any = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({
            message: 'No token provided',
        });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid token',
            });
        }

        req.user = user as UserPayload;
        next();
    });
};

app.get('/protected', authenticateToken, (req: Request, res: Response) => {
    res.json({
        message: 'This is a protected route',
        user: req.user,
    });
});

app.listen(port, () => {
    console.log('Server running on port', port);
});
