'use client';
import React, { useState } from 'react';
import { FaGift, FaMedal, FaLeaf, FaArrowRight } from 'react-icons/fa';

import { Sidebar } from '~/components/Sidebar';
import { TopBar } from '~/components/TopBar';
import { Progress } from '~/components/ui/progress'; // Ajusta la ruta según tu estructura shadcn/ui

const REWARDS = [
  {
    nombre: 'Curso de Reciclaje',
    descripcion: 'Acceso a un curso online sobre reciclaje y sostenibilidad.',
    icono: <FaMedal className="text-2xl text-[#2962FF]" />,
    puntosNecesarios: 200,
  },
  {
    nombre: 'Kit Eco-Friendly',
    descripcion: 'Recibe un kit con productos ecológicos para tu hogar.',
    icono: <FaGift className="text-2xl text-[#2E7D32]" />,
    puntosNecesarios: 300,
  },
  {
    nombre: 'Trofeo Reciclador',
    descripcion: 'Premio físico por tu compromiso con el reciclaje.',
    icono: <FaLeaf className="text-2xl text-[#FFD700]" />,
    puntosNecesarios: 500,
  },
];

export default function RecompensasPage() {
  const [puntos] = useState(120); // Simula los puntos del usuario
  const [notificaciones] = useState([
    { id: 1, mensaje: '¡Nuevo curso disponible!', tipo: 'info' },
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-white font-[Inter,sans-serif]">
      <div className="fixed top-0 right-0 left-0 z-30">
        <TopBar puntos={puntos} notificaciones={notificaciones} />
      </div>
      <div className="flex flex-1 pt-[64px]">
        <div className="sticky top-[64px] z-20 h-[calc(100vh-64px)] w-20 flex-shrink-0 xl:w-56">
          <Sidebar active="recompensas" />
        </div>
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-2 py-8 md:px-6">
          <section>
            <h1 className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-[#2E7D32] md:text-3xl">
              <FaGift /> Recompensas y Canje
            </h1>
            <div className="flex flex-col gap-8">
              {REWARDS.map((reward, idx) => {
                const porcentaje = Math.min(
                  (puntos / reward.puntosNecesarios) * 100,
                  100
                );
                const faltan = Math.max(reward.puntosNecesarios - puntos, 0);
                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-4 rounded-2xl border border-[#E0E0E0] bg-white p-6 shadow-lg md:flex-row md:items-center"
                  >
                    <div className="flex flex-1 items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E0E0E0] bg-[#F5F5F5]">
                        {reward.icono}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#2E7D32]">
                          {reward.nombre}
                        </div>
                        <div className="text-sm text-gray-600">
                          {reward.descripcion}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Necesitas {reward.puntosNecesarios} pts
                          </span>
                          <span className="text-xs font-bold text-[#2962FF]">
                            Te faltan {faltan} pts
                          </span>
                        </div>
                        <div className="mt-2">
                          <Progress value={porcentaje} className="h-2" />
                          <div className="mt-1 text-xs text-gray-500">
                            {porcentaje >= 100
                              ? '¡Listo para canjear!'
                              : `Progreso: ${porcentaje.toFixed(0)}%`}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className={`flex items-center gap-2 rounded-full px-5 py-2 font-bold shadow transition ${
                        porcentaje >= 100
                          ? 'bg-[#2E7D32] text-white hover:bg-[#388e3c]'
                          : 'cursor-not-allowed bg-gray-200 text-gray-400'
                      }`}
                      disabled={porcentaje < 100}
                    >
                      Canjear <FaArrowRight />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
