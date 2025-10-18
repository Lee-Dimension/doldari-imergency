'use client';
import { Report } from '@/types/report';

interface ReportListProps {
  reports: Report[];
  onSelect: (report: Report) => void;
}

export default function ReportList({ reports, onSelect }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-gray-500 text-center py-6">
        🚨 현재 등록된 신고가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-t-2xl shadow-md max-h-60 overflow-y-auto">
      <div className="p-4 font-bold text-gray-800 border-b">📋 신고 내역</div>
      <ul className="divide-y">
        {reports.map((report) => (
          <li
            key={report.id}
            onClick={() => onSelect(report)}
            className="p-4 hover:bg-[#FFFDE3] cursor-pointer transition"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">{report.name}</span>
              <span className="text-xs text-gray-500">{report.phone}</span>
            </div>
            <p className="text-sm text-red-600 font-medium mt-1">{report.message}</p>
            <p className="text-xs text-gray-500">{report.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
