export type UserRole = "admin" | "user";
export type UserStatus = "active" | "disabled";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};
