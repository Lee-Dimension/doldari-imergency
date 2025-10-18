'use client';
import { useEffect, useRef } from 'react';
import { Report } from '@/types/report';

export function useReportMarkers(
  mapRef: React.MutableRefObject<kakao.maps.Map | null>,
  geocoderRef: React.MutableRefObject<kakao.maps.services.Geocoder | null>,
  reports: Report[],
  focusedReport: Report | null,
  onMarkerClick: (report: Report) => void
) {
  const markersRef = useRef<{ marker: kakao.maps.Marker; report: Report }[]>([]);
  const cacheRef = useRef<Record<string, kakao.maps.LatLng>>({});

  useEffect(() => {
    // ✅ Kakao 객체가 아직 없으면 대기
    if (typeof window === 'undefined' || !window.kakao || !window.kakao.maps) return;

    const map = mapRef.current;
    const geocoder = geocoderRef.current;
    if (!map || !geocoder) return;

    // 기본 및 강조 이미지 정의 (이 시점에는 kakao 확실히 존재)
    const defaultImage = new kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
      new kakao.maps.Size(32, 32),
      { offset: new kakao.maps.Point(16, 32) }
    );

    const focusImage = new kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
      new kakao.maps.Size(36, 36),
      { offset: new kakao.maps.Point(18, 36) }
    );

    // 기존 마커 제거
    markersRef.current.forEach(({ marker }) => marker.setMap(null));
    markersRef.current = [];

    reports.forEach((report) => {
      const cached = cacheRef.current[report.address];
      if (cached) {
        createMarker(report, cached, map, defaultImage, focusImage);
        return;
      }

      geocoder.addressSearch(report.address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          cacheRef.current[report.address] = coords;
          createMarker(report, coords, map, defaultImage, focusImage);
        }
      });
    });

    // 🔹 focusedReport 처리
    if (focusedReport) {
      const cached = cacheRef.current[focusedReport.address];
      if (cached) {
        highlightAndMove(map, cached, focusedReport, defaultImage, focusImage);
      } else {
        geocoder.addressSearch(focusedReport.address, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            cacheRef.current[focusedReport.address] = coords;
            highlightAndMove(map, coords, focusedReport, defaultImage, focusImage);
          }
        });
      }
    }
  }, [reports, focusedReport]); // ✅ 모든 kakao 관련 로직은 useEffect 안에서만 실행

  // 마커 생성
  function createMarker(
    report: Report,
    coords: kakao.maps.LatLng,
    map: kakao.maps.Map,
    defaultImage: kakao.maps.MarkerImage,
    focusImage: kakao.maps.MarkerImage
  ) {
    const marker = new kakao.maps.Marker({ map, position: coords, image: defaultImage });
    kakao.maps.event.addListener(marker, 'click', () => {
      map.setLevel(2, { animate: true });
      setTimeout(() => map.panTo(coords), 400);
      markersRef.current.forEach(({ marker: m, report: r }) =>
        m.setImage(r.id === report.id ? focusImage : defaultImage)
      );
      onMarkerClick(report);
    });
    markersRef.current.push({ marker, report });
  }

  // 지도 이동 + 강조
  function highlightAndMove(
    map: kakao.maps.Map,
    coords: kakao.maps.LatLng,
    focusedReport: Report,
    defaultImage: kakao.maps.MarkerImage,
    focusImage: kakao.maps.MarkerImage
  ) {
    map.setLevel(2, { animate: true });
    setTimeout(() => map.panTo(coords), 400);
    markersRef.current.forEach(({ marker, report }) => {
      marker.setImage(report.id === focusedReport.id ? focusImage : defaultImage);
    });
  }

  return { markersRef };
}
