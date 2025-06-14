'use client';
import React, { useState } from 'react';

import { FaGift, FaMapMarkerAlt, FaChartBar, FaRecycle } from 'react-icons/fa';

import { Sidebar } from '~/components/Sidebar';
import { TopBar } from '~/components/TopBar';

export default function DashboardPage() {
  // Ejemplo de métricas y datos para el dashboard
  const metricasSemana = {
    reciclajes: 7,
    puntosGanados: 120,
    sitiosVisitados: 3,
    residuosTotales: 15,
  };
  const sitiosVisitados = [
    {
      nombre: 'Punto Verde Central',
      fecha: '2024-06-03',
      direccion: 'Calle 10 #5-20',
    },
    {
      nombre: 'EcoParque Norte',
      fecha: '2024-06-05',
      direccion: 'Av. Norte 45',
    },
    { nombre: 'ReciclaYa Sur', fecha: '2024-06-07', direccion: 'Cra 8 #12-34' },
  ];
  const puntosDesechos = [
    { zona: 'Centro', cantidad: 12 },
    { zona: 'Norte', cantidad: 8 },
    { zona: 'Sur', cantidad: 15 },
  ];
  const [puntos] = useState(120);
  const [notificaciones] = useState([
    {
      id: 1,
      mensaje: '¡Felicidades! Has desbloqueado la insignia "Recolector Verde".',
      tipo: 'logro',
    },
    {
      id: 2,
      mensaje: 'Recuerda reciclar hoy para ganar más puntos.',
      tipo: 'recordatorio',
    },
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-white font-[Inter,sans-serif]">
      {/* TopBar fijo */}
      <div className="fixed top-0 right-0 left-0 z-30">
        <TopBar puntos={puntos} notificaciones={notificaciones} />
      </div>
      <div className="flex flex-1 pt-[64px]">
        {/* Sidebar fijo y del mismo tamaño siempre */}
        <div className="sticky top-[64px] z-20 h-[calc(100vh-64px)] w-20 flex-shrink-0 xl:w-56">
          <Sidebar active="dashboard" />
        </div>
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-2 py-8 md:px-6">
          {/* Bienvenida */}
          <section className="mb-2">
            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-[#2E7D32] md:text-3xl">
              <FaChartBar /> ¡Bienvenido a tu Dashboard de Reciclaje!
            </h1>
            <p className="mt-1 text-sm text-gray-600 md:text-base">
              Consulta tus métricas ecológicas, sitios visitados y el impacto de
              tus acciones esta semana.
            </p>
          </section>

          {/* Métricas rápidas */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center rounded-2xl border border-[#2E7D32]/10 bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] p-6 shadow-lg">
              <FaRecycle className="mb-2 text-3xl text-[#2E7D32]" />
              <span className="text-3xl font-bold">
                {metricasSemana.reciclajes}
              </span>
              <span className="text-xs font-semibold text-[#2E7D32]">
                Reciclajes semana
              </span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-[#FFD700]/10 bg-gradient-to-br from-[#fffde7] to-[#fff9c4] p-6 shadow-lg">
              <FaGift className="mb-2 text-3xl text-[#FFD700]" />
              <span className="text-3xl font-bold">
                {metricasSemana.puntosGanados}
              </span>
              <span className="text-xs font-semibold text-[#FFD700]">
                Puntos ganados
              </span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-[#2962FF]/10 bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb] p-6 shadow-lg">
              <FaMapMarkerAlt className="mb-2 text-3xl text-[#2962FF]" />
              <span className="text-3xl font-bold">
                {metricasSemana.sitiosVisitados}
              </span>
              <span className="text-xs font-semibold text-[#2962FF]">
                Sitios visitados
              </span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-[#AED581]/10 bg-gradient-to-br from-[#f1f8e9] to-[#dcedc8] p-6 shadow-lg">
              <FaRecycle className="mb-2 text-3xl text-[#AED581]" />
              <span className="text-3xl font-bold">
                {metricasSemana.residuosTotales}
              </span>
              <span className="text-xs font-semibold text-[#388e3c]">
                Residuos reciclados
              </span>
            </div>
          </section>

          {/* Sitios visitados */}
          <section className="rounded-2xl border border-[#E0E0E0] bg-white p-6 shadow-lg">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-[#2962FF]">
              <FaMapMarkerAlt /> Sitios visitados esta semana
            </h2>
            <ul className="flex flex-col gap-2">
              {sitiosVisitados.map((sitio, idx) => (
                <li
                  key={idx}
                  className="flex flex-col text-sm md:flex-row md:items-center md:gap-4"
                >
                  <span className="font-semibold">{sitio.nombre}</span>
                  <span className="text-gray-500">{sitio.direccion}</span>
                  <span className="text-gray-400">{sitio.fecha}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Puntos críticos de desechos */}
          <section className="rounded-2xl border border-[#E0E0E0] bg-white p-6 shadow-lg">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-[#EF5350]">
              <FaMapMarkerAlt /> Zonas con más desechos reportados
            </h2>
            <ul className="flex flex-col gap-2">
              {puntosDesechos.map((p, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span className="font-semibold">{p.zona}</span>
                  <span className="font-bold text-[#EF5350]">
                    {p.cantidad} reportes
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Resumen de puntos */}
          <section className="flex flex-col items-center rounded-2xl border border-[#E0E0E0] bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb] p-6 shadow-lg">
            <span className="mb-1 text-2xl font-bold text-[#2962FF]">
              Tus puntos
            </span>
            <div className="mb-1 text-4xl font-extrabold text-[#2E7D32]">
              {puntos}
            </div>
            <span className="text-xs text-gray-500">Total acumulado</span>
          </section>
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
