const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.log('authenticateJWT middleware invoked');
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        console.log(`Authenticated user: ${JSON.stringify(req.user)}`);
        next();
    } catch (error) {
        console.error('Authorization header missing.');
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;
