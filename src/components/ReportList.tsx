'use client';
import { Report } from '@/types/report';

interface ReportListProps {
  reports: Report[]; // ✅ 백엔드에서 받아온 신고 데이터 리스트
  onSelect: (report: Report) => void; // ✅ 항목 클릭 시 실행 (지도 이동 + 상세 모달 표시)
}

export default function ReportList({ reports, onSelect }: ReportListProps) {
  // 🧩 [백엔드 연동 안내]
  // ------------------------------------------------------------------
  // 이 컴포넌트는 단순히 상위 컴포넌트(MapPage 등)로부터
  // 전달받은 reports 데이터를 화면에 표시하는 역할만 수행합니다.
  //
  // ⚙️ 백엔드 담당자 참고:
  // - MapPage.tsx에서 fetch()로 GET /api/reports 요청을 보내
  //   setReports(data)로 저장하면, 그 데이터가 이 컴포넌트로 전달됩니다.
  // - 따라서 이 파일 내부에는 별도의 fetch() 호출이 필요 없습니다.
  //
  // 📡 예상 데이터 구조 (Report 타입):
  // ------------------------------------------------------------------
  // {
  //   id: number;          // 신고 고유 ID
  //   name: string;        // 신고자 이름
  //   phone: string;       // 연락처
  //   message: string;     // 신고 내용
  //   address: string;     // 현장 주소 (지도 표시용)
  //   createdAt?: string;  // (선택) 신고 시각
  //   status?: string;     // (선택) "waiting" | "in_progress" | "completed"
  // }
  //
  // 🧠 참고:
  // - 클릭 시 onSelect(report)가 실행되어 지도 중심 이동 + 모달 표시를 유도합니다.
  // - API 응답이 비어 있으면 “🚨 현재 등록된 신고가 없습니다.” 문구가 표시됩니다.
  // ------------------------------------------------------------------

  if (reports.length === 0) {
    // 🚨 신고 데이터가 없을 때 표시되는 영역
    return (
      <div className="text-gray-500 text-center py-6">
        🚨 현재 등록된 신고가 없습니다.
      </div>
    );
  }

  // ✅ 신고 데이터가 있을 때 리스트 렌더링
  return (
    <div className="w-full bg-white rounded-t-2xl shadow-md max-h-60 overflow-y-auto">
      {/* 상단 타이틀 */}
      <div className="p-4 font-bold text-gray-800 border-b">📋 신고 내역</div>

      {/* 리스트 출력 */}
      <ul className="divide-y">
        {reports.map((report) => (
          <li
            key={report.id}
            onClick={() => onSelect(report)} // 🔹 리스트 항목 클릭 시 실행
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

            {/* 🧠 (선택) 상태 표시 추가 예시
                백엔드에서 status 필드를 제공할 경우 아래와 같이 상태 뱃지 표시 가능:
                <span className="text-xs text-blue-600 font-medium">
                  {report.status === 'completed' ? '✅ 종료' : '🚨 진행 중'}
                </span>
            */}
          </li>
        ))}
      </ul>
    </div>
  );
}
