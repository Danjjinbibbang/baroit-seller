import { create } from "zustand";
import { User } from "@/types/user";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // 초기화 상태 추가

  // 액션
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setInitialized: (initialized: boolean) => void; // 초기화 상태 설정

  // 인증 확인 및 리다이렉트 기능
  requireAuth: (action?: () => void) => boolean;
  redirectToLogin: () => void;
}

// persist 미들웨어를 사용해 로컬 스토리지에 상태 저장
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,

      setInitialized: (initialized) => set({ isInitialized: initialized }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isInitialized: true,
        }),

      logout: () => {
        // 로그아웃 시 로컬 스토리지에서도 제거
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
        }
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      // 인증 필요 확인 함수
      requireAuth: (action) => {
        // 현재 인증 상태 확인
        const { isAuthenticated, isInitialized } = get();

        // 초기화 상태 확인
        if (!isInitialized) {
          // 초기화되지 않은 경우 세션 확인
          const sessionValid = checkIsAuthenticated();
          if (!sessionValid) {
            alert("로그인이 필요한 서비스입니다.");
            get().redirectToLogin();
            return false;
          }
        }

        // 이미 초기화된 상태에서 인증 확인
        if (!isAuthenticated) {
          alert("로그인이 필요한 서비스입니다.");
          get().redirectToLogin();
          return false;
        }

        // 인증된 경우 선택적으로 액션 실행
        if (action) {
          action();
        }
        return true;
      },

      // 로그인 페이지로 리다이렉트 함수
      redirectToLogin: () => {
        if (typeof window !== "undefined") {
          // 현재 경로 저장 (로그인 후 원래 페이지로 돌아올 수 있도록)
          const currentPath = window.location.pathname;
          if (currentPath !== "/login") {
            sessionStorage.setItem("redirectAfterLogin", currentPath);
            window.location.href = "/login";
          }
        }
      },
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 키
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

// 인증 상태를 확인하고 필요시 사용자 정보 로드
export const checkIsAuthenticated = (): boolean => {
  const { isAuthenticated, isInitialized, setInitialized } =
    useAuthStore.getState();

  // 이미 인증된 경우
  if (isAuthenticated) {
    if (!isInitialized) setInitialized(true);
    return true;
  }

  // 세션 쿠키 확인
  const hasCookie = checkSessionCookie();
  console.log("세션 쿠키 확인:", hasCookie);

  // 쿠키가 있으면 사용자 정보 가져오기
  if (hasCookie) {
    // 비동기로 사용자 정보 가져오기 시작
    fetchUserInfo()
      .then(() => {
        setInitialized(true);
        console.log("사용자 정보 로드 완료");
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 실패:", error);
        useAuthStore.getState().logout();
        setInitialized(true);
      });
  } else {
    // 세션이 없는 경우에도 초기화 완료로 표시
    setInitialized(true);
  }

  return hasCookie;
};

// 세션 쿠키 확인 함수
const checkSessionCookie = (): boolean => {
  if (typeof document === "undefined") return false; // SSR 환경에서 실행 방지

  // 세션 쿠키 확인 (세션 쿠키 이름은 실제 사용하는 이름으로 변경)
  const hasCookie = document.cookie
    .split(";")
    .some(
      (cookie) =>
        cookie.trim().startsWith("sessionId=") ||
        cookie.trim().startsWith("JSESSIONID=")
    );

  // 디버깅용 로그
  console.log("쿠키 확인:", document.cookie, "세션 있음:", hasCookie);
  return hasCookie;
};

// 사용자 정보 가져오기 함수
const fetchUserInfo = async (): Promise<void> => {
  try {
    // 세션 쿠키가 있으면 로그인 상태로 간주
    // 실제 정보는 로그인할 때 이미 저장되어 있음
    useAuthStore.getState().setInitialized(true);
    useAuthStore.getState().setUser({
      ownerId: localStorage.getItem("ownerId") || "",
    });
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
    throw error;
  }
};

// 인증이 필요한 페이지에서 사용할 훅
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    // 초기화 되지 않았다면 인증 상태 확인
    if (!isInitialized) {
      checkIsAuthenticated();
    } else if (!isAuthenticated) {
      alert("로그인이 필요한 페이지입니다.");

      // 현재 경로 저장하고 로그인 페이지로 이동
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        sessionStorage.setItem("redirectAfterLogin", currentPath);
        router.push("/login");
      }
    }
  }, [isAuthenticated, isInitialized, router]);

  return { isAuthenticated, isInitialized };
}
