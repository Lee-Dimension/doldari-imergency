'use client';
import React from 'react';
import { Report } from '../types/report'; // 아래에서 타입 정의 따로 만듦

interface ReportModalProps {
  report: Report;
  onClose: () => void;
}

export default function ReportModal({ report, onClose }: ReportModalProps) {
  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-gray-200 z-50">
      <div className="space-y-1 text-sm text-gray-800">
        <p><b>신고자:</b> {report.name}</p>
        <p><b>전화번호:</b> {report.phone}</p>
        <p><b>신고 시각:</b> 10월 18일 10:07:47</p>
        <p><b>현장명:</b> 부강아파트</p>
        <p><b>주소:</b> 충청북도~~</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <a
          href={`tel:${report.phone}`}
          className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600"
        >
          전화걸기
        </a>
        <div className="flex gap-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600">
            출동시작
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700">
            상황종료
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  );
}
