export interface UserModel {


    id: number;
    firstName: string;
    lastName?: string;
    email: string;

    password: string;
    confirmPassword?: string;
    isTempPassword?: boolean;
    isFirstTimeVendorLogin?: boolean;
    jdeNumber?: string;
    oldVendor_Id: string;
    accountTypeId?: number;
    accountType: string;
    accountNumber: string;
    isActive: boolean;
    sendWelcomeEmail?: boolean
    userGroups?: string;
    phoneNo?: string;

    authenticationType?: number;
    accountIds: any;
    userTypeIds: any;
}
