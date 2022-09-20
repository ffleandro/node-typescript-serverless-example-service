declare module 'cognito-express' {    
    export class CognitoExpress {
      constructor(options: Options);
      validate(token: string);
    }

    export interface Options {
        region: string
        cognitoUserPoolId: string
        tokenUse: 'access' | 'id'
        tokenExpiration: number
    }

    export default CognitoExpress;
}

declare namespace Express {
    export interface Request {
        token: string
        user: { username: string }
    }
 }
