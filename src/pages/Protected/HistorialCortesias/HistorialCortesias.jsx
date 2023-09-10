import dayjs from "dayjs";
import numbro from "numbro";
import { useState, useEffect } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { useQuery } from "react-query";
import { Container, Row, Col } from "react-grid-system";
import { css } from "@emotion/react";
import { Button } from "primereact/button";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { useMutation } from "react-query";
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { getCourtesy } from "../../../api";
import { sideBar, user } from "../../../stores";

export function HistorialCortesias() {
  const [userAuth] = useRecoilState(user);
  const [_, setControlSideBar] = useRecoilState(sideBar);

  const navigation = useNavigate();
  const { data, isSuccess } = useQuery({
    queryKey: "getCoutesy",
    queryFn: getCourtesy,
  });

  useEffect(() => {
    if (userAuth?.role !== "Admin") {
      navigation("/");
    }
  }, [userAuth]);

  const [nodes, setNodes] = useState([]);

  const mutation = useMutation(({ id }) => deleteSales(id), {
    onSuccess: (resp) => {
      alert(resp?.message);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const confirm = (id) => {
    confirmDialog({
      message: "¿Desea Elimmina esta vent a?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        mutation.mutate({ id });
      },
    });
  };

  useEffect(() => {
    if (isSuccess && data) {
      const files = data?.data.map((item, i) => {
        return {
          key: i,
          data: {
            id: item?.id,
            date: dayjs(item?.date).format("DD/MM/YYYY h:mm A"),
            name: item?.client?.name,
            total: numbro(item?.total).formatCurrency({
              thousandSeparated: true,
            }),
          },
          children: [
            ...item?.products.map((itemUnit, keyIterator) => {
              return {
                key: keyIterator + 5,
                data: {
                  id: itemUnit?.product?.name,
                  date: `Cantidad: ${itemUnit?.quantity}`,
                },
              };
            }),
          ],
        };
      });

      setNodes([...files]);
    }
  }, [isSuccess, data]);

  return (
    <Container fluid className="w-100 vh-100">
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
          <h4
            css={css`
              margin-top: 2.5rem;
              margin-left: 3rem;
              margin-bottom: 1.5rem;
            `}
          >
            Historial de las cortesias
          </h4>
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
              <Column field="id" header="ID" expander></Column>
              <Column field="name" header="Nombre"></Column>
              <Column field="date" header="Fecha"></Column>
              <Column field="total" header="Total"></Column>
            </TreeTable>
          </div>
        </Col>
      </Row>
      <ConfirmDialog />
    </Container>
  );
}
