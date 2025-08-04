import React, { useState, useEffect } from "react";
import TableFilter from "../../components/TableFilter";
import { CButton } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import authFetch from "../../components/AuthFecth";

const CotiReport = () => {
  const [data, setData] = useState([]);

  const dataCoti = async () => {
    try {
      const res = await authFetch("/sales/datacoti");
      setData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error al obtener datos de cotizaciones:", error);
    }
  };

  useEffect(() => {
    dataCoti(); // Se ejecuta al cargar el componente
  }, []);

  const columnas = [
    {
      name: "Correlativo",
      selector: (row) => row.coti_correlativo,
      sortable: true,
    },
    {
      name: "Empresa",
      selector: (row) => row.coti_empresa,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.coti_nombre,
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) => row.coti_total,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <CButton size="sm" onClick={() => console.log("Editar:", row)}>
            <FontAwesomeIcon icon={faEye} />
          </CButton>
          <CButton size="sm" onClick={() => console.log("Editar:", row)}>
            <FontAwesomeIcon icon={faPen} />
          </CButton>
          <CButton size="sm" onClick={() => console.log("Eliminar:", row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </CButton>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <TableFilter
      columnas={columnas}
      data={data}
      filterFields={["coti_correlativo", "coti_empresa", "coti_nombre"]}
    />
  );
};

export default CotiReport;
