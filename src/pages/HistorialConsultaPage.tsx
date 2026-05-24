import { useEffect, useState } from "react";

import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";

import { historialesApi } from "@/api/historiales";

import { HistorialEditor } from "@/components/historial/HistorialEditor";

import { MedicamentosSection } from "@/components/historial/MedicamentosSection";

import { IncapacidadSection } from "@/components/documents/IncapacidadSection";

import { Button } from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";

import { createEmptyHistorial, type HistorialClinico } from "@/types/historial";

import "./HistorialConsultaPage.css";



import "./HistorialConsultaPage.css";

export function HistorialConsultaPage() {

  const { historialId } = useParams();

  const [searchParams] = useSearchParams();

  const { user } = useAuth();

  const pacienteIdFromQuery = searchParams.get("paciente");



  const [historial, setHistorial] = useState<HistorialClinico>(createEmptyHistorial());

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    if (!historialId) return;

    setLoading(true);

    void (async () => {

      const { data, error } = await historialesApi.get(historialId);

      if (data) setHistorial(data);

      if (error) console.error(error);

      setLoading(false);

    })();

  }, [historialId]);



  const backPath = pacienteIdFromQuery

    ? `/historial/paciente/${pacienteIdFromQuery}`

    : user?.role === "cliente" && user.pacienteId

      ? `/historial/paciente/${user.pacienteId}`

      : "/historial";



  if (

    user?.role === "cliente" &&

    user.pacienteId &&

    pacienteIdFromQuery &&

    pacienteIdFromQuery !== user.pacienteId

  ) {

    return <Navigate to={`/historial/paciente/${user.pacienteId}`} replace />;

  }



  if (loading) {

    return <p className="historial-consulta__loading">Cargando consulta…</p>;

  }



  return (

    <div className="mn-page historial-consulta">

      <Link to={backPath} className="historial-consulta__back">

        ← Volver al historial

      </Link>



      <header className="historial-consulta__hero mn-panel">

        <div>

          <h2>Detalle de consulta #{historialId}</h2>

          <p>

            {historial.paciente_nombre && `${historial.paciente_nombre} · `}

            {historial.paciente_documento && `CC ${historial.paciente_documento}`}

          </p>

        </div>

        {historial.firmado && (

          <span className="historial-consulta__badge">Firmado y enviado</span>

        )}

      </header>



      <div className="historial-consulta__body">

        <div className="mn-panel">

          <HistorialEditor

            historial={historial}

            onChange={setHistorial}

            disabled

          />

        </div>



        <MedicamentosSection

          medicamentos={historial.medicamentos ?? []}

          disabled

        />



        {(historial.incapacidad_dias ?? 0) > 0 && (

          <IncapacidadSection historial={historial} onChange={setHistorial} disabled />

        )}

      </div>



      {user?.role === "medico" && !historial.firmado && (

        <footer className="historial-consulta__footer">

          <Link to={`/historial/editar/${historialId}`}>

            <Button>Revisar y firmar</Button>

          </Link>

        </footer>

      )}

    </div>

  );

}

