import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface GroupDataProps {
  id: number;
  shop_id: number;
  name: string;
  start_before: number;
  available_duration: number;
  unit_time: number;
}

export interface ProductDataProps {
  id: number;
  group_id: number;
  name: string;
  max_people: number;
  qty: number;
}

export interface SeatDataProps {
  id: number;
  row: number;
  column: number;
  is_reserved: boolean;
  is_enable: boolean;
  // 他の必要なプロパティ
}

export interface SeatMapObject {
  id: number;
  type: "seat" | "label";
  row?: number;
  column?: number;
  labelLength?: number;
  Enter?: boolean;
  // 他の必要なプロパティ
}

export interface SeatingSectionProps {
  productId: number;
  seatMap: SeatMapObject[];
  breakpoint: number;
}

export interface ReservationProps {
  id: string;
  name: string;
  student_id: number;
  email: string;
  Date: Date[];
}

export interface ReservationObject {
  id: number;
  start_date: Date;
  end_date: Date;
}

export interface customerInt {
  id: number;
  name: string;
  mail: string;
  phone: string;
  password: string;
}

export const columns: ColumnDef<ReservationProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => "ID",
    cell: ({ row }) => row.getValue("id"),
  },
  {
    accessorKey: "name",
    header: () => "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "student_id",
    header: () => "Student ID",
    cell: ({ row }) => row.getValue("student_id"),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "Date",
    header: () => "Date",
    cell: ({ row }) => {
      const dates = row.getValue("Date") || []; // Dateがundefinedの場合は空の配列を使用
      return (
        <div>
          {dates.map((date, index) => (
            <div key={index}>{date.toLocaleDateString()}</div>
          ))}
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
