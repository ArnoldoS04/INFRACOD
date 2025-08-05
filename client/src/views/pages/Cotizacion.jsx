import React, { useRef, useState } from "react";
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CRow,
  CPagination,
  CPaginationItem,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import html2pdf from "html2pdf.js";
import CotizacionPDFTemplate from "../../components/CotizacionPDF";
import authFetch from "../../components/AuthFecth";

const ValidationExample = () => {
  const [validatedG, setValidatedG] = useState(false);
  const [validated, setValidated] = useState(false);
  const [comments, setComments] = useState("");
  const [showTable, setShowTable] = useState(false); // Estado para mostrar/ocultar la tabla
  const formRef = useRef(null);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Número máximo de items por página
  const subtotal = items.reduce((acc, item) => acc + parseFloat(item.total), 0);
  const pdfRef = useRef();
  const [visibleLg, setVisibleLg] = useState(false);
  const commentsRef = useRef(null);

  const [nombreCliente, setNombreCliente] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [nit, setNit] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contacto, setContacto] = useState("");
  const [nog, setNog] = useState("");
  const [fechaValida, setFechaValida] = useState("");
  const [correlativo, setCorrelativo] = useState("");
  const [toasts, setToasts] = useState([]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      setVisibleLg(!visibleLg);
    }

    setValidatedG(true);
  };

  const handleTextareaResize = () => {
    const textarea = commentsRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // set new height
    }
  };

  const handleAddItem = (event) => {
    event.preventDefault();
    const form = formRef.current;

    // Si no es valido muestra los mensajes
    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    // Obtiene los valores
    const det_descripcion = form.item.value;
    const det_cantidad = form.cantidad.value;
    const det_precio_unitario = form.precioV.value;
    const total = det_precio_unitario * det_cantidad;

    // Agrega a la lista
    setItems([
      ...items,
      { det_descripcion, det_cantidad, det_precio_unitario, total },
    ]);

    setShowTable(true);

    // Limpiar campos
    form.item.value = "";
    form.cantidad.value = "";
    form.precioV.value = "";

    setValidated(false);
  };

  const showToast = (message, color = "danger") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, color }]);
  };

  const resetForm = () => {
    setValidatedG(false);
    setValidated(false);
    setComments("");
    setShowTable(false);
    setItems([]);
    setCurrentPage(1);
    setNombreCliente("");
    setEmpresa("");
    setNit("");
    setDireccion("");
    setContacto("");
    setNog("");
    setFechaValida("");
    setCorrelativo("");
    setVisibleLg(false);
  };

  const generatePDF = async () => {
    try {
      const res = await authFetch.post("/sales/cotinsert", {
        coti_nombre: nombreCliente,
        coti_empresa: empresa,
        coti_nit: nit,
        coti_direccion: direccion,
        coti_tel: contacto,
        coti_nog: nog,
        coti_terminos: comments,
        coti_total: subtotal.toFixed(2),
        coti_fecha_valida: fechaValida,
        items,
      });
      if (!res.data || !res.data.correlativo) return;

      const correlativoGenerado = res.data.correlativo;
      setCorrelativo(correlativoGenerado);

      // Esperar a que React actualice el estado y renderice el template con el correlativo nuevo
      await new Promise((resolve) => setTimeout(resolve, 100)); // pequeño delay

      const opt = {
        margin: 0.5,
        filename: `Cotización-${correlativoGenerado}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "letter", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(pdfRef.current).save();

      // ✅ Reiniciar formulario
      resetForm();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.mensaje
      ) {
        showToast(error.response.data.mensaje, "danger");
      } else {
        alert("Error inesperado");
      }
    }
  };

  const handleDeleteItem = (indexToDelete) => {
    const newItems = items.filter((_, index) => index !== indexToDelete);
    setItems(newItems);
    // Si ya no hay items, ocultar la tabla
    if (newItems.length === 0) {
      setShowTable(false);
    }
  };

  // Calcular los items a mostrar en función de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Crear Cotización</strong>
      </CCardHeader>
      <CCardBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validatedG}
          onSubmit={handleSubmit}
        >
          {/* <CCol md={3}>
            <CInputGroup>
              <CFormInput
                placeholder="Ingrese NIT del cliente"
                type="text"
                id="nitCliente"
                required
              />
              <CButton type="button" color="primary" hidden>
                Buscar
              </CButton>
            </CInputGroup>
          </CCol>

          <CCol md={9}>
            <CFormInput hidden />
          </CCol> */}
          <CCol md={4}>
            <CFormInput
              type="text"
              id="nameEmpresa"
              label="Empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            />
          </CCol>

          <CCol md={4}>
            <CFormInput
              type="text"
              feedbackInvalid="Ingrese el nombre del cliente"
              id="nombreCliente"
              label="Nombre cliente"
              required
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
            />
          </CCol>

          <CCol md={2}>
            <CFormInput
              type="text"
              feedbackInvalid="Ingrese nit del cliente"
              id="nitCliente"
              label="NIT"
              required
              value={nit}
              onChange={(e) => setNit(e.target.value)}
            />
          </CCol>
          <CCol md={2}>
            <CFormInput
              type="date"
              id="fechaValida"
              name="fechaValida"
              label="Fecha válida hasta"
              required
              min={new Date().toISOString().split("T")[0]} // impide seleccionar fechas pasadas
              onKeyDown={(e) => e.preventDefault()}
              value={fechaValida}
              onChange={(e) => setFechaValida(e.target.value)}
            />
          </CCol>

          <CCol md={6}>
            <CFormInput
              type="text"
              id="direccionC"
              label="Dirección"
              required
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </CCol>

          <CCol md={3}>
            <CFormInput
              type="text"
              id="contacto"
              label="Contacto"
              required
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
            />
          </CCol>

          <CCol md={3}>
            <CFormInput
              type="number"
              id="nNog"
              label="NOG"
              value={nog}
              onChange={(e) =>
                setNog(
                  e.target.value.trim() === "" ? null : Number(e.target.value)
                )
              }
            />
          </CCol>

          <hr className="my-4" />
          {/* Items de cotización */}
          <CForm
            className={`row g-3 needs-validation ${
              validated ? "was-validated" : ""
            }`}
            ref={formRef}
            noValidate
          >
            <CCol md={6}>
              <CFormInput
                type="text"
                id="item"
                placeholder="Descripción"
                feedbackInvalid="Ingrese descripción del item"
                required
              />
            </CCol>
            <CCol md={2}>
              <CFormInput
                type="number"
                feedbackInvalid="Ingrese la cantidad"
                id="cantidad"
                placeholder="Cantidad"
                required
              />
            </CCol>
            <CCol md={2}>
              <CFormInput
                type="number"
                step="0.01"
                feedbackInvalid="Ingrese el precio"
                id="precioV"
                placeholder="Precio"
                required
              />
            </CCol>
            <CCol md={2}>
              <CButton color="primary" onClick={handleAddItem}>
                <FontAwesomeIcon icon={faPlus} />
              </CButton>
            </CCol>
          </CForm>
          {/* Tabla de items */}
          <hr className="my-2" />

          {showTable && (
            <>
              <CPagination size="sm" className="justify-content-end">
                <CPaginationItem
                  aria-label="Previous"
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  <span aria-hidden="true">&laquo;</span>
                </CPaginationItem>

                {Array.from(
                  { length: Math.ceil(items.length / itemsPerPage) },
                  (_, index) => (
                    <CPaginationItem
                      key={index + 1}
                      active={currentPage === index + 1}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </CPaginationItem>
                  )
                )}

                <CPaginationItem
                  aria-label="Next"
                  disabled={
                    currentPage === Math.ceil(items.length / itemsPerPage)
                  }
                  onClick={() => paginate(currentPage + 1)}
                >
                  <span aria-hidden="true">&raquo;</span>
                </CPaginationItem>
              </CPagination>

              <table className="table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                    <th></th> {/* Columna para botón eliminar */}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => {
                    const realIndex = indexOfFirstItem + index;
                    return (
                      <tr key={realIndex}>
                        <td>{item.det_descripcion}</td>
                        <td>{item.det_cantidad}</td>
                        <td>
                          {parseFloat(item.det_precio_unitario).toFixed(2)}
                        </td>
                        <td>{parseFloat(item.total).toFixed(2)}</td>
                        <td>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteItem(realIndex)}
                          >
                            <FontAwesomeIcon icon={faTrash} color="#fff" />
                          </CButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Este div se oculta y es el contenido que se convertirá en PDF */}
              <CToaster placement="top-end">
                {toasts.map((toast) => (
                  <CToast
                    key={toast.id}
                    autohide
                    visible
                    delay={4000}
                    color={toast.color}
                    className="text-white align-items-center"
                    onClose={() =>
                      setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                    }
                    style={{ zIndex: 9999 }}
                  >
                    <div className="d-flex">
                      <CToastBody>{toast.message}</CToastBody>
                      <CToastClose className="me-2 m-auto" />
                    </div>
                  </CToast>
                ))}
              </CToaster>
            </>
          )}

          {/* Cuadro te totales */}
          <hr className="my-4" />
          <CContainer className="mt-4">
            <CCard>
              <CCardBody>
                <CRow className="justify-content-end">
                  <CCol xs="12" md="6">
                    {/* <CRow className="mb-2">
                      <CCol className="text-end">Subtotal:</CCol>
                      <CCol className="text-end">Q{subtotal.toFixed(2)}</CCol>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol className="text-end">ISR (5%):</CCol>
                      <CCol className="text-end">
                        Q{(subtotal * 0.05).toFixed(2)}
                      </CCol>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol className="text-end">Otros gastos:</CCol>
                      <CCol className="text-end">Q{(150).toFixed(2)}</CCol>
                    </CRow> */}
                    {/* <hr /> */}
                    <CRow className="fw-bold">
                      <CCol className="text-end text-info">Total:</CCol>
                      <CCol className="text-end text-info">
                        Q{subtotal.toFixed(2)}
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CContainer>

          <hr className="my-4" />
          {/* Cuadro de Términos y Condiciones */}
          <CRow className="mb-3">
            <CCol xs={12}>
              <CFormTextarea
                id="comentarios"
                label="Términos y Condiciones"
                placeholder="Escriba sus comentarios aquí..."
                rows={1}
                style={{ resize: "none", overflow: "hidden" }} // Deshabilitar redimensionamiento
                value={comments}
                onChange={(event) => {
                  setComments(event.target.value);
                  handleTextareaResize();
                }}
                ref={commentsRef}
                onInput={handleTextareaResize}
                required
              />
            </CCol>
          </CRow>
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
                  <CotizacionPDFTemplate
                    ref={pdfRef}
                    cotizacion={{
                      cliente: nombreCliente,
                      empresa: empresa,
                      nit: nit,
                      direccion: direccion,
                      tel: contacto,
                      nog: nog,
                      fecha_valida: fechaValida,
                      coti_terminos: comments,
                      total: subtotal.toFixed(2), // total con IVA
                      items: items,
                    }}
                    correlativo={correlativo}
                  />
                </div>
              </div>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisibleLg(false)}>
                Cerrar
              </CButton>
              <CButton color="primary" onClick={generatePDF}>
                Guardar
              </CButton>
            </CModalFooter>
          </CModal>

          <CCol xs={12}>
            <CButton color="primary" type="submit">
              Vista Previa
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};
export default ValidationExample;
