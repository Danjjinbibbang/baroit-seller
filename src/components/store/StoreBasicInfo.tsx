"use client";

import React, { useState } from "react";
import { registerStore } from "@/utils/store"; // 등록 API
import { Button } from "@/components/ui/button";
import { AddressSearch } from "../address/AddressSearch";
import { CurrentLocation } from "../address/CurrentLocation";
import { StoreBusinessHours } from "./StoreBusinessHours";
import { StoreExposure, StoreStatus } from "./StoreExposure";
import { DayOfWeek } from "@/utils/store";
import { StoreWorking } from "./StoreWorking";

export interface StoreInfo {
  name: string;
  detailed: string;
  tel: string;
  bizNumber: string;
  addressCode: string;
  addressDetail: string;
  latitude: number;
  longitude: number;
  jibun: string;
  road: string;
  minOrderPrice: number;
  deliveryType: string;
  deliveryTimeEstimate: number;
  deliveryPickup: number;
  businessHoursMode: string;
  timeSlots: Record<DayOfWeek, TimeSlotItem>;
  workCondition: StoreWorking;
  status: StoreStatus;
}

export interface TimeSlotItem {
  startTime: string;
  endTime: string;
}

export function StoreBasicInfo() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "",
    detailed: "",
    tel: "",
    bizNumber: "",
    addressCode: "",
    addressDetail: "",
    latitude: 0,
    longitude: 0,
    jibun: "",
    road: "",
    minOrderPrice: 0,
    deliveryType: "",
    deliveryTimeEstimate: 0,
    deliveryPickup: 0,
    businessHoursMode: "PER_DAY",
    timeSlots: {
      MONDAY: { startTime: "10:00", endTime: "22:00" },
      TUESDAY: { startTime: "10:00", endTime: "22:00" },
      WEDNESDAY: { startTime: "10:00", endTime: "22:00" },
      THURSDAY: { startTime: "10:00", endTime: "22:00" },
      FRIDAY: { startTime: "10:00", endTime: "22:00" },
      SATURDAY: { startTime: "10:00", endTime: "22:00" },
      SUNDAY: { startTime: "10:00", endTime: "22:00" },
    },
    workCondition: "OPEN",
    status: "ACTIVE",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStoreCreated, setIsStoreCreated] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [showAddressSearch, setShowAddressSearch] = useState(false);

  // 주소 검색 결과 처리
  interface AddressData {
    zonecode: string;
    jibunAddress: string;
    roadAddress: string;
    latitude?: number;
    longitude?: number;
  }

  const handleAddressSelect = (address: AddressData) => {
    setStoreInfo((prev) => ({
      ...prev,
      addressCode: address.zonecode,
      jibun: address.jibunAddress,
      road: address.roadAddress,
      latitude: address.latitude || 0,
      longitude: address.longitude || 0,
    }));
    setShowAddressSearch(false);
  };

  // 가게 정보 저장
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await registerStore(storeInfo);
      alert("가게 정보가 저장되었습니다.");
      setIsStoreCreated(true); // 가게 생성 완료 표시
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상호명
          </label>
          <input
            type="text"
            value={storeInfo.name}
            onChange={(e) =>
              setStoreInfo((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            전화번호
          </label>
          <input
            type="tel"
            value={storeInfo.tel}
            onChange={(e) =>
              setStoreInfo((prev) => ({
                ...prev,
                tel: e.target.value,
              }))
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상세 설명
          </label>
          <textarea
            value={storeInfo.detailed}
            onChange={(e) =>
              setStoreInfo((prev) => ({
                ...prev,
                detailed: e.target.value,
              }))
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            사업자등록번호
          </label>
          <input
            type="text"
            value={storeInfo.bizNumber}
            onChange={(e) =>
              setStoreInfo((prev) => ({
                ...prev,
                bizNumber: e.target.value,
              }))
            }
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {/* 주소 정보 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          주소
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={storeInfo.road}
            readOnly
            className="w-full p-2 border rounded-md"
            placeholder="주소 검색"
            onClick={() => setShowAddressSearch(true)}
          />

          <button
            onClick={() => setShowAddressSearch(true)}
            className="px-4 py-2 border rounded-md bg-gray-50"
          >
            주소 검색
          </button>
        </div>
        <input
          type="text"
          value={storeInfo.addressDetail}
          onChange={(e) =>
            setStoreInfo((prev) => ({
              ...prev,
              addressDetail: e.target.value,
            }))
          }
          className="w-full mt-2 p-2 border rounded-md"
          placeholder="상세주소"
        />
      </div>

      {/* 배달 및 시간 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            배달 예상 시간 (분)
          </label>
          <input
            type="number"
            value={storeInfo.deliveryTimeEstimate}
            onChange={(e) =>
              setStoreInfo((prev) => ({
                ...prev,
                deliveryTimeEstimate: Number(e.target.value),
              }))
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            포장 소요 시간 (분)
          </label>
          <input
            type="number"
            value={storeInfo.deliveryPickup}
            onChange={(e) =>
              setStoreInfo((prev) => ({
                ...prev,
                deliveryPickup: Number(e.target.value),
              }))
            }
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {/* 영업 시간 설정 - StoreBusinessHours 컴포넌트 사용 */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          영업 시간 설정
        </label>

        <StoreBusinessHours
          isStoreCreated={isStoreCreated}
          initialBusinessHours={storeInfo?.timeSlots}
          initialMode={storeInfo?.businessHoursMode}
          onChange={(businessHoursMode, timeSlots) => {
            setStoreInfo((prev) => ({
              ...prev,
              businessHoursMode,
              timeSlots: timeSlots,
            }));
          }}
        />
      </div>

      {/* 영업 상태 설정 - StoreStatusSetting 컴포넌트 사용 */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          영업 상태 설정
        </label>

        <StoreWorking
          isStoreCreated={isStoreCreated}
          initialWorking={storeInfo?.workCondition}
          onChange={(working) => {
            setStoreInfo((prev) => ({
              ...prev,
              workCondition: working,
            }));
          }}
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          가게 노출 상태 설정
        </label>

        <StoreExposure
          isStoreCreated={isStoreCreated}
          initialStatus={storeInfo?.status}
          onChange={(status) => {
            setStoreInfo((prev) => ({
              ...prev,
              status: status,
            }));
          }}
        />
      </div>

      {/* 주문 유형 및 최소 주문 금액 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            배달 유형
          </label>
          <select
            value={storeInfo.deliveryType}
            onChange={(e) =>
              setStoreInfo((prev) => ({
                ...prev,
                deliveryType: e.target.value,
              }))
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="">선택하세요</option>
            <option value="THIRD_PARTY">대행사배달</option>
            {/* <option value="PICKUP">픽업</option> */}
            <option value="OWN_DELIVERY">자체배달</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            최소주문금액 (원)
          </label>
          <input
            type="number"
            value={storeInfo.minOrderPrice}
            onChange={(e) =>
              setStoreInfo((prev) => ({
                ...prev,
                minOrderPrice: Number(e.target.value),
              }))
            }
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {/* 주소 검색 모달 */}
      {showAddressSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold mb-4">주소 검색</h2>

            <div className="flex flex-col gap-4">
              <AddressSearch
                onSelectAddress={handleAddressSelect}
                buttonLabel="주소 검색"
                className="w-[30%] border rounded-md self-center"
              />

              <div className="flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>

              {/* <Button
                type="button"
                variant="outline"
                className="flex w-[30%] items-center justify-center self-center"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        handleAddressSelect({
                          road: position.roadAddress,
                          jibun: position.jibunAddress,
                          addressCode: position.zonecode,
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude,
                        });
                      },
                      (error) => {
                        setAddressError("위치 정보를 가져올 수 없습니다.");
                      }
                    );
                  } else {
                    setAddressError(
                      "위치 정보가 지원되지 않는 브라우저입니다."
                    );
                  }
                }}
              > 
                <MapPin className="mr-2 h-4 w-4" />
                현재 위치로 설정
              </Button>
              */}
              <CurrentLocation
                onSelectAddress={handleAddressSelect}
                className="w-[30%] self-center"
              />

              {addressError && (
                <p className="text-sm text-red-500 mt-2">{addressError}</p>
              )}
              {isLoadingAddress && (
                <p className="text-sm text-gray-500 mt-2">
                  주소를 가져오는 중...
                </p>
              )}
            </div>

            <button
              onClick={() => setShowAddressSearch(false)}
              className="mt-4 w-full py-2 border rounded-md"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
