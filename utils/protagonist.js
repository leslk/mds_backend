const universeNameRegex = /\S/;
exports.validateProtagonistName = (ProtagonistName) => {
    if (ProtagonistName.length === 0 || !universeNameRegex.test(ProtagonistName)) {
        throw {
            status: 400,
            message: "INVALID_PROTAGONIST_NAME"
        };
    }
    if (ProtagonistName.length > 50) {
        throw {
            status: 400,
            message: "PROTAGONIST_NAME_TOO_LONG"
        };
    }
}