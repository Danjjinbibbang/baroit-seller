// 상품 관련 API 유틸리티 함수들

import { useAuthStore } from "@/zustand/auth";

export interface ProductCreateRequestSingle {
  name: string;
  description: string;
  displayCategoryId: number;
  storeCategoryIds: number[];
  imageUrl: string;
  fulfillmentMethod: string;
  originalPrice: number;
  sellingPrice: number;
  stock: number;
}

export interface ProductCreateRequestOption {
  name: string;
  description: string;
  displayCategoryId: number;
  storeCategoryIds: number[];
  fulfillmentMethod: string;
  optionGroups: OptionGroup[];
  variants: Variant[];
}

export interface OptionGroup {
  name: string; // ex: "컬러", "사이즈"
  values: string[];
}

export interface Variant {
  optionValues: optionValues[];
  originalPrice: number;
  sellingPrice: number;
  stock: number;
}

export interface optionValues {
  optionName: string;
  optionValue: string;
}

interface GetProductResponse {
  success: boolean;
  data: {
    storeId: number;
    name: string;
    description: string;
    registeredId: string;
    fulfillmentMethod: string;
    hasOption: boolean;
    originalPrice: number | null;
    sellingPrice: number | null;
    stock: number | null;
    displayCategoryId: number;
    storeCategoryIds: number[];
    options: {
      optionId: number;
      optionName: string;
      values: {
        optionValueId: number;
        value: string;
      }[];
    }[];
    variants: {
      id: number;
      displayName: string;
      originalPrice: number;
      sellingPrice: number;
      stock: number;
    }[];
  };
}

// export interface ProductOption {
//   values: string[]; // 단일 옵션이라도 배열로 구성됨
//   originalPrice: number;
//   sellingPrice: number;
//   stock: number;
//   reorderMultiple: number;
//   minPurchaseQty: number;
//   maxPurchaseQty: number;
//   active: boolean;
// }

// 단일 상품 등록
export async function postSingleProduct(
  storeId: number,
  productData: ProductCreateRequestSingle
): Promise<Response> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/products/single`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
      credentials: "include",
    }
  );

  if (res.status === 401) {
    console.log("401 발생, 세션 만료");
    useAuthStore.getState().logout();
    window.location.href = "/login";
    throw new Error("세션 만료");
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error("상품 등록에 실패했습니다.");
  }

  return data;
}

// 옵션 상품 등록
export async function postOptionProduct(
  storeId: number,
  productData: ProductCreateRequestOption
): Promise<Response> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/products/variant`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
      credentials: "include",
    }
  );
  if (res.status === 401) {
    console.log("401 발생, 세션 만료");
    useAuthStore.getState().logout();
    window.location.href = "/login";
    throw new Error("세션 만료");
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error("상품 등록에 실패했습니다.");
  }

  return data;
}

// 사장님 상품 조회
export async function getProductForSeller(
  storeId: number,
  productId: number
): Promise<GetProductResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/details?storeId=${storeId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (res.status === 401) {
    console.log("401 발생, 세션 만료");
    useAuthStore.getState().logout();
    window.location.href = "/login";
    throw new Error("세션 만료");
  }

  const data = await res.json();

  if (!data.success) {
    const error = await res.json();
    throw new Error(error.message || "상품 조회에 실패했습니다.");
  }
  return data;
}
