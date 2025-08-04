// routes.js
import React from "react";
import { Dashboard } from "./views/pages/Dashboard";

import PrivateRoute from "./components/PrivateRoutes";
import Login from "./views/pages/login/Login";
import Page404 from "./views/pages/page404/Page404";
import Cotizacion from "./views/pages/Cotizacion";
import EditCoti from "./views/pages/EditCotizacion";
import CotiReport from "./views/pages/CotiReport";
import Ingresos from "./views/pages/Ingresos";
import Egreso from "./views/pages/Egreso";

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
        <Dashboard />
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
    path: "/editquote",
    name: "Editar Cotizacion",
    element: (
      <PrivateRoute>
        <EditCoti />
      </PrivateRoute>
    ),
  },
  {
    path: "/quotereport",
    name: "Reporte Cotizacion",
    element: (
      <PrivateRoute>
        <CotiReport />
      </PrivateRoute>
    ),
  },
  {
    path: "/income",
    name: "Registrar Ingreso",
    element: (
      <PrivateRoute>
        <Ingresos />
      </PrivateRoute>
    ),
  },
  {
    path: "/expenses",
    name: "Registrar Egreso",
    element: (
      <PrivateRoute>
        <Egreso />
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
