import { User } from "../modules/users/userModel";
import bcrypt from "bcryptjs";

export const makAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("12345678", 10);

      await User.create({
        name: " Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log(" admin account created:");
      console.log("   Email: admin@example.com");
      console.log("   Password: 12345678");
    } else {
      console.log("ℹ Admin account already exists");
    }
  } catch (error) {
    console.error(" Error creating admin:", error);
  }
};
