/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
declare namespace google {
  /**
   * Methods available to Google Apps Script
   */
  namespace script {
    /**
     * google.script.run is an asynchronous client-side JavaScript API available in HTML-service pages that can call server-side Apps Script functions.
     */
    type Run<T> = {
      // todo myFunction definition
      /**
       * Sets a callback function to run if the server-side function throws an exception. Without a failure handler, failures are logged to the JavaScript console. To override this, call withFailureHandler(null) or supply a failure handler that does nothing.
       * @param callback a client-side callback function to run if the server-side function throws an exception; the Error object is passed to the function as the first argument, and the user object (if any) is passed as a second argument
       */
      withFailureHandler: (
        callback: (error: Error, object?: unknown) => void
      ) => Run<T> & T
      /**
       * Sets a callback function to run if the server-side function returns successfully.
       * @param callback a client-side callback function to run if the server-side function returns successfully; the server's return value is passed to the function as the first argument, and the user object (if any) is passed as a second argument
       */
      withSuccessHandler: (
        callback: (value: unknown, object?: unknown) => void
      ) => Run<T> & T
      /**
       * Sets an object to pass as a second parameter to the success and failure handlers.
       * @param {Object} object an object to pass as a second parameter to the success and failure handlers; because user objects are not sent to the server, they are not subject to the restrictions on parameters and return values for server calls. User objects cannot, however, be objects constructed with the new operator
       */
      withUserObject: (object: unknown) => void
    }
  }
}
