'use client';
import { useEffect, useRef } from 'react';

export function useKakaoMap(onMapClick?: () => void) {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const geocoderRef = useRef<kakao.maps.services.Geocoder | null>(null);

  useEffect(() => {
    // 이미 로드된 경우 재생성 방지
    if (window.kakao && window.kakao.maps && mapRef.current) return;

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;

    script.onload = () => {
      kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (!container) return;

        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.9780),
          level: 5,
        };

        const map = new kakao.maps.Map(container, options);
        const geocoder = new kakao.maps.services.Geocoder();

        mapRef.current = map;
        geocoderRef.current = geocoder;

        kakao.maps.event.addListener(map, 'click', () => onMapClick?.());
      });
    };

    document.head.appendChild(script);
  }, [onMapClick]);

  return { mapRef, geocoderRef };
}
