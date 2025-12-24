import React, { useState } from "react";
import {
  CCol,
  CButton,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CCard,
  CCardHeader,
  CCardBody,
  CFormTextarea,
  CRow,
} from "@coreui/react";
import { CustomSelect } from "../../components/CustomSelect";
import authFetch from "../../components/AuthFecth";
import ToastContainer from "../../components/ToastConainer";

const NewProject = () => {
  // Inputs
  const [correlativo, setCorrelativo] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [monto, setMonto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [validated, setValidated] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Función para mostrar Toasts
  const showToast = (message, color = "danger") => {
    const id = Date.now(); // ID único
    setToasts((prev) => [...prev, { id, message, color }]);
  };

  // Validacion de formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return; // Si no es válido, no sigue
    }
    setValidated(true);

    try {
      const ingresoData = {
        ing_categoria: Number(categoriaSeleccionada),
        ing_cot_correlativo: correlativo || null, // Llenar según el valor real
        ing_metodo_pago: Number(metodoPagoSeleccionado),
        ing_nreferencia: referencia,
        ing_descripcion: comentarios,
        ing_fecha_fact: new Date(fechaPago),
        ing_monto: parseFloat(monto),
      };
      const res = await authFetch.post("/fin/income", ingresoData);
      showToast("Ingreso guardado exitosamente", "success");
      // Después del POST exitoso:
      setCategoriaSeleccionada("");
      setCorrelativo("");
      setMetodoPagoSeleccionado("");
      setReferencia("");
      setComentarios("");
      setFechaPago("");
      setMonto("");
      setValidated(false);
    } catch (error) {
      console.log("Error al guardar ingreso", error);
      showToast("Error al guardar ingreso", "danger");
    }
  };

  // Obtiene datos de cotizacion
  const handleObtieneDatos = async (correlativo) => {
    try {
      const res = await authFetch.get(`/sales/datacoti/${correlativo}`);
      const cotizacion = res.data;
    } catch (e) {
      showToast("No se encontró la cotización", "warning");
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Nuevo Proyecto</strong>
        </CCardHeader>
        <CCardBody>
          <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <CCol md={3}>
              <CInputGroup>
                <CFormInput
                  placeholder="Ingrese No. de cotización"
                  type="text"
                  id="correlativo"
                  value={correlativo}
                  onChange={(e) => setCorrelativo(e.target.value)}
                />
                <CButton
                  type="button"
                  color="primary"
                  onClick={() => handleObtieneDatos(correlativo)}
                >
                  Buscar
                </CButton>
              </CInputGroup>
            </CCol>

            <CCol md={6}>
              <CFormInput hidden />
            </CCol>
            <CCol md={5}>
              <CFormInput
                type="text"
                feedbackValid="Looks good!"
                id="cliente"
                label="Cliente"
                readOnly
              />
            </CCol>
            <CCol md={5}>
              <CFormInput
                type="text"
                feedbackValid="Looks good!"
                id="empresa"
                label="Empresa"
                readOnly
              />
            </CCol>
            <CCol md={2}>
              <CFormInput
                label="Total Venta"
                type="text"
                aria-describedby="inputGroupPrependFeedback"
                feedbackValid="Please choose a username."
                id="totalVenta"
                readOnly
              />
            </CCol>
            <hr className="my-4" />
            <CRow>
              <CCol md={6}>
                <CFormTextarea
                  id="comentarios"
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  placeholder="Escriba sus comentarios aquí..."
                  rows={3}
                  style={{ resize: "none", overflow: "hidden" }}
                  required
                />
              </CCol>

              <CCol md={6}>
                <CRow>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      aria-describedby="validationCustom05Feedback"
                      id="validationCustom05"
                      placeholder="Referencia"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      required
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Fecha inicio:</CFormLabel>
                  </CCol>
                  <CCol md={3}>
                    <CFormInput
                      type="date"
                      id="fechaInicio"
                      name="fechaInicio"
                      required
                      onKeyDown={(e) => e.preventDefault()}
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      min={1}
                      step={0.1}
                      aria-describedby="validationCustom05Feedback"
                      id="validationCustom05"
                      placeholder="Monto"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      required
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Fecha fin:</CFormLabel>
                  </CCol>
                  <CCol md={3}>
                    <CFormInput
                      type="date"
                      id="fechaFin"
                      name="fechaFin"
                      required
                      onKeyDown={(e) => e.preventDefault()}
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit">
                Registrar Ingreso
              </CButton>
            </CCol>
          </CForm>
        </CCardBody>
      </CCard>
      <ToastContainer toasts={toasts} setToasts={setToasts} />
    </>
  );
};

export default NewProject;
