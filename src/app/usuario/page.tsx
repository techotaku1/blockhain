'use client';
import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from '@clerk/clerk-react';
import { Sidebar } from '~/components/Sidebar';
import { TopBar } from '~/components/TopBar';
import {
  FaLeaf,
  FaHistory,
  FaGift,
  FaUser,
  FaUsers,
  FaBell,
  FaMedal,
  FaCamera,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa';
import {
  createUserPoint,
  getUserStats,
  getAllUsers,
  addUserHistory,
  saveUserFromClerk,
} from '../../server/db/serverActions';
import type { User } from '../../types'; // Asegúrate de importar el tipo User

export default function UsuarioPage() {
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
  const [puntos, setPuntos] = useState(0); // Inicializa en cero
  const [insignias, setInsignias] = useState([
    {
      nombre: 'Recolector Verde',
      color: 'bg-green-700',
      icono: <FaLeaf className="text-white" />,
    },
    {
      nombre: 'Embajador Ecológico',
      color: 'bg-yellow-400',
      icono: <FaMedal className="text-white" />,
    },
    // ...otras insignias
  ]);
  const [imagen, setImagen] = useState<File | null>(null);
  const [historialPuntos, setHistorialPuntos] = useState([
    { fecha: '2024-06-01', descripcion: 'Subida de imagen', puntos: 20 },
    { fecha: '2024-06-03', descripcion: 'Reto semanal completado', puntos: 50 },
    { fecha: '2024-06-05', descripcion: 'Referencia a un amigo', puntos: 30 },
  ]);
  const [descripcion, setDescripcion] = useState('');
  const [tipoResiduo, setTipoResiduo] = useState('');
  const [entidad, setEntidad] = useState('Alcaldía');
  const [notificarAutoridad, setNotificarAutoridad] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [puntosAsignar, setPuntosAsignar] = useState(0);
  const { user } = useUser();

  React.useEffect(() => {
    // Mapea el icono string a un componente React
    const iconMap: Record<string, JSX.Element> = {
      FaLeaf: <FaLeaf className="text-white" />,
      FaMedal: <FaMedal className="text-white" />,
      FaGift: <FaGift className="text-white" />,
      // Agrega aquí otros iconos según sea necesario
    };

    async function fetchStats() {
      const stats = await getUserStats();
      if (stats) {
        setPuntos(stats.puntos);
        if (stats.insignias) {
          setInsignias(
            stats.insignias.map((badge: any) => ({
              ...badge,
              icono: iconMap[badge.icono] || <FaMedal className="text-white" />,
            }))
          );
        }
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (user) {
      saveUserFromClerk({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || '',
      });
    }
  }, [user]);

  // Cargar usuarios al abrir el modal
  const handleOpenModal = async () => {
    setShowModal(true);
    const users = await getAllUsers();
    setUsuarios(users);
  };

  const handleAsignarPuntos = async () => {
    if (selectedUser && puntosAsignar > 0) {
      await addUserHistory({
        userId: selectedUser,
        action: 'Puntos asignados manualmente',
        points: puntosAsignar,
      });
      setShowModal(false);
      setPuntosAsignar(0);
      setSelectedUser(null);
      alert('¡Puntos asignados!');
    }
  };

  const handleLogin = () => {
    window.location.href = '/sign-in';
  };
  const handleRegister = () => {
    window.location.href = '/sign-up';
  };
  // Cambia handleSubmit para usar el server action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion || !tipoResiduo) return;
    // Llama al server action para guardar el aporte
    const formData = new FormData();
    formData.append('descripcion', descripcion);
    formData.append('tipoResiduo', tipoResiduo);
    formData.append('entidad', entidad);
    formData.append('notificarAutoridad', notificarAutoridad ? '1' : '0');
    if (imagen) formData.append('imagen', imagen);

    await createUserPoint(formData);

    // Suma puntos al usuario (ejemplo: +20)
    setPuntos((prev) => prev + 20);

    // Ejemplo: agrega una insignia si es la primera vez
    if (puntos === 0) {
      setInsignias((prev) => [
        ...prev,
        {
          nombre: 'Primer Aporte',
          color: 'bg-blue-500',
          icono: <FaGift className="text-white" />,
        },
      ]);
    }

    alert('¡Aporte enviado!');
    // Aquí podrías actualizar el estado o recargar los datos
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-[Inter,sans-serif]">
      {/* TopBar fijo */}
      <div className="fixed top-0 right-0 left-0 z-30">
        <TopBar puntos={puntos} notificaciones={notificaciones} />
      </div>
      <div className="flex flex-1 pt-[64px]">
        <Sidebar active="dashboard" />
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-2 py-8 md:px-6">
          {/* Botón para abrir el modal */}
          <button
            className="bg-primary-green mb-4 rounded px-4 py-2 font-bold text-white"
            onClick={handleOpenModal}
          >
            Ver usuarios y asignar puntos
          </button>

          {/* Modal de usuarios */}
          {showModal && (
            <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-bold">Usuarios registrados</h2>
                <ul className="mb-4 max-h-48 overflow-y-auto">
                  {usuarios.map((u) => (
                    <li
                      key={u.id}
                      className={`cursor-pointer rounded p-2 ${
                        selectedUser === u.id
                          ? 'bg-primary-green text-white'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedUser(u.id)}
                    >
                      <div className="font-semibold">
                        {u.name || 'Sin nombre'}
                      </div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </li>
                  ))}
                </ul>
                <input
                  type="number"
                  min={1}
                  placeholder="Puntos a asignar"
                  className="mb-2 w-full rounded border px-2 py-1"
                  value={puntosAsignar}
                  onChange={(e) => setPuntosAsignar(Number(e.target.value))}
                />
                <div className="flex gap-2">
                  <button
                    className="bg-primary-green rounded px-4 py-2 font-bold text-white"
                    onClick={handleAsignarPuntos}
                    disabled={!selectedUser || puntosAsignar <= 0}
                  >
                    Asignar puntos
                  </button>
                  <button
                    className="rounded bg-gray-300 px-4 py-2 font-bold"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Cards */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Puntos */}
            <div className="from-primary-light border-primary-light flex flex-col items-center rounded-2xl border bg-gradient-to-br to-white p-6 shadow-lg">
              <span className="text-secondary-blue mb-1 text-2xl font-bold">
                Tus puntos
              </span>
              <div className="text-primary-green mb-1 text-4xl font-extrabold drop-shadow">
                {puntos}
              </div>
              <span className="text-text-muted text-xs">
                ¡Sigue reciclando!
              </span>
            </div>
            {/* Insignias */}
            <div className="from-secondary-yellow/20 border-secondary-yellow/30 flex flex-col items-center rounded-2xl border bg-gradient-to-br to-white p-6 shadow-lg">
              <span className="text-secondary-yellow mb-1 text-2xl font-bold">
                Insignias
              </span>
              <div className="mb-2 flex gap-3">
                {insignias.map((badge, i) => (
                  <div
                    key={i}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-lg ${badge.color} animate-pulse`}
                    title={badge.nombre}
                  >
                    {badge.icono}
                  </div>
                ))}
              </div>
              <span className="text-text-muted text-center text-xs">
                Desbloquea más insignias completando retos.
              </span>
            </div>
            {/* Historial reciente */}
            <div className="from-bg-light border-border-light flex flex-col rounded-2xl border bg-gradient-to-br to-white p-6 shadow-lg">
              <span className="text-primary-green mb-2 text-2xl font-bold">
                Historial
              </span>
              <ul className="flex flex-1 flex-col gap-1 text-xs">
                {historialPuntos.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.descripcion}</span>
                    <span className="text-secondary-blue font-bold">
                      +{item.puntos}
                    </span>
                  </li>
                ))}
              </ul>
              <span className="text-text-muted mt-2 text-[10px]">
                Ver más en historial completo
              </span>
            </div>
          </section>

          {/* Subir evidencia */}
          <section className="bg-card-light border-border-light flex flex-col gap-4 rounded-2xl border p-6 shadow-lg">
            <h2 className="text-primary-green flex items-center gap-2 text-lg font-bold">
              <FaCamera /> Sube tu aporte ecológico
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <textarea
                placeholder="Describe tu acción ecológica..."
                className="border-border-light rounded border p-2"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
              <input
                id="imagen-upload"
                type="file"
                accept="image/*"
                title="Selecciona una imagen para subir"
                onChange={(e) => setImagen(e.target.files?.[0] || null)}
                className="file:bg-primary-light file:text-primary-green file:rounded file:px-3 file:py-1"
                required
              />
              <div className="flex flex-col gap-2 md:flex-row">
                <label htmlFor="tipoResiduo" className="sr-only">
                  Tipo de residuo
                </label>
                <select
                  id="tipoResiduo"
                  className="border-border-light flex-1 rounded border p-2"
                  value={tipoResiduo}
                  onChange={(e) => setTipoResiduo(e.target.value)}
                  required
                  aria-label="Tipo de residuo"
                >
                  <option value="">Tipo de residuo</option>
                  <option>Plástico</option>
                  <option>Vidrio</option>
                  <option>Papel</option>
                  <option>Orgánico</option>
                </select>
                <select
                  className="border-border-light flex-1 rounded border p-2"
                  value={entidad}
                  onChange={(e) => setEntidad(e.target.value)}
                  aria-label="Entidad"
                >
                  <option>Alcaldía</option>
                  <option>Empresa de aseo</option>
                  <option>ONG</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notificar"
                  checked={notificarAutoridad}
                  onChange={(e) => setNotificarAutoridad(e.target.checked)}
                  className="accent-primary-green"
                />
                <label htmlFor="notificar" className="text-text-dark text-sm">
                  Notificar a la autoridad
                </label>
              </div>
              <button
                type="submit"
                className="bg-primary-green hover:bg-success rounded-full px-6 py-2 font-bold text-white shadow-lg transition-all"
              >
                Enviar aporte
              </button>
            </form>
          </section>

          {/* Historial completo */}
          <section className="bg-card-light border-border-light rounded-2xl border p-6 shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-primary-light text-primary-green">
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-left">Descripción</th>
                    <th className="px-4 py-2 text-left">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {historialPuntos.map((item, idx) => (
                    <tr key={idx} className="border-border-light border-b">
                      <td className="px-4 py-2">{item.fecha}</td>
                      <td className="px-4 py-2">{item.descripcion}</td>
                      <td className="text-secondary-blue px-4 py-2 font-semibold">
                        {item.puntos}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Notificaciones */}
          <section className="bg-card-light border-border-light rounded-2xl border p-6 shadow-lg">
            <h2 className="text-error mb-4 flex items-center gap-2 text-lg font-bold">
              <FaBell /> Notificaciones
            </h2>
            <ul>
              {notificaciones.map((n) => (
                <li key={n.id} className="mb-2 flex items-center gap-2">
                  <span className="font-semibold">
                    {n.tipo === 'logro' ? (
                      <FaMedal className="text-secondary-yellow" />
                    ) : (
                      <FaBell />
                    )}
                  </span>
                  {n.mensaje}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
