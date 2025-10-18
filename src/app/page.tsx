'use client';

import { useEffect } from 'react';

export default function MapPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
    script.onload = () => {
      // @ts-ignore
      kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
          level: 3,
        };
        // @ts-ignore
        const map = new kakao.maps.Map(container, options);

        // 마커 예시
        // @ts-ignore
        new kakao.maps.Marker({
          position: new kakao.maps.LatLng(37.5665, 126.9780),
          map: map,
        });
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <main className="flex justify-center items-center h-screen">
      <div id="map" className="w-[90%] h-[80%] rounded-xl shadow-lg" />
    </main>
  );
}
