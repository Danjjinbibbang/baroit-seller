"use client";
import React from "react";
import {
  Bell,
  Smartphone,
  UserCog,
  Globe,
  CreditCard,
  Shield,
  Store,
} from "lucide-react";

// 임시 설정 데이터
const settingGroups = [
  {
    title: "계정 정보",
    settings: [
      {
        id: "profile",
        name: "프로필 정보",
        description: "이름, 전화번호 등 개인정보를 관리합니다.",
        icon: <UserCog className="w-5 h-5 text-blue-500" />,
      },
      {
        id: "notifications",
        name: "알림 설정",
        description: "앱 알림, 마케팅 정보 수신 설정을 관리합니다.",
        icon: <Bell className="w-5 h-5 text-orange-500" />,
      },
      {
        id: "device",
        name: "기기 및 로그인",
        description: "현재 로그인한 기기와 로그인 이력을 관리합니다.",
        icon: <Smartphone className="w-5 h-5 text-green-500" />,
      },
    ],
  },
  {
    title: "가게 정보",
    settings: [
      {
        id: "store",
        name: "가게 정보 관리",
        description: "가게 이름, 주소, 영업시간 등을 관리합니다.",
        icon: <Store className="w-5 h-5 text-blue-500" />,
      },
      {
        id: "payment",
        name: "결제 수단 관리",
        description: "정산 계좌 및 결제 수단을 관리합니다.",
        icon: <CreditCard className="w-5 h-5 text-purple-500" />,
      },
    ],
  },
  {
    title: "시스템 설정",
    settings: [
      {
        id: "language",
        name: "언어 설정",
        description: "시스템 언어를 변경합니다.",
        icon: <Globe className="w-5 h-5 text-green-500" />,
      },
      {
        id: "security",
        name: "보안 설정",
        description: "비밀번호 및 기타 보안 설정을 관리합니다.",
        icon: <Shield className="w-5 h-5 text-red-500" />,
      },
    ],
  },
];

export default function Settings() {
  return (
    <>
      <header className="mb-4">
        <h1 className="text-lg font-bold">설정</h1>
      </header>

      <div className="space-y-6">
        {settingGroups.map((group, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm">
            <div className="px-4 py-3 border-b">
              <h2 className="font-medium">{group.title}</h2>
            </div>
            <div className="divide-y">
              {group.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer flex items-center"
                >
                  <div className="mr-4">{setting.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium">{setting.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {setting.description}
                    </p>
                  </div>
                  <div className="text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
