export class ServiceException extends Error {
  public statusCode: number
  public errorCode: string

  constructor (message: string, statusCode: number = 500, errorCode: string = 'SERVICE_EXCEPTION') {
    super(message) // Call the parent constructor with the error message
    this.name = this.constructor.name // Set the error name to the class name
    this.statusCode = statusCode // Set the HTTP status code
    this.errorCode = errorCode // Set a custom error code

    // Ensure the name of this error class is set to `ServiceException` in the stack trace
    Object.setPrototypeOf(this, ServiceException.prototype)
  }
}
