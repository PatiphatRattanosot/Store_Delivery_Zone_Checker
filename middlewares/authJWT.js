const jwt = require("jsonwebtoken");
const db = require("../models");
const config = require('../config/auth.config');

const User = db.User

//vertify token
vertifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;

        next();
    });
}


//check Role Admin
isAdmin = async (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Require Admin Role!"
            });
            return;
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
        return;
    });
}


const authJwt = {
    vertifyToken,
    isAdmin
}

module.exports = authJwt;