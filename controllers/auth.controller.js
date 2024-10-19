const config = require("../config/auth.config");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const Role = db.Role;
const User = db.User;

//register
exports.signup = async (req, res) => {
  const { username, password, email, address, lat, long } = req.body;

  const newUser = {
    username,
    password: bcrypt.hashSync(password, 8),
    email,
    address,
    lat,
    long,
  };

  await User.create(newUser).then((user) => {
    if (req.body.roles) {
      Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      }).then((roles) => {
        user.setRoles(roles).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      });
    } else {
      user.setRoles([1]).then(() => {
        res.send({ message: "User was registered successfully!" });
      });
    }
  }).catch((err) => {
    res.status(500).send({ message: err.message || "Some error occurred while creating the User." });
  });
};

//signin
exports.signin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: "Please enter username or password" });
  }

  await User.findOne({
    where: {
      username: username,
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });
    //add role
    const authorities = [];
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
  }).catch((err) => {
    res.status(500).send({ message: err.message });
  });
};