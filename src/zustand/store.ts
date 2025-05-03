import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreStatus } from "@/components/store/StoreExposure";
import { StoreWorking } from "@/components/store/StoreWorking";
import { DayOfWeek } from "@/utils/store";
import { StoreInfo } from "@/components/store/StoreBasicInfo";

// 스토어 상태 인터페이스
interface StoreState {
  storeInfo: StoreInfo | null;
  isStoreCreated: boolean;

  // 액션
  setStoreInfo: (storeInfo: StoreInfo) => void;
  updateStoreInfo: (updates: Partial<StoreInfo>) => void;
  setStoreCreated: (created: boolean) => void;
  setStoreId: (id: number) => void;
  //clearStoreInfo: () => void;
}

// 기본 가게 정보 상태
const defaultStoreInfo: StoreInfo = {
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
};
// storeId를 저장하기 위한 스토어 추가
export const useStoreIdStore = create<{
  storeId: number | null;
  setStoreIdToLocal: (id: number | null) => void;
}>()(
  persist(
    (set) => ({
      storeId: null,
      setStoreIdToLocal: (id) => set({ storeId: id }),
    }),
    {
      name: "store-id-storage", // 별도의 localStorage 키
    }
  )
);

// Zustand 스토어 생성 (persist 미들웨어로 localStorage에 저장)
export const useStoreInfoStore = create<StoreState>()(
  persist(
    (set) => ({
      storeInfo: null,
      isStoreCreated: false,

      // 가게 정보 설정
      setStoreInfo: (storeInfo) => set({ storeInfo }),

      // 가게 정보 일부 업데이트
      updateStoreInfo: (updates) =>
        set((state) => {
          console.log("updateStoreInfo 호출:", updates);
          console.log("현재 상태:", state.storeInfo);

          const updatedInfo = state.storeInfo
            ? { ...state.storeInfo, ...updates }
            : { ...defaultStoreInfo, ...updates };

          console.log("업데이트된 정보:", updatedInfo);

          return {
            storeInfo: updatedInfo,
          };
        }),

      // 가게 생성 상태 설정
      setStoreCreated: (created) => set({ isStoreCreated: created }),

      // 가게 ID 설정
      setStoreId: (id) =>
        set((state) => ({
          storeInfo: state.storeInfo
            ? { ...state.storeInfo, storeId: id }
            : { ...defaultStoreInfo, storeId: id },
          isStoreCreated: true,
        })),

      // 가게 정보 초기화
      //clearStoreInfo: () => set({ storeInfo: null, isStoreCreated: false }),
    }),
    {
      name: "store-info-storage", // localStorage 키
      //skipHydration: true, // 자동저장 끄기
      partialize: (state) => ({
        storeInfo: state.storeInfo,
        isStoreCreated: state.isStoreCreated,
      }),
    }
  )
);
