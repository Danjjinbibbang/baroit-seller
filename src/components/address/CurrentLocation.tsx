"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface AddressData {
  roadAddress: string;
  jibunAddress: string;
  zonecode: string;
  latitude: number;
  longitude: number;
}

interface CurrentLocationProps {
  onSelectAddress: (address: AddressData) => void;
  className?: string;
}

export function CurrentLocation({
  onSelectAddress,
  className = "",
}: CurrentLocationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        // 카카오 지도 + services + autoload false
        await loadScript(
          `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY_JAVASCRIPT}&autoload=false&libraries=services`
        );

        // kakao.maps 로드 (Geocoder 포함)
        window.kakao.maps.load(() => {
          console.log("카카오맵 services 로드 완료");
          setIsScriptLoaded(true);
        });
      } catch (e) {
        console.error("스크립트 로딩 실패", e);
        setError("지도 서비스 로드에 실패했습니다.");
      }
    };

    loadScripts();
  }, []);

  const detectLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("브라우저에서 위치 정보를 지원하지 않습니다.");
      setIsLoading(false);
      return;
    }

    if (!isScriptLoaded) {
      setError("지도 서비스가 아직 로드되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("감지된 위치:", { lat: latitude, lng: longitude });

        // 좌표를 주소로 변환
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(
          longitude,
          latitude,
          (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const addressInfo = result[0];
              const addressData: AddressData = {
                roadAddress: addressInfo.road_address
                  ? addressInfo.road_address.address_name
                  : "",
                jibunAddress: addressInfo.address.address_name,
                zonecode: "", // 좌표->주소 변환에서는 우편번호 없음
                latitude: latitude,
                longitude: longitude,
              };
              onSelectAddress(addressData);
            } else {
              setError("주소를 찾을 수 없습니다.");
            }
            setIsLoading(false);
          }
        );
      },
      (err) => {
        console.error("위치 감지 오류:", err);
        let errorMessage = "위치 정보를 가져오는 중 오류가 발생했습니다.";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근 권한이 거부되었습니다.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case err.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
            break;
        }

        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        onClick={detectLocation}
        disabled={isLoading || !isScriptLoaded}
        variant="outline"
        className="w-full"
      >
        <MapPin className="mr-2 h-4 w-4" />
        {isLoading ? "위치 감지 중..." : "현재 위치로 설정"}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}
