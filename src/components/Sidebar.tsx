import React from 'react';
import { FaLeaf, FaHistory, FaGift, FaUser, FaUsers } from 'react-icons/fa';

interface SidebarProps {
  active?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ active }) => (
  <aside
    className="sticky top-[64px] z-10 flex h-screen w-20 flex-col gap-2 rounded-tr-2xl rounded-br-2xl bg-[#AED581] px-2 py-8 font-semibold text-[#2E7D32] shadow-lg lg:flex xl:w-56 xl:px-4 sidebar-min-height"
  >
    <a
      href="/dashboard"
      className={`group flex flex-col items-center gap-1 rounded-2xl py-4 transition hover:bg-[#c5e1a5] ${active === 'dashboard' ? 'bg-[#c5e1a5]' : ''}`}
    >
      <FaLeaf className="text-2xl" />
      <span className="hidden group-hover:underline xl:block">Dashboard</span>
    </a>
    <a
      href="/historial"
      className={`group flex flex-col items-center gap-1 rounded-2xl py-4 transition hover:bg-[#c5e1a5] ${active === 'historial' ? 'bg-[#c5e1a5]' : ''}`}
    >
      <FaHistory className="text-2xl" />
      <span className="hidden group-hover:underline xl:block">Historial</span>
    </a>
    <a
      href="/recompensas    "
      className={`group flex flex-col items-center gap-1 rounded-2xl py-4 transition hover:bg-[#c5e1a5] ${active === 'recompensas' ? 'bg-[#c5e1a5]' : ''}`}
    >
      <FaGift className="text-2xl" />
      <span className="hidden group-hover:underline xl:block">Recompensas</span>
    </a>
    <a
      href="#"
      className={`group flex flex-col items-center gap-1 rounded-2xl py-4 transition hover:bg-[#c5e1a5] ${active === 'perfil' ? 'bg-[#c5e1a5]' : ''}`}
    >
      <FaUser className="text-2xl" />
      <span className="hidden group-hover:underline xl:block">Perfil</span>
    </a>
    <a
      href="#"
      className={`group flex flex-col items-center gap-1 rounded-2xl py-4 transition hover:bg-[#c5e1a5] ${active === 'comunidad' ? 'bg-[#c5e1a5]' : ''}`}
    >
      <FaUsers className="text-2xl" />
      <span className="hidden group-hover:underline xl:block">Comunidad</span>
    </a>
  </aside>
);
