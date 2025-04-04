// 고객 인증 관련 인터페이스
interface LoginData {
  loginId: string;
  password: string;
}

interface BusinessLoginData {
  loginId: string;
  password: string;
}

interface LoginResponse {
  name: string;
}

interface CustomerProfile {
  customerId: number;
  loginId: string;
  nickname: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string;
  socialAccounts: {
    apple: boolean;
    kakao: boolean;
  };
}

interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  uploadUrl: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}
// 프로필 정보 조회
export async function getCustomerProfile(): Promise<CustomerProfile> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/my/profile`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("프로필 정보 조회에 실패했습니다.");
  }

  return response.json();
}

// 프로필 이미지 업로드 URL 발급
export async function getProfileImageUploadUrl(
  data: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/my/profile-image/upload-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("업로드 URL 발급에 실패했습니다.");
  }

  return response.json();
}

// 프로필 이미지 등록
export async function registerProfileImage(imageUrl: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/my/profile-image`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    }
  );

  if (!response.ok) {
    throw new Error("프로필 이미지 등록에 실패했습니다.");
  }
}

// 비밀번호 변경
export async function changePassword(data: PasswordChangeData): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/my/password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("비밀번호 변경에 실패했습니다.");
  }
}

// 닉네임 변경
export async function changeNickname(nickname: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/my/nickname`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname }),
    }
  );

  if (!response.ok) {
    throw new Error("닉네임 변경에 실패했습니다.");
  }
}

// 사업자 계정 로그인
export async function loginBusiness(data: BusinessLoginData): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/owners/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("사업자 로그인에 실패했습니다.");
  }

  return response.json();
}
