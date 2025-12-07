

type PathAppInfo = `/${string}`;

export interface AppInformation{
    path: PathAppInfo;
    srcImage: string;
    appName?: string;
    loginRequired?: boolean;

}