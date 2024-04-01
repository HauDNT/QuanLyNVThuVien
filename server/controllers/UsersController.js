const {Users} = require('../models');       
const bcrypt = require('bcrypt');           // Using Bcrypt to hash and check password
const {sign} = require('jsonwebtoken');     // Using Json Web Token

class UsersController {
    async register(req, res) {
        try {
            const {username, password} = req.body;
            const hash = await bcrypt.hash(password, 10);

            const newUser = Users.create({
                Username: username,     // Các trường được gán phải giống như models
                Password: hash,
            });

            return res.send(newUser);
        } catch (errorMessage) {
            return res.json({error: 'Error from server. Try again later!'});
        }
    } 
}

module.exports = new UsersController();