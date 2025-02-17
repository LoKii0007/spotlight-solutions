import "next-auth";
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface User {
    id?: string;
    emailVerified?: boolean;
  }

  interface Session {
    user: {
      id?: string;
      emailVerified?: boolean;
    } & DefaultSession['user']
    // default session matlab usme ek key aegi hi aegi given name ki jaise ki user

  }
}

// declare module "next-auth/jwt" {
//   interface JWT {
//     _id?: string;
//     emailVerified?: boolean;
//   }
// }
