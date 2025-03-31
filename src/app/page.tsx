"use client";
import React from "react";
// 임시 데이터
const orderStats = {
  newOrders: 1,
  inProgress: 1,
  accepted: 1,
  completed: 1,
  cancelled: 1,
};

const salesInfo = {
  ownerName: "김배민",
  todayExpectedSales: 523000,
  orderCount: 4,
};

export default function Home() {
  return (
    <>
      {/* 매출 정보 */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
        <div className="mb-4">
          <p className="text-gray-900">{salesInfo.ownerName} 사장님,</p>
          <p className="flex items-baseline mt-1">
            <span className="text-gray-700">오늘 예정 금액은</span>
            <span className="text-blue-500 text-xl font-bold mx-1">
              {salesInfo.todayExpectedSales.toLocaleString()}원
            </span>
            <span className="text-gray-700">입니다.</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            배달의민족에서 받고 있는 주문 {salesInfo.orderCount}건 입니다.
          </p>
        </div>

        {/* 주문 현황 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">주문 처리 현황</h2>
            <button className="text-sm text-gray-500">전체보기</button>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="bg-white p-2 rounded">
              <p className="text-orange-500 font-bold">
                {orderStats.newOrders}
              </p>
              <p className="text-xs text-gray-500 mt-1">신규</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="text-green-500 font-bold">
                {orderStats.inProgress}
              </p>
              <p className="text-xs text-gray-500 mt-1">처리중</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="text-blue-500 font-bold">{orderStats.accepted}</p>
              <p className="text-xs text-gray-500 mt-1">접수</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="text-gray-900 font-bold">{orderStats.completed}</p>
              <p className="text-xs text-gray-500 mt-1">완료</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="text-red-500 font-bold">{orderStats.cancelled}</p>
              <p className="text-xs text-gray-500 mt-1">취소</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
