/**
 * This will be the standard JSON response for the API
 */
class Response {
  /**
   * Constructs the JOSN response given the err or the payload either may be
   * null but not both. Does not check the case of both having data err will
   * take precedence in the success flag
   * @param {Any} err     Error message to deliver to the user,
   *                      If it is an object must define a message prop
   * @param {Any} payload Data that will be transfered to the client
   *
   * @throws If both parameters are null then an error will be thrown
   */
  constructor(err, payload) {
    if (!err && ! payload) {
      throw (new Error('Expected err or payload'));
    }

    // Set success flag based on pressence of error
    this.success = err ? false : true;

    // err will be set as a string or value given by user
    // (if is an Error object then get the message)
    if (err && typeof (err) === 'object') {
      this.err = err.message;
      if (err.message === undefined || typeof (err.message) !== 'string') {
        throw (new Error(`If error is an object must be derived from Error`));
      }
    } else {
      this.err = err ? err : null;
    }

    // Payload will be the data given by user
    // (if is object it will be unpacked)
    if (typeof (payload) === 'object') {
      this.payload = (payload) ? Object.assign({}, payload) : null;
    } else {
      this.payload = payload ? payload : null;
    }
  }
}

module.exports = Response;
