'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Sidebar } from '~/components/Sidebar';
import { TopBar } from '~/components/TopBar';
import {
  crearReporteZona,
  getReportesZonaByUser,
} from '../../server/db/serverActions';
import type { ReporteZona } from '../../types';
// Importa los componentes de shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export default function ReporteZonaPage() {
  const { user } = useUser();
  const [lugar, setLugar] = useState('');
  const [hora, setHora] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [historial, setHistorial] = useState<ReporteZona[]>([]);
  const [notificaciones] = useState([]);
  const [puntos] = useState(0);

  useEffect(() => {
    if (user) {
      getReportesZonaByUser(user.id).then(setHistorial);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    let imagenUrl = '';
    // Aquí podrías subir la imagen y obtener la URL si tienes un sistema de almacenamiento
    await crearReporteZona({
      userId: user.id,
      lugar,
      hora,
      imagenUrl,
    });
    setLugar('');
    setHora('');
    setImagen(null);
    // Recarga historial
    const nuevos = await getReportesZonaByUser(user.id);
    setHistorial(nuevos);
    alert('Reporte enviado');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-[Inter,sans-serif]">
      <div className="fixed top-0 right-0 left-0 z-30">
        <TopBar puntos={puntos} notificaciones={notificaciones} />
      </div>
      <div className="flex flex-1 pt-[64px]">
        <Sidebar active="reporte-zona" />
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-2 py-8 md:px-6">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Reporte de Zona de Contaminación</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Label htmlFor="lugar">
                  Lugar de la zona (elige en el mapa o escribe manualmente):
                </Label>
                <Input
                  id="lugar"
                  type="text"
                  placeholder="Lugar (puedes escribir dirección o coordenadas)"
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  required
                />
                <div className="border-border-light mb-2 h-64 w-full overflow-hidden rounded-xl border">
                  <iframe
                    className="h-full w-full"
                    title="Mapa de selección"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.870759740072!2d-74.08175368467654!3d4.609710343446627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99a4b2b2b2b3%3A0x2e7d32!2sBogotá!5e0!3m2!1ses!2sco!4v1688765432101!5m2!1ses!2sco"
                    width="100%"
                    height="100%"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <Label htmlFor="hora">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                />
                <Label htmlFor="imagen">Imagen</Label>
                <Input
                  id="imagen"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagen(e.target.files?.[0] || null)}
                />
                <Button type="submit" className="w-fit">
                  Enviar reporte
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Historial de reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-primary-light text-primary-green">
                      <th className="px-2 py-1">Lugar</th>
                      <th className="px-2 py-1">Hora</th>
                      <th className="px-2 py-1">Estado</th>
                      <th className="px-2 py-1">Puntos</th>
                      <th className="px-2 py-1">Imagen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="px-2 py-1">{r.lugar}</td>
                        <td className="px-2 py-1">{r.hora}</td>
                        <td className="px-2 py-1">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${r.estado === 'Revisado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                          >
                            {r.estado}
                          </span>
                        </td>
                        <td className="px-2 py-1">{r.puntos}</td>
                        <td className="px-2 py-1">
                          {r.imagenUrl ? (
                            <img
                              src={r.imagenUrl}
                              alt="Evidencia"
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">
                              Sin imagen
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
