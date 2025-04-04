// 회원가입 처리 유틸 함수
interface CustomerSignUpData {
  loginId: string;
  name: string;
  email: string;
  password: string;
  tel: string;
}

interface SignUpResponse {
  customerId?: number;
}

export async function registerCustomer(
  data: CustomerSignUpData
): Promise<SignUpResponse> {
  try {
    const response = await fetch(`/api/auth/customers/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원가입에 실패했습니다.");
    }

    const result = await response.json();

    return {
      customerId: result.customerId,
    };
  } catch (error) {
    console.log("회원가입 실패: ", error);
    return { customerId: undefined };
  }
}
