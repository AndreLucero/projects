export class PgsqlError extends Error{
    constructor(msg){
        super(msg);
        this.name = 'PgsqlError'
    }
}

export class PgException extends PgsqlError{
    constructor(msg){
        super(msg);
        this.name = 'PgException';
    }
}

export class PgQueryError extends PgsqlError{
    constructor(msg){
        super(msg);
        this.name = 'PgQueryError';
    }
}

export class PgNoResult extends PgsqlError{
    constructor(msg){
        super(msg);
        this.name = 'PgNoResult';
    }
}