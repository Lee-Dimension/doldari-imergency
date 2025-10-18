'use client';
import { Report } from '@/types/report';
import { X } from 'lucide-react';

interface ReportListDrawerProps {
  isOpen: boolean;
  reports: Report[]; // ✅ 백엔드에서 받아온 신고 데이터 리스트
  onSelect: (report: Report) => void; // ✅ 리스트 항목 클릭 시 실행 (지도 이동 + 모달 표시)
  onClose: () => void; // Drawer 닫기 핸들러
}

export default function ReportListDrawer({
  isOpen,
  reports,
  onSelect,
  onClose,
}: ReportListDrawerProps) {
  return (
    <div
      className={`absolute top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-20 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* 🧭 상단 닫기 버튼 */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold text-gray-800">📋 신고 내역</h2>
        <button onClick={onClose}>
          <X size={20} className="text-gray-600 hover:text-black" />
        </button>
      </div>

      {/* 🧩 신고 목록 (백엔드 연동 포인트)
      ------------------------------------------------------------------
      이 Drawer는 reports 배열에 들어 있는 신고 데이터를 리스트로 표시합니다.
      현재는 props.reports를 상위(MapPage)에서 넘겨받고 있으며,
      MapPage에서 fetch()로 REST API를 호출하면 자동으로 여기에 반영됩니다.

      ⚙️ API 연동 담당자 참고:
      - MapPage.tsx 내부 useEffect()의 fetchReports()에서 
        GET /api/reports 요청을 통해 데이터를 불러오면,
        그 결과가 setReports()로 저장되고 이 컴포넌트의 props.reports로 전달됩니다.
      - 따라서 이 컴포넌트에서는 별도의 fetch() 호출이 필요 없습니다.

      📡 예상 데이터 형식 (Report 타입):
      ------------------------------------------------------------------
      {
        id: number;          // 신고 고유 ID
        name: string;        // 신고자 이름
        phone: string;       // 연락처
        message: string;     // 신고 내용
        address: string;     // 현장 주소 (지도 표시용)
        createdAt?: string;  // (선택) 신고 시각
        status?: string;     // (선택) "waiting" | "in_progress" | "completed"
      }

      🧠 참고:
      - 리스트 클릭 시 onSelect(report)가 실행되어
        MapPage → MapContainer로 연결되어 지도 중심 이동 + 모달 표시를 유도합니다.
      - API 응답이 비어 있으면 “신고 내역이 없습니다.” 메시지가 표시됩니다.
      ------------------------------------------------------------------ */}
      <ul className="divide-y max-h-[90%] overflow-y-auto">
        {reports.length === 0 ? (
          // 🔸 신고 데이터가 없을 때 표시되는 안내 문구
          <li className="p-4 text-gray-500 text-center">
            신고 내역이 없습니다.
          </li>
        ) : (
          // 🔹 신고 데이터가 있을 때 리스트 렌더링
          reports.map((report) => (
            <li
              key={report.id}
              onClick={() => onSelect(report)} // 🔹 항목 클릭 시 지도 이동 + 모달 표시
              className="p-4 hover:bg-[#FFFDE3] cursor-pointer transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{report.name}</span>
                <span className="text-xs text-gray-500">{report.phone}</span>
              </div>

              <p className="text-sm text-red-600 font-medium mt-1">
                {report.message}
              </p>
              <p className="text-xs text-gray-500">{report.address}</p>

              {/* 🧠 (선택) 신고 상태 표시 예시
                  백엔드에서 status 필드가 내려올 경우 아래처럼 표시 가능
                  <span className="text-xs text-blue-600 font-medium">
                    {report.status === 'completed' ? '✅ 종료' : '🚨 진행 중'}
                  </span>
              */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
