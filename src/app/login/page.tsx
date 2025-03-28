"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginBusiness } from "@/utils/auth";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 카카오 로그인 처리 함수
  const handleKakaoLogin = () => {
    const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
    const REDIRECT_URI = "http://localhost:3000/auth/kakao";

    // 카카오 로그인 페이지로 리다이렉트
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  };

  // 네이버 로그인 처리 함수
  const handleNaverLogin = () => {
    const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_APP_KEY;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
    const STATE = Math.random().toString(36).substr(2, 11); // 랜덤 상태 값 생성

    // 세션 스토리지에 상태 값 저장 (CSRF 방지용)
    sessionStorage.setItem("naverLoginState", STATE);

    // 네이버 로그인 페이지로 리다이렉트
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loginData = { loginId: userId, password };
      const response = await loginBusiness(loginData);

      // 로그인 성공 시 메인 페이지로 리다이렉트
      if (response != null) {
        window.location.href = "/";
      }
    } catch (err: unknown) {
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      console.error(
        "로그인 오류:",
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto px-4 py-8 min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

        {/* 자체 로그인 폼 */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-y-4 mb-6 w-[80%]"
        >
          <div className="flex flex-col gap-y-2">
            <label htmlFor="userId" className="block text-sm font-medium mb-1">
              아이디
            </label>
            <Input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
              className="w-full"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 hover:text-orange-500"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </form>

        {/* 로그인 방법 구분선 */}
        <div className="relative my-8 w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">간편로그인</span>
          </div>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="mb-8 flex justify-center items-center gap-x-4">
          {/* 카카오 로그인 */}
          <button onClick={handleKakaoLogin}>
            <img
              src="/kakao_logo.svg"
              alt="카카오"
              className="w-10 h-10"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.textContent = "K";
              }}
            />
          </button>

          {/* 네이버 로그인 */}
          <button onClick={handleNaverLogin}>
            <img
              src="/naver_logo.svg"
              alt="네이버"
              className="w-10 h-10"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.textContent = "N";
              }}
            />
          </button>
        </div>

        {/* 회원가입 버튼 */}
        <div className="text-center w-full">
          <p className="text-sm text-gray-600 mb-2">아직 회원이 아니신가요?</p>
          <Link href="/register" className="w-full block">
            <Button className="w-full hover:text-blue-600">회원가입하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
