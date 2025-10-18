'use client';
import { Report } from '@/types/report';
import { X } from 'lucide-react';

interface ReportListDrawerProps {
  isOpen: boolean;
  reports: Report[];
  onSelect: (report: Report) => void;
  onClose: () => void;
}

export default function ReportListDrawer({ isOpen, reports, onSelect, onClose }: ReportListDrawerProps) {
  return (
    <div
      className={`absolute top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-20 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* 상단 닫기 버튼 */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold text-gray-800">📋 신고 내역</h2>
        <button onClick={onClose}>
          <X size={20} className="text-gray-600 hover:text-black" />
        </button>
      </div>

      {/* 신고 목록 */}
      <ul className="divide-y max-h-[90%] overflow-y-auto">
        {reports.length === 0 ? (
          <li className="p-4 text-gray-500 text-center">신고 내역이 없습니다.</li>
        ) : (
          reports.map((report) => (
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
          ))
        )}
      </ul>
    </div>
  );
}
