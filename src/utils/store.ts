// 가게 관련 API 유틸리티 함수들

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface BusinessHours {
  mode: string;
  timeSlots: Record<DayOfWeek, TimeSlot>;
}

interface StoreData {
  name: string;
  detailed: string;
  tel: string;
  bizNumber: string;
  addressCode: string;
  addressDetail: string;
  jibun: string;
  road: string;
  latitude: number;
  longitude: number;
  minOrderPrice: number;
  deliveryType: string;
  deliveryTimeEstimate: number;
  deliveryPickup: number;
  businessHoursMode: string;
  timeSlots: Record<DayOfWeek, TimeSlot>;
  workCondition: string;
  status: string;
}

interface CategoryResponse {
  success: boolean;
  data: {
    storeCategoryId: number;
    categoryName: string;
  };
}

interface HomeCategoryResponse {
  success: boolean;
  data: {
    storeId: number;
    categories: categories[];
  };
}

interface categories {
  id: number;
  name: string;
}

// 가게 등록 API
export async function registerStore(
  storeData: StoreData
): Promise<{ storeId: number }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storeData),
      credentials: "include",
    }
  );
  const data = await response.json();
  if (!data.success) {
    throw new Error("가게 등록에 실패했습니다.");
  }

  return data;
}

// 가게 운영 상태 변경
export async function updateStoreStatus(
  storeId: number,
  workCondition: string
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/work-condition`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workCondition }),
      credentials: "include",
    }
  );
  const data = await response.json();

  if (!data.success) {
    throw new Error("가게 영업 상태 변경에 실패했습니다.");
  }
}

// 가게 노출 상태 수정
export async function updateStoreExposure(
  storeId: number,
  status: string
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/visibility`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
      credentials: "include",
    }
  );
  const data = await response.json();

  if (!data.success) {
    throw new Error("가게 노출 상태 수정에 실패했습니다.");
  }
}

//가게 영업시간 수정
export async function updateBusinessHours(
  storeId: number,
  businessHours: BusinessHours
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/business-hours`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(businessHours),
      credentials: "include",
    }
  );
  const data = await response.json();

  if (!data.success) {
    throw new Error("가게 영업시간 수정에 실패했습니다.");
  }
}

// 가게 홈 카테고리 생성 API
export async function createHomeCategory(
  storeId: number,
  categoryData: { name: string }
): Promise<CategoryResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/categories`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
      credentials: "include",
    }
  );
  const data = await response.json();

  if (!data.success) {
    throw new Error("가게 홈 카테고리 생성에 실패했습니다.");
  }

  return data;
}

// 가게 홈 카테고리 조회 API
export async function getHomeCategories(
  storeId: number
): Promise<HomeCategoryResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/categories`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error("가게 홈 카테고리 조회에 실패했습니다.");
  }

  return data;
}

// 가게 홈 카테고리 삭제 API
export async function deleteHomeCategory(
  storeId: number,
  categoryId: number
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/categories/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    }
  );
  const data = await response.json();
  if (!data.success) {
    throw new Error("가게 홈 카테고리 삭제에 실패했습니다.");
  }
}

// 가게 홈 카테고리 수정 API
export async function updateHomeCategory(
  storeId: number,
  categoryId: number,
  categoryData: { name: string }
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/categories/${categoryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
      credentials: "include",
    }
  );
  const data = await response.json();
  if (!data.success) {
    throw new Error("가게 홈 카테고리 수정에 실패했습니다.");
  }
}

// 가게 정보 수정 API
// export async function updateStore(storeId: number, storeData: any): Promise<any> {
//   const response = await fetch(`/api/stores/${storeId}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(storeData),
//   });

//   if (!response.ok) {
//     throw new Error('가게 정보 수정에 실패했습니다.');
//   }

//   return response.json();
// }

// 가게 목록 조회 API
// export async function fetchStores(): Promise<any[]> {
//   const response = await fetch('/api/stores', {
//     method: 'GET',
//   });

//   if (!response.ok) {
//     throw new Error('가게 목록 조회에 실패했습니다.');
//   }

//   return response.json();
// }
