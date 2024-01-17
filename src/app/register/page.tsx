"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { checkEmail, postCustomerData } from "@/lib/apidata";
import { useSession, signOut } from "next-auth/react";

export default function Register() {
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoggedin = !!session; // セッションがあるかどうかの真偽値

  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const submitData = session
      ? {
          name: formData.name,
          mail: session.user?.email, // セッションが true の場合は空に設定
          phone: formData.phone,
        }
      : formData; // セッションが false の場合はフォームデータをそのまま使用

    try {
      // セッションがない場合のみメールアドレスのチェックを行う
      const emailAvailable = await checkEmail(formData.mail);
      const phoneAvailable = await checkEmail(formData.phone);
      const sessionEmailAvailable = await checkEmail(session?.user?.email);
      if (emailAvailable || phoneAvailable || sessionEmailAvailable) {
        setErrorMessage("このメールアドレスは既に使用されています。");
        return;
      }

      // パスワードの一致確認
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("パスワードが一致しません。");
        return;
      }

      // APIリクエスト

      const response = await postCustomerData(submitData);
      console.log(response);
      if (response) {
        setIsRegistrationComplete(true);
      }
    } catch (error) {
      setErrorMessage("登録中にエラーが発生しました。");
    }
    console.log("Form Data:", JSON.stringify(submitData, null, 2));
    // ここでフォームデータの送信やその他の処理を行います
  };
  const handleDialogClose = () => {
    console.log(router); // Add this line to check the router instance
    router.push("/login");
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const emailAvailable = await checkEmail(session?.user?.mail);
        if (!isLoggedin) {
          if (!emailAvailable) {
            router.push("/register");
            return;
          }
          router.push("/account");
          
        }
      } catch (error) {
        console.error("Error checking email:", error);
        // エラー処理（必要に応じて）
      }
    };

    verifyEmail();
  }, [formData.mail, isLoggedin, router, session, status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          オムそばどん予約システム
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          {session
            ? "外部アカウントの登録をしてください"
            : "新しくアカウントを作成してください"}
        </p>

        <Dialog open={isRegistrationComplete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>登録完了</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              登録が完了しました。ログインページへ移動します。
            </DialogDescription>
            <DialogFooter>
              <Button onClick={handleDialogClose}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-900 dark:text-gray-100" htmlFor="name">
              名前
            </Label>
            <Input
              className="w-full"
              id="name"
              name="name"
              type="text"
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900 dark:text-gray-100" htmlFor="email">
              メールアドレス
            </Label>
            <Input
              className="w-full"
              id="mail"
              name="mail"
              type="email"
              onChange={handleChange}
              value={
                isLoggedin ? (session?.user?.email as string) : formData.mail
              } // セッションがある場合はメールアドレスを表示
              required
              disabled={isLoggedin} // セッションがある場合は無効化
            />
          </div>

          <div className="space-y-2">
            <Label
              className="text-gray-900 dark:text-gray-100"
              htmlFor="password"
            >
              電話番号
            </Label>
            <Input
              className="w-full"
              id="phone"
              name="phone"
              type="text"
              onChange={handleChange}
              required
            />
          </div>
          {!isLoggedin && (
            <>
              <div className="space-y-2">
                <Label
                  className="text-gray-900 dark:text-gray-100"
                  htmlFor="password"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="パスワード"
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="text-gray-900 dark:text-gray-100"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="パスワードの再入力"
                />
              </div>
            </>
          )}

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
            type="submit"
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-gray-600 dark:text-gray-400">
            既にアカウントをお持ちの方は
          </a>
        </div>
        {isLoggedin && (
          <>
            <div className="w-full flex justify-end">
              <Button
                className=" bg-white hover:bg-white hover:underline text-black"
                /* サインアウト後/loginにリダイレクト*/
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign Out
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
