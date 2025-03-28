"use client";

import React, { useState } from "react";
import { Store, StoreBasicInfo } from "@/components/store/StoreBasicInfo";
import { StoreBusinessHours } from "@/components/store/StoreBusinessHours";
import { StoreStatusSetting } from "@/components/store/StoreStatus";
import { HomeCategories } from "@/components/store/HomeCategory";
import { Clock, Info, Store as StoreIcon, Tag } from "lucide-react";

type Tab = "basic" | "hours" | "status" | "home-categories";

export default function Management() {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [storeId, setStoreId] = useState<number | null>(null); // 선택된 가게 ID

  // 임시: 가게 선택 or 새로 등록 후 ID 설정
  const handleSelectStore = (id: number) => {
    setStoreId(id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <header className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleSelectStore(1)} // 예시: 가게 ID를 1로 설정
            className="px-3 py-1.5 border rounded-md bg-green-50 text-green-600 hover:bg-green-100"
          >
            새 가게 등록
          </button>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      {storeId && (
        <div className="flex border-b mb-6">
          <TabButton
            tab="basic"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<StoreIcon className="w-4 h-4" />}
            label="가게 기본 정보"
          />
          <TabButton
            tab="hours"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<Clock className="w-4 h-4" />}
            label="운영 정보"
          />
          <TabButton
            tab="status"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<Info className="w-4 h-4" />}
            label="가게 상태"
          />
          <TabButton
            tab="home-categories"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<Tag className="w-4 h-4" />}
            label="홈 카테고리"
          />
        </div>
      )}

      {/* 탭별 내용 */}
      <div className="flex-1">
        {storeId && activeTab === "basic" && <StoreBasicInfo />}
        {storeId && activeTab === "hours" && (
          <StoreBusinessHours storeId={storeId} />
        )}
        {storeId && activeTab === "status" && (
          <StoreStatusSetting storeId={storeId} />
        )}
        {storeId && activeTab === "home-categories" && (
          <HomeCategories storeId={storeId} />
        )}
      </div>
    </div>
  );
}

interface TabButtonProps {
  tab: Tab;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  label: string;
  icon: React.ReactNode;
}

function TabButton({
  tab,
  activeTab,
  setActiveTab,
  label,
  icon,
}: TabButtonProps) {
  const isActive = activeTab === tab;

  return (
    <button
      className={`px-4 py-2 border-b-2 font-medium text-sm ${
        isActive
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
      onClick={() => setActiveTab(tab)}
    >
      <div className="flex items-center gap-1">
        {icon}
        {label}
      </div>
    </button>
  );
}
