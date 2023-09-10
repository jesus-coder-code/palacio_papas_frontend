import { useState, useEffect, useRef } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { useQuery, useMutation } from "react-query";
import { Container, Row, Col } from "react-grid-system";
import { css } from "@emotion/react";
import { Button } from "primereact/button";
import { useRecoilState } from "recoil";
import { getExpenseByUser, daletePayment } from "../../../api";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useNavigate } from "react-router-dom";
import { sideBar } from "../../../stores";
import { CreateUpdateModal } from "./partials";
import { user } from "../../../stores";
import dayjs from "dayjs";
import numbro from "numbro";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export function Gastos() {
  const [_, setControlSideBar] = useRecoilState(sideBar);

  const [userAuth] = useRecoilState(user);

  const { open, onClose, onOpen } = useDisclosure();
  const [id, setId] = useState(null);

  const { data, isSuccess, refetch } = useQuery({
    queryKey: "getPayments",
    queryFn: getExpenseByUser,
  });

  const navigation = useNavigate();
  const mutation = useMutation(() => daletePayment(id), {
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
  });

  const toast = useRef(null);

  const accept = async () => {
    await mutation.mutateAsync();
  };

  const confirm2 = () => {
    confirmDialog({
      message: "¿Desea borrar este pago?",
      header: "Confirmación de borrar pago",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
    });
  };

  useEffect(() => {
    if (userAuth?.role != "Cashier") {
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
            pago: numbro(parseInt(item?.total)).format("0,0"),
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
                onOpen();
              }}
            >
              Crear Gasto
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
              <Column field="pago" header="GASTO TOTAL"></Column>
              <Column field="eliminar"></Column>
            </TreeTable>
          </div>
        </Col>
      </Row>
      <CreateUpdateModal categories={data} open={open} onClose={onClose} />
    </Container>
  );
}
