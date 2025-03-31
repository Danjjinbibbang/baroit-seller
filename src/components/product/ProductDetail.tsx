"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

// 상품 데이터 타입 정의
export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  storeName: string;
  price: number;
  discountRate?: number;
  mainImage: string;
  images?: string[];
  certifications?: string[];
  description: string;
  notice?: string;
  detailDescription: string;
  returnPolicy: string;
  minPurchaseQuantity: number;
  maxPurchaseQuantity: number;
  unit: string;
  options: ProductOption[];
}

// 임시 상품 데이터
const productData: Product = {
  id: "1",
  name: "무농약 당근 (1kg 내외)",
  storeName: "산지직송 농장",
  price: 6900,
  discountRate: 10,
  mainImage:
    "https://images.unsplash.com/photo-1598170845058-32b9d6a5d4c4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
  images: [
    "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1633204339691-9d3647204d39?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
  ],
  certifications: ["무농약", "친환경"],
  description:
    "신선하고 아삭한 무농약 당근입니다. 산지직송으로 더욱 신선하게 배송됩니다.",
  notice:
    "천재지변으로 인한 작황에 따라 일부 상품의 크기 및 중량의 차이가 있을 수 있습니다.",
  detailDescription: `# 상품 상세 정보

## 상품 특징
- 무농약 재배 방식으로 재배된 건강한 당근입니다.
- 아삭한 식감과 단맛이 특징입니다.
- 산지에서 직접 수확 후 배송되어 신선도가 높습니다.

## 보관 방법
- 냉장 보관하시면 더욱 오래 신선하게 드실 수 있습니다.
- 흙이 묻어있는 경우 바로 세척하지 마시고 필요할 때 세척해서 드세요.

## 원산지
- 국내산 (강원도 횡성)`,
  returnPolicy: `# 교환 및 반품 안내

## 교환 및 반품이 가능한 경우
- 상품을 공급받은 날로부터 7일 이내에 신청 가능합니다.
- 상품이 표시된 정보와 상이할 경우 공급받은 날로부터 3개월 이내, 그 사실을 안 날로부터 30일 이내에 신청 가능합니다.

## 교환 및 반품이 불가능한 경우
- 신선식품의 특성상 고객님의 단순변심에 의한 교환 및 반품은 불가능합니다.
- 고객님의 책임 있는 사유로 상품이 훼손된 경우 교환 및 반품이 불가능합니다.

## 교환 및 반품 절차
- 고객센터(1234-5678)로 연락하여 교환/반품 신청을 해주세요.
- 담당자의 안내에 따라 상품을 보내주시면 확인 후 처리해 드립니다.`,
  minPurchaseQuantity: 1,
  maxPurchaseQuantity: 10,
  unit: "개",
  options: [
    {
      name: "크기",
      values: ["소", "중", "대"],
    },
  ],
};

