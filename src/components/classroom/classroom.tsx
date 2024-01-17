import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getGroupData, getProductData } from "@/lib/apidata";
import { GroupDataProps, ProductDataProps } from "@/lib/InterfaceTable";


export default function Classroom() {
  const [groupDataArray, setGroupDataArray] = useState<GroupDataProps[]>([]);
  // productDataMapの型定義を更新
  const [productDataMap, setProductDataMap] = useState<{
    [key: number]: ProductDataProps[];
  }>({});

  useEffect(() => {
    async function fetchData() {
      const GroupData = await getGroupData(); // すべてのグループデータを取得
      setGroupDataArray(GroupData);

      const productMap: { [key: number]: ProductDataProps[] } = {};
      for (const group of GroupData) {
        const productDataArray = await getProductData(group.id);
        productMap[group.id] = productDataArray;
      }
      setProductDataMap(productMap);
    }
    fetchData();
  }, []);

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groupDataArray.map((groupData, index) => (
        <a key={index} href={`/reservation?id=${productDataMap[groupData.id]?.[0]?.id}`}>
          <Card>
            <CardHeader className="flex">
              <CardTitle>{groupData.name}教室</CardTitle>
              <CardTitle>
                予約可能時間 {groupData.start_before}時 ～{" "}
                {groupData.start_before + groupData.invalid_duration}時
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {/* productDataMapから対応する製品データを取り出して表示 */}
                <li>
                  席の数{" "}
                  {productDataMap[groupData.id]?.[0]?.qty || "データなし"}
                </li>
                <li>予約済みの席 20</li>
                <li>席の空き 22</li>
              </ul>
            </CardContent>
          </Card>
        </a>
      ))}
    </section>
  );
}
