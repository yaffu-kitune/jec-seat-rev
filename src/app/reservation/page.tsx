"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SeatingSection from "@/components/Seat/SeatingSection";
import seatMapData from "@/lib/seatMapData.json";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getGroupData, getProductData } from "@/lib/apidata";
import {
  GroupDataProps,
  ReservationProps,
  columns,
} from "@/lib/InterfaceTable";
import { DataTable } from "@/components/classroom/DataTable";
import Image from "next/image";

async function getData(): Promise<ReservationProps[]> {
  // Fetch data from your API here.
  return [
    {
      id: "R1001",
      name: "Ken Thompson",
      student_id: 1001,
      email: "ken99@yahoo.com",
      Date: [new Date("2022-01-01"), new Date("2022-01-05")],
    },
    {
      id: "R1002",
      name: "Ada Lovelace",
      student_id: 1002,
      email: "Abe45@gmail.com",
      Date: [new Date("2022-01-10")],
    },
    {
      id: "R1003",
      name: "Grace Hopper",
      student_id: 1003,
      email: "Monserrat44@gmail.com",
      Date: [new Date("2022-01-15"), new Date("2022-01-20")],
    },
    {
      id: "R1004",
      name: "Alan Turing",
      student_id: 1004,
      email: "Silas22@gmail.com",
      Date: [new Date("2022-01-25")],
    },
  ];
}

export default function Home() {
  const [seatMaps, setSeatMaps] = useState(seatMapData);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ window オブジェクトを使用
    function handleResize() {
      setIsTablet(window.innerWidth <= 980);
    }

    // イベントリスナーを追加
    window.addEventListener("resize", handleResize);

    // 初回のレンダリングでサイズをチェック
    handleResize();

    // コンポーネントのアンマウント時にイベントリスナーを削除
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // /reservation?id={product_id} から url クエリパラメーターを取得
  const searchParams = useSearchParams();
  const product_id = searchParams.get("id");
  const [groupName, setGroupName] = useState("151");
  const [data, setData] = useState<ReservationProps[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getData();
      setData(data);
    }
    fetchData();
  }, []);

  async function findGroupNameByProductId(productId: number) {
    try {
      // すべてのグループデータを取得
      const groups = await getGroupData();
      let groupName = "";

      for (const group of groups) {
        // 各グループの製品データを取得
        const products = await getProductData(group.id);

        // 製品IDに一致する製品を探す
        const product = products.find((p) => p.id === productId);
        if (product) {
          // 一致する製品が見つかった場合、グループ名を取得
          groupName = group.name;
          break;
        }
      }

      if (groupName) {
        setGroupName(groupName);
      } else {
        console.log(
          `Product ID: ${productId} に対応するグループが見つかりませんでした。`
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // この関数を呼び出して特定の product_id に対応する group の name を取得
  findGroupNameByProductId(Number(product_id));

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-[90%] p-8 space-y-6">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CardTitle className="text-2xl font-bold">予約状況</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            以下に現在の予約状況を表示します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">フィルター</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>すべて</DropdownMenuItem>
                  <DropdownMenuItem>確定</DropdownMenuItem>
                  <DropdownMenuItem>キャンセル</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {/*<SeatingSection
                productId={product_id}
                seatMap={seatMaps[groupName]} // groupName を使用
                breakpoint={8}
              />*/}
              {isTablet ? (
                <div className="grid grid-cols-7">
                  <div className="col-span-6">
                    <SeatingSection
                      productId={product_id}
                      seatMap={seatMaps[groupName]} // groupName を使用
                      breakpoint={8}
                    />
                  </div>
                  <div className="table-container">ホワイトボード</div>
                </div>
              ) : (
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel>
                    <div className="grid grid-cols-7">
                      <div className="col-span-6">
                        <SeatingSection
                          productId={product_id}
                          seatMap={seatMaps[groupName]} // groupName を使用
                          breakpoint={8}
                        />
                      </div>
                      <div className="table-container">ホワイトボード</div>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel className="p-3"></ResizablePanel>
                </ResizablePanelGroup>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          <Button variant="outline">
            <a href="/">前のページへ戻る</a>
          </Button>
          <Button>
            <a>次へ</a>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