export default function ProductDetail() {
  const [expandedSections, setExpandedSections] = useState<{
    detail: boolean;
    returnPolicy: boolean;
  }>({
    detail: false,
    returnPolicy: false,
  });

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});

  const [quantity, setQuantity] = useState(productData.minPurchaseQuantity);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(productData.mainImage);

  // 섹션 토글 핸들러
  const toggleSection = (section: "detail" | "returnPolicy") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 수량 변경 핸들러
  const changeQuantity = (amount: number) => {
    const newQuantity = quantity + amount;
    if (
      newQuantity >= productData.minPurchaseQuantity &&
      newQuantity <= productData.maxPurchaseQuantity
    ) {
      setQuantity(newQuantity);
    }
  };

  // 옵션 선택 핸들러
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // 할인가 계산
  const discountedPrice = productData.discountRate
    ? Math.floor(productData.price * (1 - productData.discountRate / 100))
    : productData.price;

  // 총 가격 계산
  const totalPrice = discountedPrice * quantity;

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* 상품 상단 정보 */}
      <div className="flex flex-col md:flex-row gap-8 pb-8 border-b">
        {/* 상품 이미지 영역 */}
        <div className="w-full md:w-1/2">
          <div className="mb-2 rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt={productData.name}
              className="w-full h-auto object-cover aspect-square"
            />
          </div>
          {productData.images && productData.images.length > 0 && (
            <div className="flex gap-2 mt-2">
              <div
                className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer ${
                  selectedImage === productData.mainImage
                    ? "border-2 border-blue-500"
                    : "border border-gray-200"
                }`}
                onClick={() => setSelectedImage(productData.mainImage)}
              >
                <img
                  src={productData.mainImage}
                  alt="메인 이미지"
                  className="w-full h-full object-cover"
                />
              </div>
              {productData.images.map((img, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer ${
                    selectedImage === img
                      ? "border-2 border-blue-500"
                      : "border border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`상품 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 상품 정보 영역 */}
        <div className="w-full md:w-1/2">
          <p className="text-gray-500 text-sm mb-1">{productData.storeName}</p>
          <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>

          {/* 가격 정보 */}
          <div className="mb-4">
            {productData.discountRate && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-500 font-bold">
                  {productData.discountRate}%
                </span>
                <span className="text-gray-400 line-through">
                  {productData.price.toLocaleString()}원
                </span>
              </div>
            )}
            <div className="text-2xl font-bold">
              {discountedPrice.toLocaleString()}원
            </div>
          </div>

          {/* 인증 정보 */}
          {productData.certifications &&
            productData.certifications.length > 0 && (
              <div className="mb-4">
                <div className="flex gap-2">
                  {productData.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* 상품 설명 */}
          <div className="mb-4">
            <p className="text-gray-700">{productData.description}</p>
          </div>

          {/* 주의사항 */}
          {productData.notice && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">{productData.notice}</p>
            </div>
          )}

          {/* 구매 버튼 */}
          <button
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => setShowPurchaseModal(true)}
          >
            구매하기
          </button>
        </div>
      </div>

      {/* 상품 상세 정보 & 반품/교환 안내 */}
      <div className="mt-8 space-y-4">
        {/* 상품 상세 정보 */}
        <div className="border rounded-md overflow-hidden">
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection("detail")}
          >
            <h2 className="text-lg font-medium">상품 상세 정보</h2>
            {expandedSections.detail ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {expandedSections.detail && (
            <div className="p-4 whitespace-pre-line">
              {productData.detailDescription}
            </div>
          )}
        </div>

        {/* 반품/교환 안내 */}
        <div className="border rounded-md overflow-hidden">
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection("returnPolicy")}
          >
            <h2 className="text-lg font-medium">반품/교환 안내</h2>
            {expandedSections.returnPolicy ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {expandedSections.returnPolicy && (
            <div className="p-4 whitespace-pre-line">
              {productData.returnPolicy}
            </div>
          )}
        </div>
      </div>

      {/* 구매 모달 */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center md:items-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-xl md:rounded-xl overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">상품 구매</h3>
                <button
                  className="text-gray-500"
                  onClick={() => setShowPurchaseModal(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-medium mb-2">{productData.name}</h4>
                <p className="text-xl font-bold">
                  {discountedPrice.toLocaleString()}원
                </p>
              </div>

              {/* 옵션 선택 */}
              {productData.options.map((option, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {option.name}
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedOptions[option.name] || ""}
                    onChange={(e) =>
                      handleOptionChange(option.name, e.target.value)
                    }
                  >
                    <option value="">선택하세요</option>
                    {option.values.map((value, idx) => (
                      <option key={idx} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* 수량 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  수량 (최소 {productData.minPurchaseQuantity}
                  {productData.unit} ~ 최대 {productData.maxPurchaseQuantity}
                  {productData.unit})
                </label>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                    onClick={() => changeQuantity(-1)}
                    disabled={quantity <= productData.minPurchaseQuantity}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    className="w-16 text-center border-x"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (
                        !isNaN(val) &&
                        val >= productData.minPurchaseQuantity &&
                        val <= productData.maxPurchaseQuantity
                      ) {
                        setQuantity(val);
                      }
                    }}
                    min={productData.minPurchaseQuantity}
                    max={productData.maxPurchaseQuantity}
                  />
                  <button
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                    onClick={() => changeQuantity(1)}
                    disabled={quantity >= productData.maxPurchaseQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 총 금액 */}
              <div className="flex justify-between items-center mb-4 pt-4 border-t">
                <span className="text-sm font-medium">총 금액</span>
                <span className="text-xl font-bold">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>

              {/* 구매 및 장바구니 버튼 */}
              <div className="flex gap-2">
                <Link
                  className="flex-1 py-3 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                  href="/cart"
                >
                  <ShoppingBag className="w-5 h-5 mr-1" />
                  장바구니
                </Link>
                <button className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center">
                  <CreditCard className="w-5 h-5 mr-1" />
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
