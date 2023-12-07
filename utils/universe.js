const universeNameRegex = /\S/;
exports.validateUniverseName = (universeName) => {
    if (universeName.length === 0 || !universeNameRegex.test(universeName)) {
        throw {
            status: 400,
            message: "INVALID_UNIVERSE_NAME"
        };
    }
    if (universeName.length > 50) {
        throw {
            status: 400,
            message: "UNIVERSE_NAME_TOO_LONG"
        };
    }
}