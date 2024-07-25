class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
class RequestError extends MyError {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationError extends RequestError {
  constructor(joiValidationError) {
    super(joiValidationError.details.map((err) => err.message).join('\n'));
  }
}

class ResourceNotFound extends RequestError {
  constructor(message) {
    super(message);
  }
}

class InternalError extends MyError {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class DBOperationError extends RequestError {
  constructor(message) {
    super(message);
  }
}

module.exports = { RequestError, ValidationError, ResourceNotFound, InternalError, DBOperationError };
