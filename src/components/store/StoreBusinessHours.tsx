"use client";

import React, { useState, useEffect, useRef } from "react";
import { DayOfWeek, TimeSlot, updateBusinessHours } from "@/utils/store";

interface StoreBusinessHoursProps {
  isStoreCreated: boolean;
  storeId?: number; // 스토어 ID 추가
  initialBusinessHours: Record<DayOfWeek, TimeSlot>;
  initialMode: string;
  onChange: (mode: string, timeSlots: Record<DayOfWeek, TimeSlot>) => void;
}

export function StoreBusinessHours({
  isStoreCreated,
  storeId,
  initialBusinessHours,
  initialMode,
  onChange,
}: StoreBusinessHoursProps) {
  // 내부 상태 관리
  const [localTimeSlots, setLocalTimeSlots] = useState(initialBusinessHours);
  const [localMode, setLocalMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);

  const dayLabels: Record<DayOfWeek, string> = {
    MONDAY: "월요일",
    TUESDAY: "화요일",
    WEDNESDAY: "수요일",
    THURSDAY: "목요일",
    FRIDAY: "금요일",
    SATURDAY: "토요일",
    SUNDAY: "일요일",
  };

  // 이전 값을 저장할 ref 생성
  const prevModeRef = useRef(localMode);
  const prevTimeSlotsRef = useRef(localTimeSlots);

  useEffect(() => {
    // 이전 값과 현재 값이 다른 경우에만 부모에게 전달
    if (
      prevModeRef.current !== localMode ||
      JSON.stringify(prevTimeSlotsRef.current) !==
        JSON.stringify(localTimeSlots)
    ) {
      // 값 업데이트
      onChange(localMode, localTimeSlots);

      // 이전 값 업데이트
      prevModeRef.current = localMode;
      prevTimeSlotsRef.current = localTimeSlots;
    }
  }, [localMode, localTimeSlots]);

  // 시간 슬롯 변경 처리
  const handleTimeChange = (
    day: DayOfWeek,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setLocalTimeSlots((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
    // 변경 즉시 부모에게 전달하는 방식은 useState의 비동기 특성으로 인해
    // 최신 값이 전달되지 않을 수 있어 useEffect를 사용합니다
  };

  // 모드 변경 처리
  const handleModeChange = (newMode: string) => {
    setLocalMode(newMode);
    // 마찬가지로 useEffect에서 처리
  };

  // 저장 버튼 클릭 처리 - API 호출만 담당
  const handleSave = async () => {
    if (window.confirm("영업 시간 정보를 수정하시겠습니까?")) {
      try {
        setIsLoading(true);

        // API 호출하여 영업 시간 업데이트 (서버 저장)
        if (storeId) {
          await updateBusinessHours(storeId, {
            mode: localMode,
            timeSlots: localTimeSlots,
          });
        }

        alert("영업 시간 정보가 수정되었습니다.");
      } catch (error) {
        console.error("영업 시간 수정 실패:", error);
        alert("영업 시간 정보 수정에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 수정 버튼 - 가게 생성 후에만 활성화 */}
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

      {/* 모드 선택 */}
      <div>
        <select
          value={localMode}
          onChange={(e) => handleModeChange(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md"
        >
          <option value="PER_DAY">요일별 설정</option>
          <option value="ALL_DAYS">모든 요일 동일 설정</option>
        </select>
      </div>

      {/* 시간 입력 필드들 */}
      {localMode === "PER_DAY" ? (
        // 요일별 설정
        Object.keys(localTimeSlots).map((day) => (
          <div key={day} className="flex items-center space-x-2">
            <span className="w-24">{dayLabels[day as DayOfWeek]}</span>
            <input
              type="time"
              value={localTimeSlots[day as DayOfWeek].startTime}
              onChange={(e) =>
                handleTimeChange(day as DayOfWeek, "startTime", e.target.value)
              }
              className="p-1 border rounded"
            />
            <span>~</span>
            <input
              type="time"
              value={localTimeSlots[day as DayOfWeek].endTime}
              onChange={(e) =>
                handleTimeChange(day as DayOfWeek, "endTime", e.target.value)
              }
              className="p-1 border rounded"
            />
          </div>
        ))
      ) : (
        // 모든 요일 동일 설정
        <div className="flex items-center space-x-2">
          <span className="w-24">모든 요일</span>
          <input
            type="time"
            value={localTimeSlots.MONDAY.startTime}
            onChange={(e) => {
              const newTime = e.target.value;
              const newTimeSlots = { ...localTimeSlots };
              Object.keys(newTimeSlots).forEach((day) => {
                newTimeSlots[day as DayOfWeek].startTime = newTime;
              });
              setLocalTimeSlots(newTimeSlots);
            }}
            className="p-1 border rounded"
          />
          <span>~</span>
          <input
            type="time"
            value={localTimeSlots.MONDAY.endTime}
            onChange={(e) => {
              const newTime = e.target.value;
              const newTimeSlots = { ...localTimeSlots };
              Object.keys(newTimeSlots).forEach((day) => {
                newTimeSlots[day as DayOfWeek].endTime = newTime;
              });
              setLocalTimeSlots(newTimeSlots);
            }}
            className="p-1 border rounded"
          />
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium mb-2">안내사항</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>영업시간은 24시간 형식으로 입력해주세요. (예: 09:00)</li>
          <li>휴무일은 시작 시간과 종료 시간을 비워두세요.</li>
          <li>변경사항은 반드시 저장 버튼을 눌러 적용해주세요.</li>
        </ul>
      </div>
    </div>
  );
}
