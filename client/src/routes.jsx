// routes.js
import React from "react";
import { Dashboard } from "./views/pages/Dashboard";
import PrivateRoute from "./components/PrivateRoutes";
import Login from "./views/pages/login/Login";
import Page404 from "./views/pages/page404/Page404";
import Cotizacion from "./views/pages/Cotizacion";
import CotizacionPDF from "./components/CotizacionPDF";

const routes = [
  {
    path: "/login",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    element: (
      <PrivateRoute>
        <CotizacionPDF />
      </PrivateRoute>
    ),
  },
  {
    path: "/newquote",
    name: "Cotizacion",
    element: (
      <PrivateRoute>
        <Cotizacion />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    name: "404",
    element: <Page404 />,
  },
];

export default routes;
