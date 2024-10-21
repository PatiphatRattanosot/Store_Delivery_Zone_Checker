const Store = require("../models/store.model");
const User = require("../models/user.model");
const { Op } = require("sequelize");


exports.create = async (req, res) => {

  const { storeName, address, lat, long, deliveryRadius, userId } = req.body;

  if (!storeName || !address || !lat || !long || !deliveryRadius || !userId) {
    res.status(400).send({
      message: "Content can not be empty!",
    });

    return;
  }
  await Store.findOne({
    where: {
      storeName: storeName,
    },
  }).then((store) => {
    if (store) {
      res.status(400).send({
        message: "Store name already exists!",
      });
      return;
    }
  });
  const newStore = {
    storeName,
    address,
    lat,
    long,
    daliveryRadius: deliveryRadius,
    userId,
  };
  await Store.create(newStore)
    .then((store) => {
      res.send({ message: "Store was created successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Store.",
      });
    });
};

//fatch all
exports.getAll = async (req, res) => {
  await Store.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving stores.",
      });
    });
};

//fatch one
exports.getById = async (req, res) => {
  const id = req.params.id;
  await Store.findByPk(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find Store with id=${id}`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Store with id=" + id,
      });
    });
};

//update
exports.update = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);

  await Store.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Store was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Store with id=${id}. Maybe Store was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Store with id=" + id,
      });
    });
};

//delete
exports.delete = async (req, res) => {
  const id = req.params.id;
  await Store.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Store was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Store with id=${id}. Maybe Store was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Store with id=" + id,
      });
    });
};
