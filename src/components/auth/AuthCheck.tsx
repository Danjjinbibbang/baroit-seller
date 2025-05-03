"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/utils/useAuth";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, setUser } = useAuthUser();

  useEffect(() => {
    // 쿠키에서 세션 확인
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find(cookie => 
        cookie.trim().startsWith('session=')
      );

      if (!sessionCookie) {
        router.push('/login');
        return;
      }

      try {
        // 세션 쿠키가 있다면 사용자를 인증된 것으로 간주
        // 필요한 경우 쿠키에서 사용자 정보를 파싱할 수 있습니다
        setUser({
          // 세션 쿠키에 저장된 기본 정보만 사용
          isAuthenticated: true
        });
      } catch (error) {
        router.push('/login');
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, router, setUser]);

  // 인증 체크 중에는 아무것도 렌더링하지 않음
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}