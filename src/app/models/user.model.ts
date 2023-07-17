export interface UserModel {


    id :number;
    firstName : string;
    lastName? : string;
    email : string;
    
    password : string;
    confirmPassword?:string;
    isTempPassword? : boolean;
    isFirstTimeVendorLogin? : boolean;
    oldVendor_Id :string;
    accountTypeId? :number;
    accountType : string;
    accountNumber :string;
    isActive : boolean;
    sendWelcomeEmail?:boolean
    userGroups?:string;
}
