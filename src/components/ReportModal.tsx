'use client';
import React from 'react';
import { Report } from '../types/report';

interface ReportModalProps {
  report: Report; // ✅ 백엔드에서 받아온 신고 1건 정보
  onClose: () => void; // 모달 닫기 핸들러
}

export default function ReportModal({ report, onClose }: ReportModalProps) {
  // 🧩 [백엔드 연동 예정 영역]
  // ------------------------------------------------------------------
  // 아래 "출동시작" / "상황종료" 버튼 클릭 시, 
  // 백엔드 REST API를 통해 해당 신고 상태를 업데이트해야 합니다.
  //
  // ⚙️ 예시 API 명세 (협업 시 서버 담당자와 경로 일치 확인 필요):
  //
  //   ▶ 출동 시작:
  //     PUT /api/reports/{id}/status
  //     Request Body: { status: "in_progress" }
  //
  //   ▶ 상황 종료:
  //     PUT /api/reports/{id}/status
  //     Request Body: { status: "completed" }
  //
  // ⚡ fetch 예시:
  // ------------------------------------------------------------------
  //   const handleStatusUpdate = async (newStatus: string) => {
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${report.id}/status`, {
  //         method: 'PUT',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ status: newStatus }),
  //       });
  //
  //       if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  //
  //       const updated = await res.json();
  //       console.log('✅ 상태 변경 완료:', updated);
  //
  //       // TODO: 변경된 데이터를 상위 컴포넌트(MapPage)로 전달해
  //       //        상태 갱신(setReports) 또는 토스트 메시지를 띄워도 좋습니다.
  //
  //     } catch (error) {
  //       console.error('🚨 상태 변경 실패:', error);
  //     }
  //   };
  //
  // ------------------------------------------------------------------
  // 🧠 참고:
  // - 백엔드에서 status 필드를 문자열(enum)로 관리한다면
  //   "waiting" | "in_progress" | "completed" 형태로 일관성 유지 권장
  // - 성공 시 UI 피드백(예: 토스트 or 색상 변경)도 여기서 처리 가능
  // ------------------------------------------------------------------

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-gray-200 z-50">
      {/* 🔹 신고 정보 표시 영역 */}
      <div className="space-y-1 text-sm text-gray-800">
        <p><b>신고자:</b> {report.name}</p>
        <p><b>전화번호:</b> {report.phone}</p>
        {/* 🧩 아래 두 줄은 현재 더미 데이터입니다.
             백엔드 연동 시 report.createdAt / report.siteName / report.address 등
             실제 필드명을 기반으로 출력하도록 수정하세요. */}
        <p><b>신고 시각:</b> 10월 18일 10:07:47</p>
        <p><b>현장명:</b> 부강아파트</p>
        <p><b>주소:</b> 충청북도~~</p>
      </div>

      {/* 🔹 액션 버튼 영역 */}
      <div className="flex justify-between items-center mt-4">
        {/* 전화 연결 */}
        <a
          href={`tel:${report.phone}`}
          className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600"
        >
          전화걸기
        </a>

        <div className="flex gap-3">
          {/* 🧩 출동 시작 버튼 — API 연동 포인트 */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            // onClick={() => handleStatusUpdate('in_progress')} // ← 백엔드 연결 시 활성화
          >
            출동시작
          </button>

          {/* 🧩 상황 종료 버튼 — API 연동 포인트 */}
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700"
            // onClick={() => handleStatusUpdate('completed')} // ← 백엔드 연결 시 활성화
          >
            상황종료
          </button>
        </div>
      </div>

      {/* 🔹 모달 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  );
}
