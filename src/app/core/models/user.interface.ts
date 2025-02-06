export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: Date;
  address: string;
  profilePicture?: string;
  role: Role;
  points?: number;
}

export enum Role {
  COLLECTOR = 'collector',
  PARTICULAR = 'particular',
}
