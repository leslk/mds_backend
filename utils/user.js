const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
const pseudoRegex = /^[a-zA-Z0-9-_]{3,20}$/;
const passwordSchema = require('../services/pwValidator');
const ErrorHandler = require('../models/errorHandler');

async function validatePseudo(pseudo) {
    // Check if pseudo format is valid
    if (!pseudoRegex.test(pseudo)) {
        throw new ErrorHandler(400, "INVALID_PSEUDO");
    }
    // Check if pseudo already exists in db
    const pseudoFindInDb = await User.findOneByPseudo(pseudo);
    if (pseudoFindInDb && pseudoFindInDb.pseudo === pseudo) {
        throw new ErrorHandler(409, "PSEUDO_ALREADY_EXISTS");
    }
}

async function validateEmail(email) {
    // Check if email format is valid
    if (!emailRegex.test(email)) {
        throw new ErrorHandler(400, "INVALID_EMAIL");
    }
    // Check if email already exists in db
    const emailFindInDb = await User.findOneByEmail(email);
    if (emailFindInDb && emailFindInDb.email === email) {
        throw new ErrorHandler(409, "EMAIL_ALREADY_EXISTS");
    }
}

function validatePassword(password) {
    // Check if password format is valid
    const passwordErrors = passwordSchema.validate(password, { details: true});
    if (passwordErrors.length > 0) {
        throw new ErrorHandler(400, "INVALID_PASSWORD");
    }
}

async function hashPassword(password) {
    // Check if hashed password is a success
    const hashedPassword =  await bcrypt.hash(password, 10);
    if (!hashedPassword) {
        throw new ErrorHandler(500, "SERVER_ERROR_WHILE_HASHING_PASSWORD");
    }
    return hashedPassword;
}

async function checkPassword(email, password) {
    const user = await User.findOneByEmail(email);
    if (!user) {
        throw new ErrorHandler(404, "WRONG_EMAIL");
    }
    const passwordValidation = await bcrypt.compare(password, user.password);
    if (!passwordValidation) {
        throw new ErrorHandler(401, "WRONG_PASSWORD");
    }
}

module.exports = {validatePseudo, validateEmail, validatePassword, hashPassword, checkPassword};

