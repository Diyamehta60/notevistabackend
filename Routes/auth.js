const express = require("express");
const router = express.Router();
const {login, createUser} = require("../Controllers/auth");


router.route("/register").post(createUser);
router.route("/login").post(login);



module.exports = router;