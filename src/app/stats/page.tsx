"use client";

import React, { useState } from "react";
import { Calendar, ArrowDown, ArrowUp } from "lucide-react";

// 임시 매출 데이터
const salesData = [
  { date: "23.12.30", orders: 32, sales: 450000, avg: 14063 },
  { date: "23.12.29", orders: 28, sales: 390000, avg: 13929 },
  { date: "23.12.28", orders: 35, sales: 480000, avg: 13714 },
  { date: "23.12.27", orders: 30, sales: 410000, avg: 13667 },
  { date: "23.12.26", orders: 25, sales: 350000, avg: 14000 },
  { date: "23.12.25", orders: 20, sales: 300000, avg: 15000 },
  { date: "23.12.24", orders: 38, sales: 520000, avg: 13684 },
];

// 임시 요약 데이터
const summary = {
  totalSales: 2900000,
  totalOrders: 208,
  avgOrderValue: 13942,
  comparedToLastWeek: 12.5,
};

export default function Stats() {
  const [period, setPeriod] = useState("일별");

  return (
    <>
      <header className="mb-4">
        <h1 className="text-lg font-bold">매출 통계</h1>
      </header>

      {/* 기간 선택 및 요약 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm col-span-1 md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">기간 선택</h3>
            <button className="text-sm text-blue-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              날짜 선택
            </button>
          </div>
          <div className="flex space-x-2">
            {["일별", "주별", "월별"].map((p) => (
              <button
                key={p}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  period === p ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm col-span-1 md:col-span-2">
          <h3 className="font-medium mb-3">매출 요약</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">총 매출</p>
              <p className="text-lg font-bold mt-1">
                {summary.totalSales.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">총 주문</p>
              <p className="text-lg font-bold mt-1">{summary.totalOrders}건</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 주문금액</p>
              <p className="text-lg font-bold mt-1">
                {summary.avgOrderValue.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">전주 대비</p>
              <p
                className={`text-lg font-bold mt-1 flex items-center ${
                  summary.comparedToLastWeek > 0
                    ? "text-red-500"
                    : "text-blue-500"
                }`}
              >
                {summary.comparedToLastWeek > 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(summary.comparedToLastWeek)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 매출 데이터 테이블 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-4 px-4 py-3 bg-gray-50 text-sm font-medium text-gray-500 rounded-t-lg">
          <div>날짜</div>
          <div>주문수</div>
          <div>총 매출</div>
          <div>평균 금액</div>
        </div>
        {salesData.map((day, idx) => (
          <div
            key={idx}
            className="grid grid-cols-4 px-4 py-3 border-b text-sm hover:bg-gray-50 last:rounded-b-lg"
          >
            <div>{day.date}</div>
            <div>{day.orders}건</div>
            <div>{day.sales.toLocaleString()}원</div>
            <div>{day.avg.toLocaleString()}원</div>
          </div>
        ))}
      </div>
    </>
  );
}
