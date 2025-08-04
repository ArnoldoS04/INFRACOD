import React, { useState, useEffect } from "react";
import {
  CCol,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CFormTextarea,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
} from "@coreui/react";
import { CustomSelect } from "../../components/CustomSelect";
import authFetch from "../../components/AuthFecth";
import ToastContainer from "../../components/ToastConainer";

const Egreso = () => {
  const [referencia, setReferencia] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaPago, setFechaPago] = useState("");

  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [metodoPagoOptions, setMetodoPagoOptions] = useState([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("");

  const [validated, setValidated] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, color = "danger") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, color }]);
  };

  const dataSelect = async () => {
    try {
      const metodoCat = 2;
      const catCat = 4; // diferente de ingresos, si corresponde

      const resMetodoPago = await authFetch(`/fin/categorias/${metodoCat}`);
      const resCategoria = await authFetch(`/fin/categorias/${catCat}`);

      setMetodoPagoOptions(
        resMetodoPago.data.map((item) => ({
          label: item.cat_nombre,
          value: item.idcatalogo,
        }))
      );

      setCategoriaOptions(
        resCategoria.data.map((item) => ({
          label: item.cat_nombre,
          value: item.idcatalogo,
        }))
      );
    } catch (error) {
      console.error("Error al llenar selects", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);

    try {
      const egresoData = {
        egs_categoria: Number(categoriaSeleccionada),
        egs_metodo_pago: Number(metodoPagoSeleccionado),
        egs_nreferencia: referencia,
        egs_descripcion: comentarios,
        egs_fecha_fact: new Date(fechaPago),
        egs_monto: parseFloat(monto),
      };

      await authFetch.post("/fin/expense", egresoData);
      showToast("Egreso guardado exitosamente", "success");

      // reset
      setCategoriaSeleccionada("");
      setMetodoPagoSeleccionado("");
      setReferencia("");
      setComentarios("");
      setFechaPago("");
      setMonto("");
      setValidated(false);
    } catch (error) {
      console.error("Error al guardar egreso", error);
      showToast("Error al guardar egreso", "danger");
    }
  };

  useEffect(() => {
    dataSelect();
  }, []);

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Nuevo Egreso</strong>
        </CCardHeader>
        <CCardBody>
          <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <CCol md={3}>
              <CustomSelect
                name="categoria"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                options={categoriaOptions}
                required
              />
            </CCol>
            <CCol md={3}>
              <CInputGroup>
                <CFormInput
                  placeholder="Ingrese No. de cotización"
                  type="text"
                  id="correlativo"
                  hidden
                  disabled
                />
                <CButton type="button" color="primary" disabled hidden>
                  Buscar
                </CButton>
              </CInputGroup>
            </CCol>

            {/* <CCol md={6}>
              <CFormInput hidden />
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="text"
                feedbackValid="Looks good!"
                id="validationCustom01"
                label="Cliente"
                readOnly
              />
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="text"
                feedbackValid="Looks good!"
                id="validationCustom02"
                label="Proyecto"
                readOnly
              />
            </CCol>
            <CCol md={2}>
              <CFormInput
                label="Total Venta"
                type="text"
                aria-describedby="inputGroupPrependFeedback"
                feedbackValid="Please choose a username."
                id="validationCustomUsername"
                readOnly
              />
            </CCol>
            <CCol md={2}>
              <CFormInput
                label="Total restante"
                type="text"
                aria-describedby="inputGroupPrependFeedback"
                feedbackValid="Please choose a username."
                id="validationCustomUsername"
                readOnly
              />
            </CCol> */}
            <hr />
            <CCol md={6}>
              <CFormTextarea
                id="comentarios"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Escriba sus comentarios aquí..."
                rows={3}
                required
              />
            </CCol>

            <CCol md={6}>
              <CRow>
                <CCol md={6}>
                  <CustomSelect
                    name="metodoPago"
                    value={metodoPagoSeleccionado}
                    onChange={(e) => setMetodoPagoSeleccionado(e.target.value)}
                    options={metodoPagoOptions}
                    placeholder="Método de pago"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    placeholder="Referencia"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Fecha de pago:</CFormLabel>
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    type="date"
                    name="fechaPago"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                    required
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    min={1}
                    step={0.01}
                    placeholder="Monto"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    required
                  />
                </CCol>
              </CRow>
            </CCol>

            <CCol xs={12}>
              <CButton color="primary" type="submit">
                Registrar Egreso
              </CButton>
            </CCol>
          </CForm>
        </CCardBody>
      </CCard>
      <ToastContainer toasts={toasts} setToasts={setToasts} />
    </>
  );
};

export default Egreso;
