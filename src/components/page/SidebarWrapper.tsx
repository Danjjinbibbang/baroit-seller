"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Store,
  FileText,
  TrendingUp,
  Settings,
  BarChart3,
  SquareGanttChart,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = !noSidebarPaths.includes(pathname);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 화면 크기 변경을 감지하는 효과
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px 미만을 모바일로 간주
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // 데스크톱에서는 사이드바 항상 표시
      } else {
        setSidebarOpen(false); // 모바일에서는 초기에 사이드바 숨김
      }
    };

    // 초기 화면 크기 확인
    checkScreenSize();

    // 화면 크기 변경 감지
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-gray-50 relative">
        {/* 모바일 헤더 (햄버거 메뉴) */}
        {showSidebar && isMobile && (
          <div className="fixed top-0 left-0 right-0 bg-white h-14 z-30 border-b px-4 flex items-center">
            <button onClick={toggleSidebar} className="p-2">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="ml-4">
              <img src="/baroit.png" alt="logo" className="h-8" />
            </div>
          </div>
        )}

        {/* 사이드바 (조건부 렌더링) */}
        {showSidebar && sidebarOpen && (
          <div
            className={`${
              isMobile ? "fixed z-20 top-14 bottom-0 left-0" : "sticky top-0"
            } w-64 bg-white border-r min-h-screen transition-all duration-300`}
          >
            {!isMobile && (
              <div className="px-4 py-2 border-b flex justify-center items-center h-50">
                <img src="/baroit.png" alt="logo" className="w-30 h-15" />
              </div>
            )}
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="flex items-center p-2 rounded-lg w-full text-left hover:bg-gray-100 text-gray-900"
                      onClick={() => isMobile && setSidebarOpen(false)} // 모바일에서 메뉴 클릭 시 사이드바 닫기
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

        {/* 오버레이 (모바일에서 사이드바 열릴 때) */}
        {showSidebar && isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 메인 콘텐츠 */}
        <div
          className={`flex-1 flex flex-col overflow-x-auto ${
            !showSidebar ? "w-full" : ""
          } ${isMobile ? "pt-14" : ""}`}
        >
          <div className="min-w-max">
            {/* 헤더 (데스크톱에서 사이드바가 있을 때만 표시) */}
            {showSidebar && !isMobile && (
              <header className="bg-white min-w-full px-6 py-4 h-12 border-b flex-shrink-0" />
            )}
            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 p-6">{children}</div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
