'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Store,
  FileText,
  TrendingUp,
  Settings,
  BarChart3,
  SquareGanttChart,
} from "lucide-react";
import Link from "next/link";

// 메뉴 데이터
const menuItems = [
  {
    id: "home",
    label: "홈",
    icon: <BarChart3 className="w-5 h-5 mr-3 text-gray-500" />,
    href: "/",
  },
  {
    id: "management",
    label: "가게 관리",
    icon: <SquareGanttChart className="w-5 h-5 mr-3 text-gray-500" />,
    href: "/store",
  },
  {
    id: "products",
    label: "상품 관리",
    icon: <Store className="w-5 h-5 mr-3 text-gray-500" />,
    href: "/products",
  },
  {
    id: "notice",
    label: "공지 관리",
    icon: <FileText className="w-5 h-5 mr-3 text-gray-500" />,
    href: "/notice",
  },
  {
    id: "stats",
    label: "매출 통계",
    icon: <TrendingUp className="w-5 h-5 mr-3 text-gray-500" />,
    href: "/stats",
  },
  {
    id: "settings",
    label: "설정",
    icon: <Settings className="w-5 h-5 mr-3 text-gray-500" />,
    href: "/setting",
  },
];

// 사이드바를 표시하지 않을 경로 목록
const noSidebarPaths = ["/login", "/register"];

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !noSidebarPaths.includes(pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 (조건부 렌더링) */}
      {showSidebar && (
        <div className="w-64 bg-white border-r min-h-screen">
          <div className="px-4 py-2 border-b flex justify-center items-center h-50">
            <img src="/baroit.png" alt="logo" className="w-30 h-15" />
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center p-2 rounded-lg w-full text-left hover:bg-gray-100 text-gray-900"
                  >
                    {React.cloneElement(item.icon, {
                      className: `w-5 h-5 mr-3 text-gray-500`,
                    })}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div
        className={`flex-1 flex flex-col overflow-x-auto ${
          !showSidebar ? "w-full" : ""
        }`}
      >
        <div className="min-w-max">
          {/* 헤더 (사이드바가 있을 때만 표시) */}
          {showSidebar && (
            <header className="bg-white min-w-full px-6 py-4 h-12 border-b flex-shrink-0" />
          )}
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}