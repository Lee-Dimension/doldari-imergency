'use client';
import { useEffect } from 'react';
import { Report } from '@/types/report';

interface MapContainerProps {
  reports: Report[];
  onMarkerClick: (report: Report) => void;
  focusedReport?: Report | null;
}

export default function MapContainer({ reports, onMarkerClick, focusedReport }: MapContainerProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.onload = () => {
      // @ts-ignore
      kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = { center: new kakao.maps.LatLng(37.5665, 126.9780), level: 5 };
        // @ts-ignore
        const map = new kakao.maps.Map(container, options);
        // @ts-ignore
        const geocoder = new kakao.maps.services.Geocoder();

        // 마커 이미지
        // @ts-ignore
        const markerImage = new kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
          new kakao.maps.Size(32, 32),
          { offset: new kakao.maps.Point(16, 32) }
        );

        // 마커 표시
        reports.forEach((report) => {
          geocoder.addressSearch(report.address, (result: any, status: any) => {
            if (status === kakao.maps.services.Status.OK) {
              const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
              // @ts-ignore
              const marker = new kakao.maps.Marker({
                map,
                position: coords,
                image: markerImage,
              });
              // 마커 클릭
              // @ts-ignore
              kakao.maps.event.addListener(marker, 'click', () => {
                onMarkerClick(report);
                map.setLevel(3, { animate: true });
                map.panTo(coords);
              });
            }
          });
        });

        // 리스트에서 클릭한 신고 중심 이동
        if (focusedReport) {
          geocoder.addressSearch(focusedReport.address, (result: any, status: any) => {
            if (status === kakao.maps.services.Status.OK) {
              const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
              map.setLevel(3, { animate: true });
              map.panTo(coords);
            }
          });
        }
      });
    };
    document.head.appendChild(script);
  }, [reports, focusedReport]);

  return <div id="map" className="w-full h-full rounded-xl shadow-lg" />;
}
