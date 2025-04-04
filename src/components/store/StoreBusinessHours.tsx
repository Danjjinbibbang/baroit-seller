"use client";

import React, { useState, useEffect } from "react";
import { DayOfWeek, BusinessHours, updateBusinessHours } from "@/utils/store";
import { Button } from "@/components/ui/button";

interface StoreBusinessHoursProps {
  isEditing?: boolean; // 부모에서 편집 상태 제어 (선택적)
  onChange: (
    businessHoursMode: string,
    timeSlots: Record<DayOfWeek, { startTime: string; endTime: string }>
  ) => void; // 부모에게 데이터 전달 함수
  storeId?: number | null; // 선택적 (API 직접 호출할 경우)
  initialBusinessHours?: Record<
    DayOfWeek,
    { startTime: string; endTime: string }
  >;
  initialMode?: string;
}

export function StoreBusinessHours({
  isEditing: externalIsEditing,
  onChange,
  storeId,
  initialBusinessHours,
  initialMode,
}: StoreBusinessHoursProps) {
  // 내부적으로 편집 상태 관리 (부모에서 제어하지 않을 경우)
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  // 실제 사용할 편집 상태 (외부에서 제공되면 그것을 사용, 아니면 내부 상태 사용)
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  // 영업시간 상태 관리 (내부적으로 관리)
  const defaultTimeSlots = {
    MONDAY: { startTime: "10:00", endTime: "20:00" },
    TUESDAY: { startTime: "10:00", endTime: "20:00" },
    WEDNESDAY: { startTime: "10:00", endTime: "20:00" },
    THURSDAY: { startTime: "10:00", endTime: "20:00" },
    FRIDAY: { startTime: "10:00", endTime: "20:00" },
    SATURDAY: { startTime: "11:00", endTime: "18:00" },
    SUNDAY: { startTime: "12:00", endTime: "17:00" },
  };

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    mode: initialMode || "PER_DAY",
    timeSlots: initialBusinessHours || defaultTimeSlots,
  });

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

  // 초기값이 변경될 때 상태 업데이트
  useEffect(() => {
    if (initialBusinessHours) {
      setBusinessHours((prev) => ({
        ...prev,
        timeSlots: {
          ...defaultTimeSlots, // 기본값을 먼저 spread
          ...initialBusinessHours, // 그 위에 초기값 spread
        },
      }));
    }
    if (initialMode) {
      setBusinessHours((prev) => ({
        ...prev,
        mode: initialMode,
      }));
    }
  }, [initialBusinessHours, initialMode]);

  // 가게 ID가 바뀔 때 영업시간 로드 -> 가게 상세 정보 조회
  // useEffect(() => {
  //   const fetchHours = async () => {
  //     if (!storeId) return;

  //     try {
  //       const response = await ;
  //       if (response.ok) {
  //         const data = await response.json();
  //         setBusinessHours(data);
  //         setIsEditing(false); // 기본은 비편집 상태로 시작
  //       }
  //     } catch (error) {
  //       console.error("영업시간 불러오기 실패:", error);
  //     }
  //   };
  //   fetchHours();
  // }, [storeId]);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // 1. 직접 API 호출 (storeId가 있는 경우)
      if (storeId) {
        await updateBusinessHours(storeId, businessHours);
        alert("영업시간이 저장되었습니다.");
      }

      // 2. 항상 부모 컴포넌트에 변경 사항 전달 (onChange 콜백 호출)
      onChange(businessHours.mode, businessHours.timeSlots);

      // 내부적으로 편집 모드 종료 (외부에서 제어하지 않을 경우)
      setInternalIsEditing(false);
    } catch (error) {
      console.error("영업시간 저장 실패:", error);
      alert("영업시간 저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">요일별 영업시간 설정</h3>
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setInternalIsEditing(false)}
              disabled={externalIsEditing !== undefined}
            >
              취소
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              저장
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setInternalIsEditing(true)}
            disabled={externalIsEditing !== undefined}
          >
            수정
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(businessHours.timeSlots).map(([day, times]) => (
          <div key={day} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-2 font-medium">
              {dayLabels[day as DayOfWeek]}
            </div>
            <div className="col-span-5">
              <input
                type="time"
                value={times.startTime || ""}
                onChange={(e) =>
                  setBusinessHours((prev) => ({
                    ...prev,
                    timeSlots: {
                      ...prev.timeSlots,
                      [day]: {
                        ...prev.timeSlots[day as DayOfWeek],
                        startTime: e.target.value,
                      },
                    },
                  }))
                }
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="col-span-5">
              <input
                type="time"
                value={times.endTime || ""}
                onChange={(e) =>
                  setBusinessHours((prev) => ({
                    ...prev,
                    timeSlots: {
                      ...prev.timeSlots,
                      [day]: {
                        ...prev.timeSlots[day as DayOfWeek],
                        endTime: e.target.value,
                      },
                    },
                  }))
                }
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        ))}
      </div>

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
