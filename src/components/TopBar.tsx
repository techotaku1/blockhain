import React from 'react';
import {
  FaLeaf,
  FaGift,
  FaBell,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa';
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@clerk/clerk-react';

interface TopBarProps {
  puntos: number;
  notificaciones: { id: number; mensaje: string; tipo: string }[];
}

export const TopBar: React.FC<TopBarProps> = ({ puntos, notificaciones }) => (
  <header className="flex items-center justify-between bg-[#2E7D32] px-4 py-3 text-white shadow-lg md:px-8">
    <div className="flex items-center gap-3">
      <FaLeaf className="text-2xl md:text-3xl" />
      <a
        href="/usuario"
        className="text-xl font-extrabold tracking-tight transition hover:underline md:text-2xl"
      >
        SellGreen
      </a>
    </div>
    <div className="flex items-center gap-2 md:gap-4">
      <span className="flex items-center gap-1 rounded-full bg-[#2962FF] px-3 py-1 text-sm text-white shadow md:text-base">
        <FaGift className="text-[#FFD700]" />
        <span className="font-semibold">{puntos} pts</span>
      </span>
      <button className="relative rounded-full p-2 transition hover:bg-[#388e3c]">
        <FaBell className="text-lg md:text-xl" />
        {notificaciones.length > 0 && (
          <span className="absolute -top-1 -right-1 rounded-full bg-[#EF5350] px-1 text-xs">
            {notificaciones.length}
          </span>
        )}
      </button>
      <div className="flex items-center gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-primary-green border-primary-green hover:bg-primary-green flex items-center gap-2 rounded border bg-white px-4 py-2 font-semibold transition hover:text-white">
              <FaSignInAlt /> Iniciar sesión
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-secondary-yellow border-secondary-yellow flex items-center gap-2 rounded border px-4 py-2 font-semibold text-black transition hover:bg-yellow-300">
              <FaUserPlus /> Registrarse
            </button>
          </SignUpButton>
        </SignedOut>
      </div>
    </div>
  </header>
);
