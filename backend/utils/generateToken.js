const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'default_jwt_secret_key_for_development';
  return jwt.sign({ id }, secret, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
