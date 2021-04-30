class ErrorResponse extends Error {
    constructor(message, solution = 'unknown') {
        let errResponse = message + '\nSolution: ' + solution
        super(errResponse)
        this.stack = ''
    }
}

module.exports = ErrorResponse
