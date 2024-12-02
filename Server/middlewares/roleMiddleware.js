
function authorizeRole(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied: ${roles.join(', ')} only` });
        }
        console.log(`User role authorized: ${req.user.role}`);
        next();
    };
}

module.exports = authorizeRole;
