
export class GenesysCloudException extends Error{
    constructor(status, msg){
        super(msg);
        this.status = status;
        this.name = 'GenesysCloudException';
    }
}