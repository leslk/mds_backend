// Requires
const passwordValidator = require("password-validator");

// set const for new passwordValidator
const passwordSchema = new passwordValidator();

// password schema
passwordSchema
.is().min(8)
.is().max(36)
.has().symbols()
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces();

module.exports = passwordSchema;