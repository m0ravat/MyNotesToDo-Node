// cookies.js
const express = require('express');
const router = express.Router();

router.get("/set-cookies", (req, res) => {
  res.cookie("newUser", false);
  res.cookie("isEmployee1", true, { maxAge: 10000 });
  res.cookie("isEmployee2", false, { maxAge: 10000, secure: true });
  res.cookie("isEmployee3", false, { maxAge: 10000, httpOnly: true });
  res.send("you got the cookies");
});

router.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);
  res.json(cookies);
});

module.exports = router;
