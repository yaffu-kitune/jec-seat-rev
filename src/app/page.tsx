"use client";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Classroom from "@/components/classroom/classroom";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const name = "芦沢";
  return (
    <div>
      <main className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-[90%] p-24 space-y-10">
          <header>
            {/* login button */}
            <div className="flex justify-end gap-10">
              {session ? (
                <>
                  <p>{session.user?.name}さん、こんにちは</p>
                  <Button onClick={() => signOut()}>ログアウト</Button>
                </>
              ) : (
                <>
                  <Button>
                    <a href="/api/auth/signin">ログイン</a>
                  </Button>
                  <Button>
                    <a href="/signup">新規登録</a>
                  </Button>
                </>
              )}
            </div>
          </header>
          <h1 className="text-4xl font-bold">座席予約</h1>
          <Classroom />

          <section>
            <h2 className="text-2xl font-bold">{name}の授業スケジュール</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>月曜日</TableHead>
                  <TableHead>火曜日</TableHead>
                  <TableHead>水曜日</TableHead>
                  <TableHead>木曜日</TableHead>
                  <TableHead>金曜日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>9:20 - 10:50</TableCell>
                  <TableCell>卒業制作</TableCell>
                  <TableCell>サイバーディフェンス</TableCell>
                  <TableCell>なし</TableCell>
                  <TableCell>ホームルーム</TableCell>
                  <TableCell>なし</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>11:00 - 12:30</TableCell>
                  <TableCell>卒業制作</TableCell>
                  <TableCell>サイバーディフェンス</TableCell>
                  <TableCell>なし</TableCell>
                  <TableCell>ネットワークデザイン</TableCell>
                  <TableCell>なし</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>13:30 - 15:00</TableCell>
                  <TableCell>サイバーセキュリティ</TableCell>
                  <TableCell>卒業制作</TableCell>
                  <TableCell>サーバー構築</TableCell>
                  <TableCell>卒業制作</TableCell>
                  <TableCell>クラウドデザイン</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>15:10 - 16:40</TableCell>
                  <TableCell>ルーターセキュリティ2</TableCell>
                  <TableCell>卒業制作</TableCell>
                  <TableCell>サーバー構築</TableCell>
                  <TableCell>卒業制作</TableCell>
                  <TableCell>クラウドデザイン</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <div className="p-6 bg-white dark:bg-gray-900">
            <p className="text-center text-gray-600 dark:text-gray-300">
              © 2024 My Classroom
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
