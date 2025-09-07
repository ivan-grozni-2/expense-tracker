const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.status(401).json({error: "no token, access denied"});
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();

    }catch(err){
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
          }
        return res.status(403).json({error: "warning, invalid token, access denied"});

    }
}

module.exports = authMiddleware;