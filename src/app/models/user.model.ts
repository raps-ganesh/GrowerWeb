export interface UserModel {


    Id :number;
    FirstName : string;
    LastName? : string;
    Email : string;
    
    Password : string;
    ConfirmPassword?:string;
    IsTempPassword? : boolean;
    IsFirstTimeVendorLogin? : boolean;
    OldVendor_Id :string;
    AccountTypeId? :number;
    AccountType : string;
    AccountNumber :string;
    IsActive : boolean;
    SendWelcomeEmail?:boolean
}
