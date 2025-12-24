import React, { useRef, useState, useEffect } from "react";
import TableFilter from "../../components/TableFilter";
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFileDownload,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import authFetch from "../../components/AuthFecth";
import CotizacionPDFTemplate from "../../components/CotizacionPDF";
import { formatCurrency } from "../../components/formatCurrency";
import html2pdf from "html2pdf.js";

const CotiReport = () => {
  const pdfRef = useRef();
  const [data, setData] = useState([]);
  const [selectedCoti, setSelectedCoti] = useState(null);
  const [visibleLg, setVisibleLg] = useState(false);

  const dataCoti = async () => {
    try {
      const res = await authFetch("/sales/datacoti");
      setData(res.data);
    } catch (error) {
      console.error("Error al obtener datos de cotizaciones:", error);
    }
  };

  const handleView = (row) => {
    setSelectedCoti(row);
    setVisibleLg(!visibleLg);
  };

  const handleDownload = async (row) => {
    setSelectedCoti(row);
    setVisibleLg(true);
    await new Promise((resolve) => setTimeout(resolve, 100)); // pequeño delay
    setVisibleLg(false);
    try {
      const opt = {
        margin: 0.5,
        filename: `Cotización-${row.coti_correlativo}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "letter", orientation: "portrait" },
      };
      console.log("Generando PDF...");
      await html2pdf().set(opt).from(pdfRef.current).save();
    } catch (error) {
      console.log("Error ", error);
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
      selector: (row) => formatCurrency(row.coti_total),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <CButton size="sm" onClick={() => handleView(row)}>
            <FontAwesomeIcon icon={faEye} color="#5856d6" />
          </CButton>
          <CButton
            size="sm"
            onClick={() => console.log("Editar:", row.detalle_cotizacion)}
          >
            <FontAwesomeIcon icon={faPen} color="blue" />
          </CButton>
          <CButton size="sm" onClick={() => handleDownload(row)}>
            <FontAwesomeIcon icon={faFileDownload} size="lg" color="green" />
          </CButton>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <TableFilter
        columnas={columnas}
        data={data}
        filterFields={["coti_correlativo", "coti_empresa", "coti_nombre"]}
      />
      <CModal
        size="lg"
        visible={visibleLg}
        onClose={() => setVisibleLg(false)}
        aria-labelledby="OptionalSizesExample2"
        scrollable
      >
        <CModalHeader>
          <CModalTitle id="OptionalSizesExample2">Vista Previa</CModalTitle>
        </CModalHeader>
        <CModalBody
          style={{
            padding: 0,
            overflowX: "hidden", // Elimina scroll horizontal en el body
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center", // Centra horizontalmente
              alignItems: "flex-start",
              overflowY: "auto", // Solo scroll vertical si lo necesita
              overflowX: "hidden",
            }}
          >
            <div
              style={{
                transform: "scale(0.75)",
                transformOrigin: "top center", // Mantiene el contenido centrado
                width: "816px",
                height: "1055px",
              }}
            >
              {selectedCoti && (
                <CotizacionPDFTemplate
                  ref={pdfRef}
                  cotizacion={{
                    cliente: selectedCoti.coti_nombre,
                    empresa: selectedCoti.coti_empresa,
                    nit: selectedCoti.coti_nit,
                    direccion: selectedCoti.coti_direccion,
                    tel: selectedCoti.coti_tel,
                    nog: selectedCoti.coti_nog,
                    fecha_valida: selectedCoti.coti_fecha_valida?.slice(0, 10),
                    coti_terminos: selectedCoti.coti_terminos,
                    total: Number(selectedCoti.coti_total).toFixed(2),
                    items: selectedCoti.detalle_cotizacion,
                  }}
                  correlativo={selectedCoti.coti_correlativo}
                />
              )}
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleLg(false)}>
            Cerrar
          </CButton>
          {/* <CButton color="primary">Guardar</CButton> */}
        </CModalFooter>
      </CModal>
    </>
  );
};

export default CotiReport;
