"use client";

import React, { useState } from "react";
import {
  Store,
  FileText,
  TrendingUp,
  Settings,
  BarChart3,
  SquareGanttChart,
} from "lucide-react";

// 컴포넌트 import
import Home from "../page";
import Notice from "../notice/page";
import Stats from "../stats/page";
import Settings_ from "../setting/page";
import Management from "../store/page";
import ProductsPage from "../products/page";

// 메뉴 데이터
const menuItems = [
  {
    id: "home",
    label: "홈",
    icon: <BarChart3 className="w-5 h-5 mr-3 text-gray-500" />,
  },
  {
    id: "management",
    label: "가게 관리",
    icon: <SquareGanttChart className="w-5 h-5 mr-3 text-gray-500" />,
  },
  {
    id: "products",
    label: "상품 관리",
    icon: <Store className="w-5 h-5 mr-3 text-gray-500" />,
  },
  {
    id: "notice",
    label: "공지 관리",
    icon: <FileText className="w-5 h-5 mr-3 text-gray-500" />,
  },
  {
    id: "stats",
    label: "매출 통계",
    icon: <TrendingUp className="w-5 h-5 mr-3 text-gray-500" />,
  },
  {
    id: "settings",
    label: "설정",
    icon: <Settings className="w-5 h-5 mr-3 text-gray-500" />,
  },
];

export default function BusinessPage() {
  const [activeMenu, setActiveMenu] = useState("home");

  // 활성화된 메뉴에 따라 컴포넌트 렌더링
  const renderContent = () => {
    switch (activeMenu) {
      case "home":
        return <Home />;
      case "management":
        return <Management />;
      case "products":
        return <ProductsPage />;
      case "notice":
        return <Notice />;
      case "stats":
        return <Stats />;
      case "settings":
        return <Settings_ />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 왼쪽 사이드바 */}
      <div className="w-64 bg-white border-r min-h-screen">
        <div className="px-4 py-2 border-b flex justify-center items-center h-50">
          <img src="/baroit.png" alt="logo" className="w-30 h-15" />
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center p-2 rounded-lg w-full text-left ${
                    activeMenu === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100 text-gray-900"
                  }`}
                >
                  {React.cloneElement(item.icon, {
                    className: `w-5 h-5 mr-3 ${
                      activeMenu === item.id ? "text-blue-500" : "text-gray-500"
                    }`,
                  })}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-x-auto">
        <div className="min-w-max">
          {/* 헤더 */}
          <header className="bg-white min-w-full px-6 py-4 h-12 border-b flex-shrink-0" />
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
