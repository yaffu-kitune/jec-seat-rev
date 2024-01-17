/* auth.config.ts */
import type { NextAuthConfig } from "next-auth";


//async function checkEmail(email: string): Promise<boolean> {
//  try {
//    const response = await axios.get<ApiResponse>(
//      "http://localhost:8080/get_customer"
//    );
//    const customers = response.data.customer; // ここを 'customers' に修正
//    return (
//      customers?.some((customer: customerInt) => customer.mail === email) ??
//      false
//    );
//  } catch (error) {
//    console.error("APIリクエストでエラー:", error);
//    throw new Error(`APIリクエストエラー: ${error}`);
//  }
//}

export const authConfig = {
  theme: {
    colorScheme: "auto",
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  pages: {
    signIn: "/login", // ← 追加
    error: "/login", // ← 追加
    newUser: "/register", // ← 追加
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/account");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/account", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
