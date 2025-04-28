"use client";

import React, { useState, useEffect } from "react";
import { StoreBasicInfo } from "@/components/store/StoreBasicInfo";
import { StoreBusinessHours } from "@/components/store/StoreBusinessHours";
import { StoreStatusSetting } from "@/components/store/StoreExposure";
import { HomeCategories } from "@/components/store/HomeCategory";
import { Clock, Info, Store as StoreIcon, Tag } from "lucide-react";

type Tab = "basic" | "hours" | "status" | "home-categories";

export default function Management() {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  // 기본적으로 storeId를 1로 설정 (가게 하나만 등록 가능)

  return (
    <div className="flex flex-col h-full">
      {/* 탭 네비게이션 */}
      <div className="flex border-b mb-6">
        <TabButton
          tab="basic"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          icon={<StoreIcon className="w-4 h-4" />}
          label="가게 기본 정보"
        />
        <TabButton
          tab="home-categories"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          icon={<Tag className="w-4 h-4" />}
          label="홈 카테고리"
        />
      </div>

      {/* 탭별 내용 */}
      <div className="flex-1">
        {activeTab === "basic" && <StoreBasicInfo />}
        {activeTab === "home-categories" && <HomeCategories />}
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
