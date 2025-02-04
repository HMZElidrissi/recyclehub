export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: Date;
  profilePicture?: string;
  role: Role;
  points?: number;
}

export enum Role {
  COLLECTOR = 'collector',
  PARTICULAR = 'particular',
}
