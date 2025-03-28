"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/address";
import { Home, Building2, Trash2, Edit2, Plus } from "lucide-react";
import AddressFormModal from "./AddressFormModal";

interface AddressListModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number;
}

const DUMMY_ADDRESSES: Address[] = [
  {
    addressId: 1,
    customerId: 1,
    alias: "집",
    detailed: "101동 1004호",
    road: "서울특별시 강남구 테헤란로 427",
    jibun: "서울특별시 강남구 삼성동 159",
    latitude: 37.50637,
    longitude: 127.05332,
    isDefault: true,
    entrancePassword: "1234*",
    deliveryGuideMessage: "문 앞에 두고 벨 눌러주세요",
    riderMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    addressId: 2,
    customerId: 1,
    alias: "회사",
    detailed: "15층",
    road: "서울특별시 강남구 역삼로 172",
    jibun: "서울특별시 강남구 역삼동 737",
    latitude: 37.49455,
    longitude: 127.03322,
    isDefault: false,
    entrancePassword: null,
    deliveryGuideMessage: "직접 받을게요",
    riderMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    addressId: 3,
    customerId: 1,
    alias: "학교",
    detailed: "공학관 3층",
    road: "서울특별시 서대문구 연세로 50",
    jibun: "서울특별시 서대문구 신촌동 134",
    latitude: 37.56538,
    longitude: 126.93778,
    isDefault: false,
    entrancePassword: "9876#",
    deliveryGuideMessage: "정문 경비실에 맡겨주세요",
    riderMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function AddressListModal({
  isOpen,
  onClose,
  customerId,
}: AddressListModalProps) {
  const [addresses, setAddresses] = useState<Address[]>(DUMMY_ADDRESSES); // 더미데이터
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  const fetchAddresses = async () => {
    try {
      // const response = await fetch(`/api/users/customers/addresses`);
      // const data: AddressResponse = await response.json();
      // setAddresses(data.addresses);
      setAddresses(DUMMY_ADDRESSES);
      setIsLoading(false);
    } catch (error) {
      console.error("주소 목록 조회 실패:", error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (addressId: number) => {
    if (!confirm("이 주소를 삭제하시겠습니까?")) return;

    try {
      await fetch(`/api/users/customers/addresses/${addressId}`, {
        method: "DELETE",
      });
      setAddresses(addresses.filter((addr) => addr.addressId !== addressId));
    } catch (error) {
      console.error("주소 삭제 실패:", error);
    }
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsFormModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setIsFormModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>배송지 관리</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              onClick={handleAddNew}
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />새 배송지 추가
            </Button>

            {isLoading ? (
              <div className="text-center py-4">로딩 중...</div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                등록된 배송지가 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.addressId}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {address.alias === "집" ? (
                          <Home className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Building2 className="w-5 h-5 text-green-500" />
                        )}
                        <span className="font-medium">{address.alias}</span>
                        {address.isDefault && (
                          <span className="text-sm text-blue-500">
                            기본 배송지
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(address)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(address.addressId)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>{address.road}</div>
                      <div>{address.detailed}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddressFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedAddress(null);
        }}
        onSuccess={() => {
          fetchAddresses();
          setIsFormModalOpen(false);
          setSelectedAddress(null);
        }}
        address={selectedAddress}
        customerId={customerId}
      />
    </>
  );
}
