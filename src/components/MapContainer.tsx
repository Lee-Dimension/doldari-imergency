'use client';
import { Report } from '@/types/report';
import { useKakaoMap } from './hooks/useKakaoMap';
import { useReportMarkers } from './hooks/useReportMarkers';

interface MapContainerProps {
  reports: Report[]; // ✅ 백엔드에서 받아온 신고 데이터 리스트
  onMarkerClick: (report: Report) => void; // ✅ 마커 클릭 시 상위(MapPage)로 전달되는 이벤트
  onMapClick?: () => void; // 지도 클릭 시 모달 닫기 등 UI 제어용
  focusedReport?: Report | null; // 리스트에서 선택된 신고(지도 중심 이동용)
}

export default function MapContainer({
  reports,
  onMarkerClick,
  onMapClick,
  focusedReport,
}: MapContainerProps) {
  // 🧭 Kakao 지도 초기화 훅
  // -------------------------------------------------------------
  // useKakaoMap은 Kakao Maps SDK를 1회만 로드하며,
  // 지도 인스턴스(mapRef)와 지오코더(geocoderRef)를 반환합니다.
  // 
  // 👉 백엔드에서 받은 데이터를 지도에 반영할 때 주의:
  //    - 지도는 SDK가 완전히 로드된 이후에만 접근 가능합니다.
  //    - mapRef.current와 geocoderRef.current가 null이면 아직 준비 전입니다.
  // -------------------------------------------------------------
  const { mapRef, geocoderRef } = useKakaoMap(onMapClick);

  // 🧩 마커 관리 훅 (백엔드 데이터 연결 핵심)
  // -------------------------------------------------------------
  // useReportMarkers 훅은 지도(mapRef)와 지오코더(geocoderRef)를 기반으로
  // 현재 reports 배열에 담긴 신고 데이터를 지도에 마커로 표시합니다.
  //
  // ⚙️ 백엔드 연동 담당자 참고:
  //   - reports는 REST API(GET /api/reports 등)를 통해 받은 데이터가 들어갑니다.
  //   - 각 Report 객체는 다음 구조를 가정합니다:
  //       {
  //         id: number;
  //         name: string;
  //         phone: string;
  //         message: string;
  //         address: string; // 마커 표시용 주소 필수
  //       }
  //
  // 🔹 useReportMarkers 내부에서 수행하는 일:
  //   1) address → 좌표 변환 (Kakao Geocoder 사용)
  //   2) 지도에 마커 표시 및 클릭 이벤트 등록
  //   3) focusedReport가 있을 경우 해당 좌표로 지도 중심 이동 및 마커 강조
  //
  // ⚠️ 주의:
  //   - address 필드가 null이거나 빈 문자열일 경우 마커가 생성되지 않습니다.
  //   - 좌표가 이미 백엔드에서 계산되어 오는 경우, 훅 내부 geocoder 호출을 생략하도록 수정 가능
  //
  // 💡 만약 백엔드에서 위도(lat), 경도(lng)를 직접 주는 API로 바꾸면:
  //   - useReportMarkers 훅 내부에서 geocoder.addressSearch()를 제거하고
  //     kakao.maps.LatLng(report.lat, report.lng) 형태로 직접 생성하면 됩니다.
  // -------------------------------------------------------------
  useReportMarkers(mapRef, geocoderRef, reports, focusedReport, onMarkerClick);

  // 🗺️ 지도 렌더링 영역
  // -------------------------------------------------------------
  // id="map" 은 Kakao Maps SDK에서 map container로 인식하는 DOM 요소입니다.
  // Tailwind 스타일은 프로젝트 UI 가이드에 따라 수정 가능.
  // -------------------------------------------------------------
  return <div id="map" className="w-full h-full rounded-xl shadow-lg" />;
}
