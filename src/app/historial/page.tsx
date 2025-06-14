'use client';
import React, { useState } from 'react';
import { Sidebar } from '~/components/Sidebar';
import { TopBar } from '~/components/TopBar';
import {
  FaHistory,
  FaLeaf,
  FaMedal,
  FaGift,
  FaMapMarkerAlt,
} from 'react-icons/fa';

export default function HistorialPage() {
  const [historial, setHistorial] = useState([
    { fecha: '2024-06-01', descripcion: 'Subida de imagen', puntos: 20 },
    { fecha: '2024-06-03', descripcion: 'Reto semanal completado', puntos: 50 },
    { fecha: '2024-06-05', descripcion: 'Referencia a un amigo', puntos: 30 },
    { fecha: '2024-06-07', descripcion: 'Reciclaje en EcoParque', puntos: 15 },
    // ...más registros
  ]);
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
  const [puntos] = useState(120);
  const accionesSemana = historial.filter(
    (h) => h.fecha >= '2024-06-01' && h.fecha <= '2024-06-07'
  );
  const insignias = [
    {
      nombre: 'Recolector Verde',
      icono: <FaLeaf className="text-white" />,
      color: 'bg-green-700',
    },
    {
      nombre: 'Embajador Ecológico',
      icono: <FaMedal className="text-white" />,
      color: 'bg-yellow-400',
    },
  ];
  const recompensas = [
    {
      nombre: 'NFT EcoToken',
      icono: <FaGift className="text-[#00E676]" />,
      descripcion: 'Por completar 5 reciclajes',
    },
    {
      nombre: 'Descuento en tienda',
      icono: <FaGift className="text-[#FFD700]" />,
      descripcion: 'Por referir a un amigo',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white font-[Inter,sans-serif]">
      <TopBar puntos={puntos} notificaciones={notificaciones} />
      <div className="flex flex-1">
        <div className="sticky top-0 z-20 h-screen flex-shrink-0">
          <Sidebar active="historial" />
        </div>
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-2 py-8 md:px-6">
          <header className="mb-6 flex items-center gap-3">
            <FaHistory className="text-secondary-blue text-2xl" />
            <h1 className="text-primary-green text-2xl font-extrabold md:text-3xl">
              Historial de Actividad
            </h1>
          </header>

          {/* Acciones de la semana */}
          <section className="bg-card-light border-border-light rounded-2xl border p-6 shadow-lg">
            <h2 className="text-secondary-blue mb-4 flex items-center gap-2 text-lg font-bold">
              <FaLeaf /> Acciones de esta semana
            </h2>
            <ul className="flex flex-col gap-2">
              {accionesSemana.length === 0 && (
                <li className="text-text-muted">
                  No hay acciones registradas esta semana.
                </li>
              )}
              {accionesSemana.map((item, idx) => (
                <li
                  key={idx}
                  className="border-border-light flex items-center justify-between border-b py-2"
                >
                  <span>{item.descripcion}</span>
                  <span className="text-secondary-blue font-semibold">
                    +{item.puntos} pts
                  </span>
                  <span className="text-xs text-gray-400">{item.fecha}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Mapa del sitio */}
          <section className="bg-card-light border-border-light rounded-2xl border p-6 shadow-lg">
            <h2 className="text-primary-green mb-4 flex items-center gap-2 text-lg font-bold">
              <FaMapMarkerAlt /> Mapa de tus sitios de reciclaje
            </h2>
            <div className="border-border-light h-64 w-full overflow-hidden rounded-xl border">
              {/* Puedes reemplazar el src por un mapa real o integración */}
              <iframe
                className="map-iframe"
                title="Mapa de reciclaje"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.870759740072!2d-74.08175368467654!3d4.609710343446627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99a4b2b2b2b3%3A0x2e7d32!2sBogotá!5e0!3m2!1ses!2sco!4v1688765432101!5m2!1ses!2sco"
                width="100%"
                height="100%"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>

          {/* Insignias obtenidas */}
          <section className="bg-card-light border-border-light rounded-2xl border p-6 shadow-lg">
            <h2 className="text-secondary-yellow mb-4 flex items-center gap-2 text-lg font-bold">
              <FaMedal /> Insignias obtenidas
            </h2>
            <div className="flex flex-wrap gap-4">
              {insignias.map((badge, i) => (
                <div key={i} className={`flex flex-col items-center gap-1`}>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white shadow-lg ${badge.color}`}
                  >
                    {badge.icono}
                  </div>
                  <span className="text-text-dark text-xs font-semibold">
                    {badge.nombre}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recompensas obtenidas */}
          <section className="bg-card-light border-border-light rounded-2xl border p-6 shadow-lg">
            <h2 className="text-accent-nft mb-4 flex items-center gap-2 text-lg font-bold">
              <FaGift /> Recompensas obtenidas
            </h2>
            <div className="flex flex-col gap-3">
              {recompensas.map((r, i) => (
                <div
                  key={i}
                  className="border-border-light flex items-center gap-3 rounded-xl border bg-white p-3 shadow"
                >
                  <span className="text-2xl">{r.icono}</span>
                  <div>
                    <div className="text-text-dark font-semibold">
                      {r.nombre}
                    </div>
                    <div className="text-text-muted text-xs">
                      {r.descripcion}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
