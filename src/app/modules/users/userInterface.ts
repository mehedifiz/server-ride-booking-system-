export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "rider" | "driver";
  isBlocked: boolean;
  createdAt: Date;
}
