const User = require('../models/user.model');
const Role = require('../models/role.model');
const { Op } = require('sequelize');

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const { username, email } = req.body;
    await User.findOne(
        {
            where: {
                [Op.or]: { username }
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: 'Failed! Username is already in use!'
                });
                return;
            }
        });
    //check email
    await User.findOne(
        {
            where: { email }
        }).then((user) => {
            if (user) {
                res.status(400).send({
                    message: 'Failed! Email is already in use!'
                });
                return;
            }
            next();
        });

}

//check roles are valid
checkRolesExisted = async (req, res, next) => {
    const { roles } = req.body;
    if (roles) {
        Role.findAll({
            where: {
                name: {
                    [Op.or]: roles
                }
            }
        }).then((rolrs) => {
            if (roles.length !== rolrs.length) {
                res.status(400).send({
                    message: 'Failed! Role does not exist = ' + roles
                });
                return;
            }
            next();
        })
    } else {
        next();
    }
}

const vertifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
}

module.exports = vertifySignUp;

