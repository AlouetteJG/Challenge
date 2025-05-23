import { UserRole } from 'src/user/user.entity';

export type UserPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
