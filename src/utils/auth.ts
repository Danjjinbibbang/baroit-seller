import { useAuthStore } from "@/zustand/auth";

// 고객 인증 관련 인터페이스

interface BusinessLoginData {
  loginId: string;
  password: string;
}

interface OwnerLoginData {
  success: boolean;
  data: {
    ownerId: string;
    nickname: string;
  };
}

// 사업자 계정 로그인
export async function loginBusiness(
  loginData: BusinessLoginData
): Promise<OwnerLoginData> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/owners/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error("사업자 로그인에 실패했습니다.");
  } else {
    // 로그인 성공 시 zustand에 저장
    useAuthStore.getState().login(data.data);
  }
  return data;
}
