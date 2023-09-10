import { useState, useEffect, useRef } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { useQuery, useMutation } from "react-query";
import { Container, Row, Col } from "react-grid-system";
import { css } from "@emotion/react";
import { Button } from "primereact/button";
import { useRecoilState } from "recoil";
import { getExpense, deleteGastoAdmin } from "../../../api";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useNavigate } from "react-router-dom";
import { sideBar } from "../../../stores";
import { CreateUpdateModal } from "./partials";
import { user } from "../../../stores";
import dayjs from "dayjs";
import numbro from "numbro";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useCallback } from "react";

export function GastosAdmin() {
  const [_, setControlSideBar] = useRecoilState(sideBar);

  const [userAuth] = useRecoilState(user);

  const { open, onClose, onOpen } = useDisclosure();
  const [action, setAction] = useState("create");
  /*   const [id, setId] = useState(null);
   */
  const { data, isSuccess, refetch } = useQuery({
    queryKey: "getExpense",
    queryFn: getExpense,
  });

  const navigation = useNavigate();
  const mutation = useMutation(
    ({ id }) => {
      return deleteGastoAdmin(id);
    },
    {
      onSuccess: () => {
        toast.current.show({
          severity: "info",
          summary: "Confirmado",
          detail: "Se ha eliminado el registro",
          life: 3000,
        });
        refetch();
      },
      onError: () => {
        toast.current.show({
          severity: "warn",
          summary: "Rejected",
          detail: "You have rejected",
          life: 3000,
        });
      },
    }
  );

  const toast = useRef(null);

  const accept = async (id) => {
    await mutation.mutateAsync({ id });
  };

  const confirm2 = (id) => {
    confirmDialog({
      message: "¿Desea borrar este pago?",
      header: "Confirmación de borrar pago",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => accept(id),
    });
  };

  useEffect(() => {
    if (userAuth?.role !== "Admin") {
      navigation("/");
    }
  }, [userAuth]);

  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (isSuccess && data) {
      const files = data?.data.map((item, i) => {
        return {
          key: i,
          data: {
            date: dayjs(item?.date).format("DD/MM/YYYY HH:mm:ss"),
            usuario: item?.user?.username,
            pago: numbro(parseInt(item?.total)).format("0,0"),
            eliminar: (
              <Button
                variante="danger"
                onClick={() => {
                  confirm2(item?.id);
                }}
              >
                Eliminar
              </Button>
            ),
          },
        };
      });

      setNodes(files);
    }
  }, [isSuccess, data]);

  return (
    <Container fluid className="w-100 vh-100">
      <Toast ref={toast} />
      <ConfirmDialog />
      <Row gutterWidth={30}>
        <Col sm={12} className="p-0 m-0">
          <div style={{ marginLeft: "3rem" }}>
            <div
              style={{
                display: "flex",
                marginTop: "1.5rem",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() => setControlSideBar(true)}
                link
                css={css`
                  height: 30px !important;
                `}
                icon="pi pi-align-left"
              />
              <p className="p-0 m-0" style={{ textAlign: "start" }}>
                Bievenido, Usuario
              </p>
            </div>

            <span
              style={{
                textAlign: "start",
                fontSize: "1.1rem",
              }}
            >
              Descubra fácilmente lo que necesita
            </span>
          </div>
          <div
            css={css`
              margin-left: 3rem;
              margin-right: 3rem;
              margin-top: 2.5rem;
              margin-bottom: 1.5rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <h4>Pagos</h4>
            <Button
              onClick={() => {
                setAction("create");
                onOpen();
              }}
            >
              Crear gasto
            </Button>
          </div>

          <div
            css={css`
              margin-left: 3rem;
              margin-right: 3rem;
            `}
          >
            <TreeTable
              value={nodes}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25]}
              tableStyle={{ minWidth: "100%" }}
            >
              <Column field="date" header="FECHA"></Column>
              <Column field="usuario" header="USUARIO"></Column>

              <Column field="pago" header="PAGO TOTAL"></Column>
              <Column field="eliminar"></Column>
            </TreeTable>
          </div>
        </Col>
      </Row>
      <CreateUpdateModal
        action={action}
        categories={data}
        open={open}
        onClose={onClose}
      />
    </Container>
  );
}
