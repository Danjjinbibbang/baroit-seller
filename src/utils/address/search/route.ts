import { NextRequest, NextResponse } from "next/server";

// 카카오 API 키 설정 (하드코딩 - 테스트용)
const KAKAO_API_KEY = "6db9effce248799d2cc94307ea212995";

// 환경 변수 디버깅
console.log("환경 변수에서 가져온 키:", process.env.KAKAO_API_KEY);
console.log("하드코딩된 키:", KAKAO_API_KEY);

export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const page = searchParams.get("page") || "1";

    // 검색어 필수 체크
    if (!query) {
      return NextResponse.json(
        { error: "검색어를 입력해주세요." },
        { status: 400 }
      );
    }

    // 카카오 주소 검색 API 호출
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        query
      )}&page=${page}`,
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
        { error: errorData.message || "주소 검색 중 오류가 발생했습니다." },
        { status: response.status }
      );
    }

    // 검색 결과 반환
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("주소 검색 API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
