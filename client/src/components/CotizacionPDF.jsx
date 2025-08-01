import React from "react";
import * as NumeroALetras from "numero-a-letras";

const MAX_HEIGHT = 600;

const CotizacionPDFTemplate = React.forwardRef(
  ({ cotizacion, correlativo }, ref) => {
    function dividirItemsPorAltura(items, ref, maxHeight = MAX_HEIGHT) {
      if (!ref.current) return [items]; // fallback

      const fakeTable = document.createElement("table");
      fakeTable.style.visibility = "hidden";
      fakeTable.style.position = "absolute";
      fakeTable.style.top = "0";
      fakeTable.style.left = "0";
      fakeTable.style.width = "816px";
      fakeTable.style.fontSize = "14px";
      fakeTable.style.borderCollapse = "collapse";

      document.body.appendChild(fakeTable);

      const pages = [];
      let currentPage = [];
      let currentHeight = 0;

      for (let i = 0; i < items.length; i++) {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td style="padding:6px;border-bottom:1px solid #000">${
        items[i].descripcion
      }</td>
      <td style="padding:6px;border-bottom:1px solid #000">${
        items[i].cantidad
      }</td>
      <td style="padding:6px;border-bottom:1px solid #000">Q ${parseFloat(
        items[i].precio
      ).toFixed(2)}</td>
      <td style="padding:6px;border-bottom:1px solid #000">Q ${(
        items[i].precio * items[i].cantidad
      ).toFixed(2)}</td>
    `;

        fakeTable.appendChild(row);
        const height = row.getBoundingClientRect().height;

        if (currentHeight + height > maxHeight) {
          pages.push(currentPage);
          currentPage = [];
          currentHeight = 0;
        }

        currentPage.push(items[i]);
        currentHeight += height;
      }

      if (currentPage.length > 0) {
        pages.push(currentPage);
      }

      document.body.removeChild(fakeTable);
      return pages;
    }

    const items = cotizacion?.items || [];
    const pages = dividirItemsPorAltura(items, ref);

    const getSubtotal = () =>
      cotizacion?.items?.reduce((acc, i) => acc + i.precio * i.cantidad, 0) ||
      0;

    // const getIVA = () => getSubtotal() * 0.12;
    const getTotal = () => getSubtotal();
    let resultado = NumeroALetras.NumerosALetras(getTotal().toFixed(2));
    // Reemplaza "Pesos" por "quetzales" (ignorando mayúsculas/minúsculas)
    resultado = resultado
      .replace(/pesos/i, "Quetzales con")
      .replace(/M\.N\./i, "Centavos")
      .trim();

    return (
      <div ref={ref}>
        {pages.map((pageItems, index) => (
          <div
            key={index}
            style={{
              backgroundImage: "url('/bk-coti.png')",
              backgroundSize: "100% 1055px",
              backgroundRepeat: "no-repeat",
              width: "816px",
              height: "1053px",
              position: "relative",
              fontFamily: "Arial, sans-serif",
              color: "#000",
              padding: "100px 60px",
              boxSizing: "border-box",
              pageBreakAfter: index < pages.length - 1 ? "always" : "auto",
            }}
          >
            {index === 0 && (
              <>
                {/* Encabezado */}
                <h2
                  style={{
                    textAlign: "right",
                    color: "#fff",
                    marginTop: "-60px",
                  }}
                >
                  COTIZACIÓN
                </h2>
                <p
                  style={{
                    textAlign: "right",
                    color: "#fff",
                    marginTop: "-10px",
                  }}
                >
                  <strong>No. </strong> {correlativo}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "-15PX",
                  }}
                >
                  <img
                    src="/logo-infracod-white.png"
                    alt="Logo"
                    width={95}
                    height={100}
                  />
                  <div
                    style={{
                      color: "black",
                      position: "relative",
                      top: "-5px",
                    }}
                  >
                    <h5 style={{ margin: 0, fontWeight: "bold" }}>INFRACOD</h5>
                    <p style={{ margin: 0 }}>+502 5178 6391</p>
                    <p style={{ margin: 0 }}>info@infracod.com</p>
                    {/* <p style={{ margin: 0 }}>Slogan o descripción aquí</p> */}
                  </div>
                </div>

                {/* Info Cliente */}
                <hr />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div style={{ width: "48%" }}>
                    {cotizacion?.empresa && (
                      <p>
                        <strong>Empresa:</strong> {cotizacion.empresa}
                      </p>
                    )}
                    {cotizacion?.cliente && (
                      <p>
                        <strong>Cliente:</strong> {cotizacion.cliente}
                      </p>
                    )}
                    {cotizacion?.direccion && (
                      <p>
                        <strong>Dirección:</strong> {cotizacion.direccion}
                      </p>
                    )}
                    {cotizacion?.nit && (
                      <p>
                        <strong>NIT:</strong> {cotizacion.nit}
                      </p>
                    )}
                  </div>

                  <div style={{ width: "48%" }}>
                    {cotizacion?.fecha_valida && (
                      <p>
                        <strong>Válida hasta:</strong> {cotizacion.fecha_valida}
                      </p>
                    )}
                    {cotizacion?.tel && (
                      <p>
                        <strong>Contacto:</strong> {cotizacion.tel}
                      </p>
                    )}
                    {cotizacion?.nog && (
                      <p>
                        <strong>NOG:</strong> {cotizacion.nog}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Tabla */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #0f0d1d -90.72%, #3c72fc 199.51%)",
                    color: "#fff",
                  }}
                >
                  <th style={cellStyle}>Descripción</th>
                  <th style={cellStyle}>Cantidad</th>
                  <th style={cellStyle}>Precio</th>
                  <th style={cellStyle}>Total</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item, idx) => (
                  <tr key={idx} style={{ pageBreakInside: "avoid" }}>
                    <td style={cellStyle}>{item.descripcion}</td>
                    <td style={cellStyle}>{item.cantidad}</td>
                    <td style={cellStyle}>
                      Q {parseFloat(item.precio).toFixed(2)}
                    </td>
                    <td style={cellStyle}>
                      Q {(item.precio * item.cantidad).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totales solo en la última página */}
            {}
            {index === pages.length - 1 && (
              <>
                <p style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>
                  {resultado}
                </p>
                <hr className="my-2" />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                    fontSize: "16px",
                  }}
                >
                  {/* Términos y condiciones - lado derecho */}
                  <div style={{ textAlign: "left", width: "48%" }}>
                    <p style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>
                      <strong>Términos y condiciones:</strong>
                      <br />
                      {cotizacion?.coti_terminos ||
                        "No se especificaron términos."}
                    </p>
                  </div>
                  {/* Totales - lado izquierdo */}
                  <div style={{ textAlign: "right", width: "48%" }}>
                    {/* <p>
                    <strong>Subtotal:</strong> Q {getSubtotal().toFixed(2)}
                  </p>
                  <p>
                    <strong>IVA (12%):</strong> Q {getIVA().toFixed(2)}
                  </p> */}
                    <p style={{ color: "#003d7c" }}>
                      <strong>Total con impuestos:</strong> Q{" "}
                      {getTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }
);

const cellStyle = {
  borderBottom: "1px solid #000",
  padding: "6px",
  textAlign: "center",
};

export default CotizacionPDFTemplate;
