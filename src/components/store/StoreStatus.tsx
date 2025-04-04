"use client";

import React, { useState, useEffect } from "react";
import { updateStoreStatus } from "@/utils/store";

export type StoreStatus = "ACTIVE" | "INACTIVE";

interface Props {
  storeId?: number | null;
  isEditing?: boolean;
  onChange: (storeStatus: StoreStatus) => void;
  initialStatus?: StoreStatus;
}

export function StoreStatusSetting({
  storeId,
  isEditing: externalIsEditing,
  onChange,
  initialStatus,
}: Props) {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>(
    initialStatus || "ACTIVE"
  );
  const [isLoading, setIsLoading] = useState(false);
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  // 초기값이 변경될 때 상태 업데이트
  useEffect(() => {
    if (initialStatus) {
      setStoreStatus(initialStatus);
    }
  }, [initialStatus]);

  // storeId 변경될 때 상태 불러오기
  // useEffect(() => {
  //   const fetchStatus = async () => {
  //     if (!storeId) return;

  //     try {
  //       const response = await fetch(`/api/stores/${storeId}/status`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         setStoreStatus(data.status);
  //       }
  //     } catch (error) {
  //       console.error("가게 상태 불러오기 실패:", error);
  //     }
  //   };

  //   fetchStatus();
  // }, [storeId]);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      if (storeId) {
        await updateStoreStatus(storeId, storeStatus);
        alert("가게 상태가 저장되었습니다.");
      }
      onChange(storeStatus);
      setInternalIsEditing(false);
    } catch (error) {
      console.error("가게 상태 저장 실패:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">가게 노출 상태 설정</h3>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setInternalIsEditing(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        ) : (
          <button
            onClick={() => setInternalIsEditing(true)}
            className="px-3 py-1.5 border rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            수정
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">노출 상태</label>

          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="status-active"
                name="store-status"
                value="ACTIVE"
                checked={storeStatus === "ACTIVE"}
                onChange={() => isEditing && setStoreStatus("ACTIVE")}
                disabled={!isEditing}
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
                checked={storeStatus === "INACTIVE"}
                onChange={() => isEditing && setStoreStatus("INACTIVE")}
                disabled={!isEditing}
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
              <span className="font-medium">노출중</span>: 고객이 가게를
              검색하고 주문할 수 있습니다.
            </li>
            <li>
              <span className="font-medium">노출중지</span>: 고객에게 가게가
              표시되지 않으며 주문을 받을 수 없습니다.
            </li>
            <li>긴급 상황이나 영업 중단 시 노출중지로 설정하세요.</li>
            <li>노출중지 상태에서도 기존 주문 관리는 가능합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
