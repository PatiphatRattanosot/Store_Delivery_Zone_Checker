const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/store.controller");
const { authJWT, vertifyStore } = require('../middlewares/index')



//Create New Store
router.post("/", [authJWT.vertifyToken, vertifyStore.checkStoreName, authJWT.isAdmin], StoreController.create)

//Get All Stores
router.get("/", StoreController.getAll)

//Get Store By Id
router.get(("/:id"), [authJWT.vertifyToken], StoreController.getById)

//Update Store By Id
router.put(("/:id"), [authJWT.vertifyToken, authJWT.isAdmin], StoreController.update)

//Delete Store By Id
router.delete(("/:id"), [authJWT.vertifyToken, authJWT.isAdmin], StoreController.delete)

module.exports = router;