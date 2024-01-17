"use client";
import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { checkEmail } from "@/lib/apidata";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedin = status === "authenticated"; // ログイン状態を確認

  useEffect(() => {
    // ユーザーがログインしている場合のみメールをチェック
    if (isLoggedin) {
      const verifyEmail = async () => {
        try {
          const emailAvailable = await checkEmail(session?.user?.email);
          if (!emailAvailable) {
            router.push("/register");
            console.error("Error checking email:", emailAvailable);
            return;
          } else {
            router.push("/account");
          }
        } catch (error) {
          console.error("Error checking email:", error);
          // エラー処理（必要に応じて）
        }
      };
      verifyEmail();
    }
  }, [session, isLoggedin, router]);

  const Detalis = () => {
    console.log(session);
  };

  return (
    <div className="h-screen">
      {session && (
        <div>
          <h1>ようこそ, {session.user?.email}</h1>
          <p>あなたの名前は{session.user?.name}です</p>
          {session.user?.image && (
            <img src={session.user.image} alt="User Image" />
          )}
          <button onClick={() => Detalis()}>詳細</button>
          <button onClick={() => signOut()}>ログアウト</button>
        </div>
      )}
    </div>
  );
}
