class ErrorHandler {
    constructor(status, message) {
      this.status = status;
      this.message = message;
    }
  
    handleErrorResponse(res) {
      return res.status(this.status).json({
        error: {
          status: this.status,
          message: this.message,
        },
      });
    }
  }

module.exports = ErrorHandler;