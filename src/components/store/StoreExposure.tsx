"use client";

import React, { useState, useEffect, useRef } from "react";
import { updateStoreExposure } from "@/utils/store";

export type StoreStatus = "ACTIVE" | "INACTIVE";

interface Props {
  storeId?: number | null;
  isStoreCreated: boolean;
  onChange: (storeStatus: StoreStatus) => void;
  initialStatus: StoreStatus;
}

export function StoreExposure({
  storeId,
  isStoreCreated,
  onChange,
  initialStatus,
}: Props) {
  const [localStatus, setLocalStatus] = useState<StoreStatus>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  // 이전 값 저장할 ref 생성
  const prevStatusRef = useRef(localStatus);

  // 초기값이 변경될 때 상태 업데이트
  useEffect(() => {
    if (prevStatusRef.current !== localStatus) {
      onChange(localStatus);
      prevStatusRef.current = localStatus;
    }
  }, [localStatus]);

  const handleSave = async () => {
    if (window.confirm("가게 노출 상태를 수정하시겠습니까?")) {
      try {
        setIsLoading(true);

        // API 호출하여 가게 상태 업데이트
        if (storeId) {
          await updateStoreExposure(storeId, localStatus);
        }
        alert("가게 노출 상태가 수정되었습니다.");
      } catch (error) {
        console.error("가게 상태 수정 실패:", error);
        alert("가게 상태 수정에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isStoreCreated || isLoading}
          className={`px-4 py-2 rounded-md ${
            isStoreCreated
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? "저장 중..." : "수정"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700">노출 상태</label>

        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="status-active"
              name="store-status"
              value="ACTIVE"
              checked={localStatus === "ACTIVE"}
              onChange={() => setLocalStatus("ACTIVE")}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="status-active" className="text-sm">
              노출중
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="status-inactive"
              name="store-status"
              value="INACTIVE"
              checked={localStatus === "INACTIVE"}
              onChange={() => setLocalStatus("INACTIVE")}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="status-inactive" className="text-sm">
              노출중지
            </label>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-md mt-6">
        <h4 className="font-medium mb-2">가게 노출 상태 안내</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>
            <span className="font-medium">노출중</span>: 고객이 가게를 검색하고
            주문할 수 있습니다.
          </li>
          <li>
            <span className="font-medium">노출중지</span>: 고객에게 가게가
            표시되지 않으며 주문을 받을 수 없습니다.
          </li>
          <li>긴급 상황이나 노출 중단 시 노출중지로 설정하세요.</li>
          <li>노출중지 상태에서도 기존 주문 관리는 가능합니다.</li>
        </ul>
      </div>
    </div>
  );
}
