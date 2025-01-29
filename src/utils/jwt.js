const jwt = require('jsonwebtoken');

const createToken = (info) => {
  const data= {
    user_id: info.id,
    username:info.username,
       }
    return jwt.sign(data, process.env.JWT_SECRET);
};
 module.exports={createToken}