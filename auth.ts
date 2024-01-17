import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  
  providers: [
    GitHub,
    Google,
    CredentialsProvider({
      credentials: {
        mail: {
          name: "mail",
          label: "メールアドレス",
          type: "email",
          placeholder: "メールアドレス",
        },
        password: { name: "password", label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("credentials", credentials);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/get_customer`
          );
          const customerData = response.data;

          // 顧客データが存在し、少なくとも1つの顧客がいることを確認
          if (customerData.customer && customerData.customer.length > 0) {
            // 提供されたメールアドレスに一致する顧客を検索
            const customer = customerData.customer.find(
              (c: { mail: unknown }) => c.mail === credentials.mail
            );

            // 一致する顧客が見つかった場合
            if (customer.password) {
              const hashedPassword = customer.password; // ハッシュされたパスワード
              const password = credentials.password;

              // パスワードを比較
              const isPasswordCorrect = await bcrypt.compare(
                `${password}`,
                hashedPassword
              );

              console.log("isPasswordCorrect", isPasswordCorrect);
              console.log("hashedPassword", hashedPassword);

              if (isPasswordCorrect) {
                return {
                  id: customer.id,
                  mail: customer.mail,
                  name: customer.name,
                };
              } else {
                throw new Error("パスワードが一致しません");
              }
            } else {
              throw new Error(
                "パスワードが設定されていないアカウントです。GitHubかGoogleでログインしてください"
              );
            }
          }
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  
});
