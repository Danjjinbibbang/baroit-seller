"use client";

import React, { useState } from "react";
import { registerStore } from "@/utils/store"; // 등록 API
import { Button } from "@/components/ui/button";
import { AddressSearch } from "../address/AddressSearch";
import { MapPin } from "lucide-react";
import { CurrentLocation } from "../address/CurrentLocation";

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
  orderType: "DELIVERY" | "PICKUP" | "BOTH";
  deliveryType: "SELF" | "AGENCY" | "BOTH";
  minOrderPrice: number;
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
    orderType: "DELIVERY",
    deliveryType: "SELF",
    minOrderPrice: 15000,
  });

  const [isEditing, setIsEditing] = useState(true); // 기본값은 편집 가능 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [showAddressSearch, setShowAddressSearch] = useState(false);

  // 현재 위치를 받아와서 주소로 변환하는 함수
  const handleLocationDetected = async (location: {
    lat: number;
    lng: number;
  }) => {
    setIsLoadingAddress(true);
    setAddressError(null);

    try {
      const response = await fetch(
        `/api/address/reverse-geocode?lat=${location.lat}&lng=${location.lng}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "주소를 가져오는데 실패했습니다.");
      }

      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const addressInfo = data.documents[0];
        let roadAddress = "";
        let jibunAddress = "";
        let latitude = location.lat;
        let longitude = location.lng;
        console.log(latitude, longitude);

        if (addressInfo.road_address) {
          roadAddress = addressInfo.road_address.address_name;
        }
        if (addressInfo.address) {
          jibunAddress = addressInfo.address.address_name;
        }

        setStoreInfo({
          ...storeInfo,
          road: roadAddress,
          jibun: jibunAddress,
          latitude: latitude,
          longitude: longitude,
        });
      } else {
        setAddressError("주소를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("주소 변환 오류:", error);
      setAddressError("주소를 가져오는데 실패했습니다.");
    } finally {
      setIsLoadingAddress(false);
      setShowAddressSearch(false);
    }
  };

  // 주소 검색 결과 처리
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
      await registerStore(storeInfo); // 실제 저장 처리
      alert("가게 정보가 저장되었습니다.");
      setIsEditing(false);
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
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              저장
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="ml-auto"
          >
            수정
          </Button>
        )}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            onClick={() => isEditing && setShowAddressSearch(true)}
          />
          {isEditing && (
            <button
              onClick={() => setShowAddressSearch(true)}
              className="px-4 py-2 border rounded-md bg-gray-50"
            >
              주소 검색
            </button>
          )}
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
          disabled={!isEditing}
          className="w-full mt-2 p-2 border rounded-md"
          placeholder="상세주소"
        />
      </div>

      {/* 주문 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            주문 유형
          </label>
          <select
            value={storeInfo.orderType}
            onChange={(e) =>
              setStoreInfo((prev) => ({
                ...prev,
                orderType: e.target.value as StoreInfo["orderType"],
              }))
            }
            disabled={!isEditing}
            className="w-full p-2 border rounded-md"
          >
            <option value="DELIVERY">배달</option>
            <option value="PICKUP">포장</option>
            <option value="BOTH">배달/포장</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            배달 유형
          </label>
          <select
            value={storeInfo.deliveryType}
            onChange={(e) =>
              setStoreInfo((prev) => ({
                ...prev,
                deliveryType: e.target.value as StoreInfo["deliveryType"],
              }))
            }
            disabled={!isEditing}
            className="w-full p-2 border rounded-md"
          >
            <option value="SELF">자체배달</option>
            <option value="AGENCY">배달대행</option>
            <option value="BOTH">자체/대행</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            최소주문금액
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
            disabled={!isEditing}
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
