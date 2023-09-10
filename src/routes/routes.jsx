import { useState, useRef } from "react";
import { LoggedLayout } from "../layout";
import {
  Sales,
  HistorialSales,
  CategoriesAdmin,
  ProductsAdmin,
  CreateUsers,
  ReporteDiario,
  PagosAdmin,
  HistorialCortesias,
  Gastos,
  GastosAdmin
} from "../pages/Protected";
import { createBrowserRouter } from "react-router-dom";
import { element } from "prop-types";

const useRouter = () => {
  const routes = useRef(
    createBrowserRouter([
      {
        path: "/",
        element: <LoggedLayout />,
        children: [
          {
            path: "",
            element: <Sales />,
          },
          {
            path: "historial-ventas",
            element: <HistorialSales />,
          },
          {
            path: "administrar-categorias",
            element: <CategoriesAdmin />,
          },
          {
            path: "administrar-productos",
            element: <ProductsAdmin />,
          },
          {
            path: "crear-usuarios",
            element: <CreateUsers />,
          },
          {
            path: "reporte-diario",
            element: <ReporteDiario />,
          },
          {
            path: "pagos",
            element: <PagosAdmin />,
          },
          {
            path: "historial-cortesias",
            element: <HistorialCortesias />,
          },
          {
            path: "gastos-diarios",
            element: <Gastos />,
          },
          {
            path: "gastos-admin",
            element: <GastosAdmin />,
          },
        ],
      },
    ])
  );

  return { routes };
};

export default useRouter;
