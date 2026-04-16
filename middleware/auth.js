const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const token = req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(401).send("Access denied. No token Provided");
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

        // if(req.user.role != 'admin'){
        //     return res.status(403).send("Access denied: Admin ONLY");
        // }
    }
    catch(ex){
        res.status(401).send("Invalid token");
    }
};