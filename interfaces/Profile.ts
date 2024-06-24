export interface ProfileRequest {
    first_name : string;
    last_name : string;
    phone : string;
    profile_picture : string;
    email:string;
  }

  export interface UpdateProfileRequest {
    phone :string | undefined;
    email:string | undefined;
  }

  export interface ProfileResponse {
    profile_id: number;
    first_name : string;
    last_name : string;
    user_id: number;
    phone : string;
    profile_picture : string;
    email: string;
  }

  export interface User{
    user_id : string;
    dni : string ;
    enterprise_id : number;
    role_id : number;
    userProfile : {
     profile_id: number;
     first_name : string;
     last_name : string;
     email: string ;
     user_id : number;
     phone : string;
     profile_picture : string;
    }
  
  }