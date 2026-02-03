export interface UserEnterprise {
  user_id: number;
  enterprise_id: number;
  role_id: number;
  enterprise: Enterprise;
}

export interface Enterprise {
  image_log: number;
  image_fondo: string;
  name: string;
  styles?: EnterpriseStyles;
}

export interface EnterpriseStyles {
  navbar?: {
    bgColor?: string;
    textColor?: string;
    fontSize?: string;
  };
  sidebar?: {
    bgColor?: string;
    textColor?: string;
    activeItemColor?: string;
    hoverColor?: string;
  };
}
