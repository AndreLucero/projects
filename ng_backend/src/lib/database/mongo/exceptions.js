export class MongoError extends Error{
    constructor(msg){
        super(msg);
        this.name = 'MongoError'
    }
}

export class MongoValidationError extends MongoError{
    constructor(msg){
        super(msg);
        this.name = 'MongoValidationError';
    }
}

export class MongoConnectionError extends MongoError{
    constructor(msg){
        super(msg);
        this.name = 'MongoConnectionError';
    }
}

export class MongoDocumentError extends MongoError{
    constructor(msg){
        super(msg);
        this.name = 'MongoDocumentError';
    }
}