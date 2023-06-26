class DuplicateUsernameError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DuplicateUsernameError';
        this.status = 422;
    }
}

class DoesNotExistError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DoesNotExistError';
        this.status = 404;
    }
}

class UserDoesNotExistError extends DoesNotExistError {
    constructor(message) {
        super(message);
        this.name = 'UserDoesNotExistError';
    }
}

class ReceiptDoesNotExistError extends DoesNotExistError {
    constructor(message) {
        super(message);
        this.name = 'ReceiptDoesNotExistError';
    }
}

class UserReceiptArrayUpdateFailureError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserReceiptArrayUpdateFailureError';
        this.status = 400;
    }
}

class AuthenticationFailureError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationFailureError';
        this.status = 401;
    }
}

class PasswordAuthenticationFailureError extends AuthenticationFailureError {
    constructor(message) {
        super(message);
        this.name = 'PasswordAuthenticationFailureError';
    }
}

class JWTAuthenticationFailureError extends AuthenticationFailureError {
    constructor(message) {
        super(message);
        this.name = 'JWTAuthenticationFailureError';
    }
}

class V4SignedURLUnavailableError extends Error {
    constructor(message) {
        super(message);
        this.name = 'V4SignedURLUnavailableError';
        this.status = 422;
    }
}

class FileDoesNotExistError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileDoesNotExistError';
        this.status = 404;
    }
}

class CloudStorageFileDoesNotExistError extends FileDoesNotExistError {
    constructor(message) {
        super(message);
        this.name = 'CloudStorageFileDoesNotExistError';
        this.status = 404;
    }
}

class LocalStorageFileDoesNotExistError extends FileDoesNotExistError {
    constructor(message) {
        super(message);
        this.name = 'LocalStorageFileDoesNotExistError';
        this.status = 404;
    }
}

module.exports = {DuplicateUsernameError, UserDoesNotExistError, ReceiptDoesNotExistError, UserReceiptArrayUpdateFailureError, AuthenticationFailureError, PasswordAuthenticationFailureError, 
    JWTAuthenticationFailureError, V4SignedURLUnavailableError, CloudStorageFileDoesNotExistError, LocalStorageFileDoesNotExistError};