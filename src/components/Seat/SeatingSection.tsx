import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  SeatDataProps,
  SeatMapObject,
  SeatingSectionProps,
} from "@/lib/InterfaceTable";

export default function SeatingSection({
  productId,
  seatMap,
  breakpoint,
}: SeatingSectionProps) {
  const [seats, setSeats] = useState<SeatDataProps[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<{
    [id: string]: SeatDataProps;
  }>({});

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/get_seat?product_id=${productId}`
        );
        console.log(response.data.seat);
        setSeats(response.data.seat);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats();
  }, [productId]);

  const handleSeatClick = (seatData: SeatDataProps) => {
    setSelectedSeats((prev) => {
      const newSelectedSeats = { ...prev };
      if (newSelectedSeats[seatData.id]) {
        delete newSelectedSeats[seatData.id]; // 既に選択されている場合は選択解除
      } else {
        newSelectedSeats[seatData.id] = seatData; // 新しく選択
      }
      return newSelectedSeats;
    });
  };
  const renderSeat = (seatObj: SeatMapObject, index: number) => {
    const { type, id, row, column, labelLength } = seatObj;
    let className = "seat";
    let content = "";

    if (type === "seat") {
      // APIから取得したデータを検索
      const seatData = seats.find(
        (seat) => seat.row === row && seat.column === column
      );

      // 座席がAPIデータに存在するかどうか
      const isSeatDataAvailable = !!seatData;
      const isReserved = seatData ? seatData.is_reserved : false;
      const isAvailable = seatData ? seatData.is_enable : false;
      const isSelected = seatData ? selectedSeats[seatData.id] : false; // 選択されているかチェック

      className += isSeatDataAvailable
        ? isReserved
          ? " reserved"
          : isSelected
          ? " selected-seat" // 選択されている場合は特別なクラスを追加
          : " available"
        : " empty";
      content = isReserved ? "済" : `${row}${column}`;

      return (
        <Button
          key={`${id}-${index}`}
          className={`${className} text-black`}
          onClick={() =>
            isSeatDataAvailable && seatData && handleSeatClick(seatData)
          }
          disabled={!isSeatDataAvailable} // データがない場合は選択不可
        >
          {content}
        </Button>
      );
    } else if (type === "label") {
      className += " label";
      content =
        labelLength && content ? content.substring(0, labelLength) : content;

      const style = labelLength ? { minWidth: `${labelLength}ch` } : {};

      return (
        <div
          key={`${id}-${index}`}
          className={`${className} text-black`}
          style={style}
        >
          {content}
        </div>
      );
    }

    return null; // typeが 'seat' または 'label' 以外の場合は何も表示しない
  };

  const renderRows = () => {
    const rows: JSX.Element[] = [];
    let currentRow: JSX.Element[] = [];
    let currentIndex = 0;

    seatMap.forEach((seatObj, index) => {
      if (seatObj.type === "seat") {
        // 行の先頭に座席を追加することで、左右を反転させる
        currentRow.unshift(renderSeat(seatObj, index));

        if (currentRow.length === breakpoint || seatObj.Enter) {
          rows.push(
            <div key={`row-${currentIndex}`} className="seat-row">
              {currentRow}
            </div>
          );
          currentIndex++;
          currentRow = [];
        }
      } else if (seatObj.type === "label") {
        if (currentRow.length > 0) {
          rows.push(
            <div key={`row-${currentIndex}`} className="seat-row">
              {currentRow}
            </div>
          );
          currentIndex++;
          currentRow = [];
        }

        rows.push(
          <div key={`row-${currentIndex}`} className="seat-row">
            {renderSeat(seatObj, index)}
          </div>
        );
        currentIndex++;
      }
    });

    if (currentRow.length > 0) {
      rows.push(
        <div key={`row-${currentIndex}`} className="seat-row">
          {currentRow}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className="seating-chart">
      {renderRows()}
      <div className="selected-seats">
        {Object.values(selectedSeats).map((seat) => (
          <div key={seat.id}>
            Selected Seat: {seat.row}
            {seat.is_enable ? "○" : "×"}
            {seat.column}
          </div>
        ))}
      </div>
    </div>
  );
}
