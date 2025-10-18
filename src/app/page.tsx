'use client';
import { useEffect, useState } from 'react';
import { Report } from '@/types/report';
import TopBar from '@/components/TopBar';
import ReportModal from '@/components/ReportModal';
import MapContainer from '@/components/MapContainer';
import ReportListDrawer from '@/components/ReportListDrawer';
import toast, { Toaster } from 'react-hot-toast';

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [focusedReport, setFocusedReport] = useState<Report | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 🧩 [백엔드 연동 포인트]
  // ------------------------------------------------------------------
  // 이 useEffect 부분은 현재 테스트용 더미 데이터로 reports를 세팅하고 있습니다.
  // 실제 서비스에서는 아래 setTimeout 부분을 제거하고,
  // fetch()를 사용해 REST API로부터 데이터를 불러오면 됩니다.
  //
  // 📡 예시 코드:
  //
  //   useEffect(() => {
  //     const fetchReports = async () => {
  //       try {
  //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
  //           method: 'GET',
  //           headers: { 'Content-Type': 'application/json' },
  //         });
  //
  //         if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
  //
  //         const data: Report[] = await response.json();
  //         setReports(data); // ✅ 받은 데이터를 상태에 저장
  //       } catch (error) {
  //         console.error('🚨 신고 데이터 불러오기 실패:', error);
  //       }
  //     };
  //
  //     fetchReports();
  //   }, []);
  //
  // 🔹 API 명세 참고:
  //     GET /api/reports
  //     → 응답 형식: Report[] (id, name, phone, message, address 등)
  //
  // 🔹 Report 타입 정의 위치:
  //     /src/types/report.ts
  //
  // ------------------------------------------------------------------
  useEffect(() => {
    // (임시) 테스트용 더미 데이터 3초 후 삽입
    const timer = setTimeout(() => {
      setReports([
        {
          id: 1,
          name: '홍길동',
          phone: '010-1234-5678',
          message: '추락 위험 발생!',
          address: '서울특별시 중구 세종대로 110',
        },
                {
          id: 2,
          name: '이차원',
          phone: '010-1234-5678',
          message: '추락 위험 발생!',
          address: '대전광역시 유성구 덕명로26',
        },
      ]);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ 새 신고 발생 시 토스트 알림
  // (이 로직은 실제 백엔드 연동 이후에도 그대로 유지 가능)
  useEffect(() => {
    if (reports.length > 0) {
      toast.success('🚨 긴급신고 발생! 지도에 표시됩니다.', {
        duration: 4000,
        style: {
          background: '#D2C30F',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '10px',
        },
      });
    }
  }, [reports]);

  // ✅ 모달 닫기 함수 (지도 클릭 또는 닫기 버튼)
  const handleCloseModal = () => {
    setSelectedReport(null);
    setFocusedReport(null);
  };

  return (
    <main className="relative h-screen flex flex-col bg-[#FFFEEF] overflow-hidden">
      <Toaster position="top-center" />

      {/* 🧭 상단 바 (리스트 토글 버튼 포함) */}
      <TopBar onListToggle={() => setIsDrawerOpen((prev) => !prev)} />

      {/* 🗺️ 지도 영역 */}
      <div className="flex-1 relative">
        <MapContainer
          reports={reports}
          onMarkerClick={(report) => {
            setSelectedReport(report);
            setFocusedReport({ ...report }); // 🔹 지도 이동용
          }}
          onMapClick={handleCloseModal} // 🔹 지도 클릭 시 모달 닫기
          focusedReport={focusedReport} // 🔹 리스트 선택 시 지도 이동
        />

        {/* 📋 신고 리스트 Drawer (왼쪽 슬라이드) */}
        <ReportListDrawer
          isOpen={isDrawerOpen}
          reports={reports}
          onSelect={(report) => {
            setFocusedReport({ ...report });
            setSelectedReport(report);
            setIsDrawerOpen(false);
          }}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>

      {/* 🧾 신고 상세 모달 */}
      {selectedReport && (
        <ReportModal report={selectedReport} onClose={handleCloseModal} />
      )}
    </main>
  );
}
