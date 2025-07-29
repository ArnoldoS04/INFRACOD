import React, { useState, useEffect } from "react";
import authFetch from "../../components/AuthFecth";

export const Dashboard = () => {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchMensaje = async () => {
      try {
        const res = await authFetch.get("/auth/consult");
        setMensaje(res.data.mensaje);
      } catch (err) {
        console.error("Error al consultar", err);
        setMensaje("Error al consultar");
      }
    };

    fetchMensaje(); // llamada automática al cargar el componente
  }, []); // el array vacío asegura que solo se ejecute una vez

  return (
    <div>
      <h1>{mensaje}</h1>
    </div>
  );
};
