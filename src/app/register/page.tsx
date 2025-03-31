// 회원가입 페이지
"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerCustomer } from "@/utils/register";

// 유효성 검사 스키마 정의
const registerSchema = z.object({
  userId: z
    .string()
    .min(4, "아이디는 최소 4자 이상이어야 합니다")
    .max(20, "아이디는 최대 20자까지 가능합니다"),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .regex(
      /^(?=.*[a-zA-Z])[A-Za-z\d@$!%*?&]{8,}$/,
      "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다"
    ),
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일 주소를 입력해주세요"),
  phone: z
    .string()
    .regex(
      /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
      "유효한 휴대폰 번호를 입력해주세요"
    ),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [emailChecked, setEmailChecked] = useState<boolean | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const watchEmail = watch("email");

  // 이메일 중복 확인 함수
  const handleCheckEmail = async () => {
    // 이메일 형식 검증
    const isValid = await trigger("email");
    if (!isValid) return;

    setLoading(true);

    try {
      // 실제 API 호출 (예시)
      // const response = await fetch('/api/check-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: watchEmail })
      // });
      // const data = await response.json();

      // 현재는 더미 응답으로 테스트 (랜덤하게 중복 여부 결정)
      const isDuplicate = Math.random() > 0.5;
      setEmailChecked(!isDuplicate);
      setShowEmailModal(true);
    } catch (error) {
      console.error("이메일 중복 확인 중 오류 발생:", error);
      setEmailChecked(false);
    } finally {
      setLoading(false);
    }
  };

  // 폼 제출 처리 함수
  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    if (emailChecked !== true) {
      alert("이메일 중복 확인이 필요합니다.");
      return;
    }

    setLoading(true);

    try {
      // 실제 API 호출 (예시)
      const response = await registerCustomer({
        loginId: data.userId,
        name: data.name,
        email: data.email,
        password: data.password,
        tel: data.phone,
      });
      if (response.customerId) {
        console.log("회원가입 데이터:", data);
        alert("회원가입이 완료되었습니다!");
        window.location.href = "/login";
      } else {
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error(
        "회원가입 중 오류 발생:",
        error instanceof Error ? error.message : String(error)
      );
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 이메일 모달 닫기
  const closeEmailModal = () => {
    setShowEmailModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center mt-4">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700"
            >
              아이디 <span className="text-red-500">*</span>
            </label>
            <input
              {...register("userId")}
              id="userId"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="아이디를 입력하세요"
            />
            {errors.userId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.userId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
            </p>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              id="name"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="이름을 입력하세요"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일 <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                {...register("email")}
                id="email"
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example@email.com"
              />
              <button
                type="button"
                onClick={handleCheckEmail}
                disabled={loading || !watchEmail}
                className="mt-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {loading ? "확인 중..." : "중복 확인"}
              </button>
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
            {emailChecked === true && (
              <p className="mt-1 text-sm text-green-600">
                사용 가능한 이메일입니다.
              </p>
            )}
            {emailChecked === false && (
              <p className="mt-1 text-sm text-red-600">
                이미 사용 중인 이메일이거나 확인 중 오류가 발생했습니다.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              휴대폰 번호 <span className="text-red-500">*</span>
            </label>
            <input
              {...register("phone")}
              id="phone"
              type="tel"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="010-0000-0000"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? "처리 중..." : "가입하기"}
            </button>
          </div>
        </form>
      </div>

      {/* 이메일 중복 확인 결과 모달 */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              이메일 중복 확인 결과
            </h3>
            <p className={emailChecked ? "text-green-600" : "text-red-600"}>
              {emailChecked
                ? "사용 가능한 이메일입니다."
                : "이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요."}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeEmailModal}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
