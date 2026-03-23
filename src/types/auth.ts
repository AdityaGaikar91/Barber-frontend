export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'OWNER' | 'EMPLOYEE' | 'CUSTOMER';
  tenantId: string | null;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}
