// 상품 관련 API 유틸리티 함수들

export interface ProductCreateRequestSingle {
  name: string;
  description: string;
  displayCategoryId: number;
  storeCategoryIds: number[];
  imageUrls: string;
  fulfillmentMethod: "DELIVERY_ONLY";
  originalPrice: number;
  sellingPrice: number;
  stock: number;
}

export interface ProductCreateRequestOption {
  name: string;
  description: string;
  displayCategoryId: number;
  storeCategoryIds: number[];
  fulfillmentMethod: "DELIVERY_ONLY";
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
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "상품 등록에 실패했습니다.");
  }

  return res;
}

// 옵션 상품 등록
export async function postOptionProduct(
  storeId: number,
  productData: ProductCreateRequestOption
): Promise<Response> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "상품 등록에 실패했습니다.");
  }

  return res;
}
// 상품 조회
export async function getProduct(
  storeId: number,
  productId: number
): Promise<Response> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/products/${productId}`
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "상품 조회에 실패했습니다.");
  }

  return res;
}
