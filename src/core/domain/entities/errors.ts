/**
 * Base class for all custom application errors.
 */
export class AppError extends Error {
    constructor(message: string) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AppError.prototype);
        this.name = this.constructor.name;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Error thrown when a JSON response from an API cannot be parsed.
 */
export class JsonParseError extends AppError {
    public rawText: string;

    constructor(message: string, rawText: string) {
        super(message);
        Object.setPrototypeOf(this, JsonParseError.prototype);
        this.rawText = rawText;
    }
}
