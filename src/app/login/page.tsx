"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // next/routerからの正しいインポート
import { useSession, signIn } from "next-auth/react";
import GetProviders from "@/components/component/GetProvider";
import { IoLogoGithub } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";


export default function Login() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/account");
    }
  }, [router, session]);
  

  async function authenticate(
    prevState: string | undefined,
    formData: FormData
  ): Promise<string | undefined> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/get_customer`
    );
    const customerData = response.data;
    const customer = customerData.customer;

    const { mail, password } = Object.fromEntries(formData);

    try {
      const search = customer.find((c: { mail: unknown }) => c.mail === mail);
      const result = await signIn("credentials", {
        mail,
        password,
        redirect: false,
      });

      if (result) {
        if (result.error && search === undefined) {
          setErrorMessage("アカウントが見つかりませんでした。");
        } else {
          setErrorMessage("パスワードが間違っているか、パスワードが設定されていないアカウントです。\nGitHubまたはGoogleでログインしてください");
        }
      }
    } catch (err) {
      console.log(err);
      if (err instanceof TypeError) {
        if (err.message === "URL constructor: /api/auth is not a valid URL.") {
          console.log("redirect");
        }
      } else {
        return "fail";
      }
    }
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("mail", email);
    formData.append("password", password);
    await authenticate(undefined, formData);
  };

  return (
    <div>
      {!session && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500">
          <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg dark:bg-gray-800">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
              オムそばどん予約システム
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400">
              登録してください
            </p>
            <div className="mt-4 text-center">
              <GetProviders providers="github">
                <IoLogoGithub className="mr-2" />
                Githubでログイン
              </GetProviders>
              <GetProviders providers="google">
                <FcGoogle className="mr-2" />
                Googleでログイン
              </GetProviders>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  className="text-gray-900 dark:text-gray-100"
                  htmlFor="email"
                >
                  Email
                </Label>
                <Input
                  className="w-full"
                  id="email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="text-gray-900 dark:text-gray-100"
                  htmlFor="password"
                >
                  Password
                </Label>
                <Input
                  className="w-full"
                  id="password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errorMessage && (
                <div className="text-red-500">{errorMessage}</div>
              )}

              <Button
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                type="submit"
              >
                Log In
              </Button>
            </form>
            <div className="mt-4 text-center">
              <a href="/register" className="text-gray-600 dark:text-gray-400">
                アカウントを持っていない方はこちら
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
