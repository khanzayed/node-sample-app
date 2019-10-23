const sql = require('../connection')
const jwt = require('jsonwebtoken')
const validator = require('validator')

class User {

    constructor(value) {
        this.name = value.name,
        this.email = value.email,
        this.age = value.age,
        this.password = value.password
        this.phoneNumber = value.phoneNumber
    }

    validateData() {
        const object = this
        return new Promise(function(resolve, reject) {
            if (object.name.length === 0) {
                return reject('Name cannot be blank!')
            }
    
            if (typeof object.age != 'number') {
                return reject('Age can only be integer!')
            }
    
            if (!validator.isEmail(object.email)) {
                return reject('Invalid email id!')
            }
    
            if (object.phoneNumber) {
                let phoneno = /^\d{10}$/;
                if (!object.phoneNumber.match(phoneno)) {
                    return reject('Invalid phone number!')
                }
            }

            resolve()
        })
    }

    generateToken() {
        this.token = jwt.sign({ _id: this.email }, 'mysampleapplication', { expiresIn: '7 days' });
    }

    checkIfAlreadyExist() {
        const object = this
        return new Promise(function(resolve, reject) { 
            let fetchQuery = "SELECT `_id` FROM `user` WHERE `user`.`email` = ? AND `is_deleted` = 0"
            sql.query(fetchQuery, object.email, function (error, result) {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }

    static getUserByEmailAndPassword(email, password) {
        return new Promise(function(resolve, reject) { 
            let fetchQuery = "SELECT * FROM `user` WHERE `email` = ? AND `password` = ? AND `is_deleted` = 0"
            let values = [email, password]
            sql.query(fetchQuery, values, function (error, result) {
                if (error) {
                    reject(error)
                } else {
                    if (result.length === 0) {
                        reject(new Error('Unable to find the account with the entered credentials!'))
                    } else {   
                        resolve(new User(result[0]))
                    }
                }
            })
        })  
    }

    static getUserByEmail(email) {
        return new Promise(function(resolve, reject) { 
            let fetchQuery = "SELECT * FROM `user` WHERE `email` = ? AND `is_deleted` = 0"
            sql.query(fetchQuery, [email], function (error, result) {
                if (error) {
                    reject(error)
                } else {
                    if (result.length === 0) {
                        reject(new Error('Unable to find the account with the entered credentials!'))
                    } else {   
                        resolve(new User(result[0]))
                    }
                }
            })
        })  
    }

    save() {
        const object = this
        return new Promise(function(resolve, reject) { 
            let insertQuery = "INSERT INTO `user` (`name`, `email`, `age`, `password`, `phone_number`, `token`) VALUES (?)"
            let values = [[object.name, object.email, object.age, object.password, object.phoneNumber, object.token]]
            sql.query(insertQuery, values, function (error, result) {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.insertId)
                }
            })
        })
    }

    toJSON() {
        const userObject = this
        delete userObject.token
        delete userObject.password

        return userObject
    }

}

module.exports = User;