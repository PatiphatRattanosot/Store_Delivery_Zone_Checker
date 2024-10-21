const Store = require('../models/store.model');

// middleware check Store name
checkStoreName = async (req, res, next) => {
    const { storeName } = req.body;
    await Store.findOne(
        {
            where: { storeName }
        }).
        then((store) => {
            if (store) {
                res.status(400).send({
                    message: 'Failed! Store name is already in use!'
                });
                return;
            }
            next();
        });
}

const vertifySignUp = {
    checkStoreName
}

module.exports = vertifySignUp;