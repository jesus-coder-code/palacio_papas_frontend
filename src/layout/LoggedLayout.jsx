import { Row, Col, Container } from "react-grid-system";
import { Sidebar } from "primereact/sidebar";
import { Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import { PanelMenu } from "primereact/panelmenu";
import { useNavigate } from "react-router-dom";
import { sideBar, user } from "../stores";
import { token } from "../lib/token";

export function LoggedLayout() {
  return (
    <div>
      <SideBarOwn />
      <Container fluid className="w-100 vh-100">
        <Row>
          <Col className="p-0 m-0" md={12}>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function SideBarOwn() {
  const [stateSideBar, setStateSideBar] = useRecoilState(sideBar);
  const [userAuth, _] = useRecoilState(user);
  const navigate = useNavigate();
  let items = [];

  if (userAuth?.role === "Admin") {
    items = [
      {
        label: "Usuarios",
        icon: "pi pi-fw pi-user",
        items: [
          {
            command: () => {
              navigate("crear-usuarios");
              setStateSideBar(false);
            },
            label: "Crear Usuarios",
            icon: "pi pi-fw pi-user-plus",
          },
        ],
      },
      {
        label: "Módulo ventas",
        icon: "pi pi-fw pi-shopping-cart",
        items: [
          {
            command: () => {
              navigate("historial-cortesias");
              setStateSideBar(false);
            },
            label: "Historial de Cortesias",
            icon: "pi pi-fw pi-pencil",
          },
          {
            label: "Ventas",
            icon: "pi pi-fw pi-pencil",
            command: () => {
              navigate("");
              setStateSideBar(false);
            },
          },
          {
            command: () => {
              navigate("reporte-diario");
              setStateSideBar(false);
            },
            label: "Reporte Diario",
            icon: "pi pi-fw pi-pencil",
          },
          {
            command: () => {
              navigate("pagos");
              setStateSideBar(false);
            },
            label: "Pagos",
            icon: "pi pi-fw pi-pencil",
          },
          {
            command: () => {
              navigate("administrar-productos");
              setStateSideBar(false);
            },
            label: "Administrar Producto",
            icon: "pi pi-fw pi-pencil",
          },
          {
            command: () => {
              navigate("administrar-categorias");
              setStateSideBar(false);
            },
            label: "Administrar Categoría",
            icon: "pi pi-fw pi-pencil",
          },
          {
            command: () => {
              navigate("gastos-admin");
              setStateSideBar(false);
            },
            label: "Gastos diarios",
            icon: "pi pi-fw pi-pencil",
          },
        ],
      },
      {
        label: "Salir",
        icon: "pi pi-fw pi-arrow-left",
        command: () => {
          token.clearToken();
          window.location.reload();
        },
      },
    ];
  }

  if (userAuth?.role === "Cashier") {
    items = [
      {
        label: "Módulo ventas",
        icon: "pi pi-fw pi-shopping-cart",
        items: [
          {
            label: "Ventas",
            icon: "pi pi-fw pi-pencil",
            command: () => {
              navigate("");
              setStateSideBar(false);
            },
          },
          {
            command: () => {
              navigate("reporte-diario");
              setStateSideBar(false);
            },
            label: "Reporte Diario",
            icon: "pi pi-fw pi-pencil",
          },
          {
            command: () => {
              navigate("historial-ventas");
              setStateSideBar(false);
            },
            label: "Historial de Ventas",
            icon: "pi pi-fw pi-pencil",
          },
          {
            command: () => {
              navigate("gastos-diarios");
              setStateSideBar(false);
            },
            label: "Gastos diarios",
            icon: "pi pi-fw pi-pencil",
          },
        ],
      },
      {
        label: "Salir",
        icon: "pi pi-fw pi-arrow-left",
        command: () => {
          token.clearToken();
          window.location.reload();
        },
      },
    ];
  }

  return (
    <Sidebar visible={stateSideBar} onHide={() => setStateSideBar(false)}>
      <PanelMenu model={items} className="w-100" />
    </Sidebar>
  );
}
