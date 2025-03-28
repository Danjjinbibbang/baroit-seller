"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Address, AddressFormData } from "@/types/address";
import { MapPin, Search } from "lucide-react";
import { AddressSearch, AddressData } from "@/components/address/AddressSearch";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address: Address | null;
  customerId: number;
}

const DELIVERY_MESSAGES = [
  "문 앞에 두고 벨 눌러주세요",
  "문 앞에 두고 노크해주세요",
  "문 앞에 두면 가져갈게요(벨x, 노크x)",
  "직접 받을게요",
  "전화주시면 마중 나갈게요",
  "직접 입력",
];

export default function AddressFormModal({
  isOpen,
  onClose,
  onSuccess,
  address,
  customerId,
}: AddressFormModalProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    detailed: "",
    alias: "",
    riderMessage: null,
    entrancePassword: null,
    deliveryGuideMessage: "",
    road: "",
    jibun: "",
    latitude: 0,
    longitude: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customAlias, setCustomAlias] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
  const [isCustomMessageSelected, setIsCustomMessageSelected] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    if (address) {
      setFormData({
        detailed: address.detailed,
        alias: address.alias,
        riderMessage: address.riderMessage,
        entrancePassword: address.entrancePassword,
        deliveryGuideMessage: address.deliveryGuideMessage,
        road: address.road,
        jibun: address.jibun,
        latitude: address.latitude,
        longitude: address.longitude,
      });
    } else {
      setFormData({
        detailed: "",
        alias: "",
        riderMessage: null,
        entrancePassword: null,
        deliveryGuideMessage: "",
        road: "",
        jibun: "",
        latitude: 0,
        longitude: 0,
      });
    }
  }, [address]);

  // 신규 주소 등록
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = `/api/users/customers/${customerId}/addresses`;

      const method = "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          customerId,
        }),
      });

      if (!response.ok) {
        throw new Error("주소 저장 실패");
      }

      onSuccess();
    } catch (error) {
      console.error("주소 저장 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

        if (addressInfo.road_address) {
          roadAddress = addressInfo.road_address.address_name;
        }
        if (addressInfo.address) {
          jibunAddress = addressInfo.address.address_name;
        }

        setFormData({
          ...formData,
          detailed: roadAddress || jibunAddress,
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
    }
  };

  const handleAddressSelect = (address: AddressData) => {
    setFormData({
      ...formData,
      detailed: address.roadAddress || address.jibunAddress,
      road: address.roadAddress,
      jibun: address.jibunAddress,
      latitude: address.latitude,
      longitude: address.longitude,
    });
    setIsAddressSearchOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {address ? "배송지 수정" : "새 배송지 등록"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alias">배송지 구분</Label>
            <Select
              value={isOtherSelected ? "기타" : formData.alias}
              onValueChange={(value) => {
                if (value === "기타") {
                  setIsOtherSelected(true);
                } else {
                  setIsOtherSelected(false);
                  setFormData({ ...formData, alias: value });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {isOtherSelected
                    ? customAlias || "기타"
                    : formData.alias || "배송지 구분을 선택하세요"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="집">집</SelectItem>
                <SelectItem value="회사">회사</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
            {isOtherSelected && (
              <Input
                value={customAlias}
                onChange={(e) => {
                  setCustomAlias(e.target.value);
                  setFormData({
                    ...formData,
                    alias: e.target.value,
                  });
                }}
                placeholder="배송지 이름을 입력하세요"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailed">상세 주소</Label>
            <div className="flex mb-2 justify-between">
              <AddressSearch
                onSelectAddress={(selectedAddress) => {
                  setFormData({
                    ...formData,
                    detailed:
                      selectedAddress.roadAddress ||
                      selectedAddress.jibunAddress,
                    road: selectedAddress.roadAddress,
                    jibun: selectedAddress.jibunAddress,
                    latitude: selectedAddress.latitude || 0,
                    longitude: selectedAddress.longitude || 0,
                  });
                }}
                buttonLabel="주소 검색"
                className="flex w-[30%] border border-black-300 rounded-md"
              />
              <Button
                type="button"
                variant="outline"
                className="flex w-[30%]"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        handleLocationDetected({
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
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
            </div>

            <Input
              value={formData.detailed}
              readOnly
              placeholder="주소가 여기에 표시됩니다"
            />

            {addressError && (
              <p className="text-sm text-red-500">{addressError}</p>
            )}
            {isLoadingAddress && (
              <p className="text-sm text-gray-500">주소를 가져오는 중...</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entrancePassword">공동현관 비밀번호</Label>
            <Input
              id="entrancePassword"
              type="text"
              value={formData.entrancePassword || ""}
              onChange={(e) =>
                setFormData({ ...formData, entrancePassword: e.target.value })
              }
              placeholder="공동현관 비밀번호를 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label>배송 요청사항</Label>
            <Select
              value={
                isCustomMessageSelected
                  ? "직접 입력"
                  : formData.deliveryGuideMessage
              }
              onValueChange={(value) => {
                if (value === "직접 입력") {
                  setIsCustomMessageSelected(true);
                } else {
                  setIsCustomMessageSelected(false);
                  setFormData({ ...formData, deliveryGuideMessage: value });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {isCustomMessageSelected
                    ? customMessage || "직접 입력"
                    : formData.deliveryGuideMessage ||
                      "배송 요청사항을 선택하세요"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                {DELIVERY_MESSAGES.map((message) => (
                  <SelectItem
                    key={message}
                    value={message}
                    className="bg-transparent hover:bg-transparent"
                  >
                    {message}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isCustomMessageSelected && (
              <Input
                value={customMessage}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCustomMessage(newValue);
                  setFormData({
                    ...formData,
                    deliveryGuideMessage: newValue,
                  });
                }}
                placeholder="배송 요청사항을 직접 입력해주세요"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "저장 중..." : address ? "수정" : "저장"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
