export default class ResponseStatusException extends Error {
  constructor(message, status, error) {
    super(message);
    this.statusCode = status;
    this.error = error;
  }
}


export const StatusCode = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
});
