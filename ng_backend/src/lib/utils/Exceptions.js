export class GenericException extends Error{
    constructor(msg){
        super(msg);
        this.name = 'GenericException';
    }
}



/*
    ******************************************
    ************* Http Excepciones ***********
    ******************************************
*/
export class HttpException extends Error{

    constructor(msg){
        super(msg);
        this.name = 'HttpException';
    }
}

export class BadRequestException extends HttpException{
    constructor(msg){
        super(msg);
        this.name = 'BadRequestException';
    }
}
export class NotFoundException extends HttpException{
    constructor(msg){
        super(msg);
        this.name = 'NotFoundException';
    }
}

export class UnauthorizedException extends HttpException{
    constructor(msg){
        super(msg);
        this.name = 'UnauthorizedException';
    }
}

export class ForbiddenException extends HttpException{
    constructor(msg){
        super(msg);
        this.name = 'ForbiddenException';
    }
}
