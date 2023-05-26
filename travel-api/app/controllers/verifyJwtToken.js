require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

exports.verifyToken = async (req, res, next, role = 1) => {
  const tokenHeader = req.headers.authorization || false;

  if (!tokenHeader) {
    res.status(500).send({
      request_status: false,
      message: 'Unauthorized.',
    });
    return;
  }

  const token = tokenHeader.split(' ')[1];

  let userId;

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.status(500).send({
        request_status: false,
        message: err.message,
      });
      return;
    }
    console.log('>> Token terautentikasi.');
    userId = decoded.id;
  });

  const getUser = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (getUser.RoleId >= role) {
    console.log('>> Role terpenuhi.');
    next(req, res);
  } else {
    res.status(500).send({
      request_status: false,
      message: 'Role anda tidak cukup untuk melakukan aksi.',
    });
    return;
  }
};
