import { NextRequest, NextResponse } from "next/server";

// 카카오 API 키 설정 (하드코딩 - 테스트용)
//const KAKAO_API_KEY = "56f434c41d98f8050bf144398f9670c2";

// 환경 변수 디버깅
const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
console.log("환경 변수에서 가져온 키:", KAKAO_API_KEY);
//console.log("하드코딩된 키:", KAKAO_API_KEY);

export async function AddressData(request: NextRequest) {
  try {
    // URL 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    // 위도, 경도 필수 체크
    if (!lat || !lng) {
      return NextResponse.json(
        { error: "위도와 경도 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // 카카오 역지오코딩 API 호출
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
          "Content-Type": "application/json;charset=UTF-8",
          // 다양한 KA 헤더 형식 시도
          KA: "sdk/4.0.0",
          "User-Agent": "Mozilla/5.0",
          Referer: "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      }
    );

    // 응답 처리
    if (!response.ok) {
      const errorData = await response.json();
      console.error("카카오 API 오류:", errorData);
      return NextResponse.json(
        { error: errorData.message || "주소 변환 중 오류가 발생했습니다." },
        { status: response.status }
      );
    }

    // 변환 결과 반환
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("역지오코딩 API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
