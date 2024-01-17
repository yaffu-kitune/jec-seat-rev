"use server";
import axios from "axios";
import { GroupDataProps, ProductDataProps } from "@/lib/InterfaceTable";
import bcrypt from "bcrypt";
import { ApiResponse, customerInt } from "./InterfaceTable";

const url = `${process.env.NEXT_PUBLIC_GO_API_URL}/get_group?shop_id=4`;

export async function getGroupData(): Promise<GroupDataProps[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_GO_API_URL}/get_group?shop_id=4`
    );
    return response.data.group; // すべてのグループデータを返す
  } catch (error) {
    console.error(error);
    return [];
  }
}

// APIからデータを取得し、必要な形式に整理する関数
export async function getCustomerData() {
  try {
    // API エンドポイントからデータを取得
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/get_customer`
    );

    // 応答データから必要な情報を抽出
    const alldata = response.data;
    const name = alldata.name;
    const mail = alldata.email; // API応答のキーによって変わる可能性がある
    const phone = alldata.phone; // このキーもAPIの応答に依存します
    const password = alldata.password;

    // 整理したデータを返す
    return { alldata, name, mail, phone, password };
  } catch (error) {
    // エラーハンドリング
    console.error("Error fetching customer data:", error);
    throw error;
  }
}

export async function postCustomerData(customerData: any) {
  try {
    // パスワードが提供されている場合のみハッシュ化
    if (customerData.password) {
      const hashedPassword = await bcrypt.hash(customerData.password, 14);
      customerData.password = hashedPassword;
    }
    console.log(customerData);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/post_customer`,
      customerData
    );
    return response.data;
  } catch (error) {
    console.error("Error posting customer data:", error);
    throw error;
  }
}

export async function getProductData(
  groupId: number
): Promise<ProductDataProps[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_GO_API_URL}/get_product?group_id=${groupId}`
    );

    return response.data.Product; // ここが正しい形式であることを確認
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function checkEmail(email: string): Promise<boolean> {
  try {
    const response = await axios.get<ApiResponse>(
      "http://localhost:8080/get_customer"
    );
    const customers = response.data.customer; // ここを 'customers' に修正
    console.log(email);
    console.log(
      customers?.some((customer: customerInt) => customer.mail === email) ??
        false
    );
    return (
      customers?.some((customer: customerInt) => customer.mail === email) ??
      false
    );
  } catch (error) {
    console.error("APIリクエストでエラー:", error);
    throw new Error(`APIリクエストエラー: ${error}`);
  }
}
