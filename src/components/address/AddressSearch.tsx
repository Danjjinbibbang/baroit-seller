"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export interface AddressData {
  roadAddress: string;
  jibunAddress: string;
  zonecode: string;
  buildingName?: string;
  latitude?: number;
  longitude?: number;
}

interface AddressSearchProps {
  onSelectAddress: (address: AddressData) => void;
  buttonLabel?: string;
  className?: string;
}

export function AddressSearch({
  onSelectAddress,
  buttonLabel = "주소 검색",
  className = "flex w-[30%] border border-black-300 rounded-md",
}: AddressSearchProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loadScripts = async () => {
      const loadScript = (src: string) =>
        new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.head.appendChild(script);
        });

      try {
        // 1. 다음 우편번호
        await loadScript(
          "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        );

        // 2. 카카오 지도 + services + autoload false
        await loadScript(
          `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY_JAVASCRIPT}&autoload=false&libraries=services`
        );

        // 3. kakao.maps 로드 (Geocoder 포함)
        window.kakao.maps.load(() => {
          console.log("카카오맵 services 로드 완료");
          setIsScriptLoaded(true);
        });
      } catch (e) {
        console.error("스크립트 로딩 실패", e);
      }
    };

    loadScripts();
  }, []);

  const openAddressSearch = () => {
    if (!isScriptLoaded) {
      console.error("카카오맵 스크립트가 아직 로드되지 않았습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        const addressToSearch = data.roadAddress || data.jibunAddress;

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(addressToSearch, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = result[0];
            const addressData: AddressData = {
              roadAddress: data.roadAddress || "",
              jibunAddress: data.jibunAddress || "",
              zonecode: data.zonecode || "",
              buildingName: data.buildingName || "",
              latitude: parseFloat(coords.y),
              longitude: parseFloat(coords.x),
            };
            onSelectAddress(addressData);
          } else {
            console.warn("좌표 변환 실패:", status);
            const addressData: AddressData = {
              roadAddress: data.roadAddress || "",
              jibunAddress: data.jibunAddress || "",
              zonecode: data.zonecode || "",
              buildingName: data.buildingName || "",
            };
            onSelectAddress(addressData);
          }
        });
      },
      width: "100%",
      height: "500px",
    }).open();
  };

  return (
    <Button
      onClick={openAddressSearch}
      className={className}
      disabled={!isScriptLoaded}
    >
      {buttonLabel}
    </Button>
  );
}

// 타입 정의
declare global {
  interface Window {
    daum: any;
    kakao: any;
  }
}
