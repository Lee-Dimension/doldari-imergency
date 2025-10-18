'use client';
import { List } from 'lucide-react'; // 아이콘 (lucide-react 설치 필요)
interface TopBarProps {
  onListToggle?: () => void;
}

export default function TopBar({ onListToggle }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md z-10">
        <button
        onClick={onListToggle}
        className="flex items-center gap-2 text-[#78711D] font-semibold hover:text-[#D2C30F] transition"
      >
        <List size={20} />
        신고 내역
      </button>
              <button
        //onClick={}
        className="flex items-center gap-2 text-[#78711D] font-semibold hover:text-[#D2C30F] transition"
      >
        로그아웃
      </button>
    </header>
  );
}
