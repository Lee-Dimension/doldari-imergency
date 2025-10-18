'use client';
import { useEffect, useState } from 'react';
import { Report } from '@/types/report';
import TopBar from '@/components/TopBar';
import ReportModal from '@/components/ReportModal';
import MapContainer from '@/components/MapContainer';
import ReportListDrawer from '@/components/ReportListDrawer'; // ✅ 추가
import toast, { Toaster } from 'react-hot-toast';

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [focusedReport, setFocusedReport] = useState<Report | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // ✅ 리스트 열림 상태

  // ✅ 가짜 신고 데이터 (3초 뒤 추가)
  useEffect(() => {
    const timer = setTimeout(() => {
      setReports([
        {
          id: 1,
          name: '홍길동',
          phone: '010-1234-5678',
          message: '추락 위험 발생!',
          address: '서울특별시 중구 세종대로 110',
        },
      ]);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ 새 신고 알림
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

  return (
    <main className="relative h-screen flex flex-col bg-[#FFFEEF] overflow-hidden">
      <Toaster position="top-center" />

      {/* ✅ TopBar (리스트 토글 버튼 포함) */}
      <TopBar onListToggle={() => setIsDrawerOpen((prev) => !prev)} />

      {/* ✅ 지도 */}
      <div className="flex-1 relative">
        <MapContainer
          reports={reports}
          onMarkerClick={(report) => setSelectedReport(report)}
          focusedReport={focusedReport} // 리스트 클릭 시 이동용
        />

        {/* ✅ 왼쪽 슬라이드 리스트 */}
        <ReportListDrawer
          isOpen={isDrawerOpen}
          reports={reports}
          onSelect={(report) => {
            setFocusedReport(report);
            setSelectedReport(report);
            setIsDrawerOpen(false);
          }}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>

      {/* ✅ 신고 모달 */}
      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </main>
  );
}
