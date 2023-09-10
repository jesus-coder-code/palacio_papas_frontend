import { useState, useEffect, useRef } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { useQuery, useMutation } from "react-query";
import { Container, Row, Col } from "react-grid-system";
import { Toast } from "primereact/toast";
import { css } from "@emotion/react";
import { Button } from "primereact/button";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from "primereact/progressspinner";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { getReportCashier, getReporteAll } from "../../../api";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { sideBar } from "../../../stores";
import { CreateUpdateModal } from "./partials";
import { user } from "../../../stores";
import dayjs from "dayjs";

export function ReporteDiario() {
  const [_, setControlSideBar] = useRecoilState(sideBar);

  const methods = useForm();
  const [userAuth] = useRecoilState(user);
  const navigation = useNavigate();
  const { open, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    if (userAuth?.role != "Admin" && userAuth?.role != "Cashier") {
      navigation("/");
    }
  }, [userAuth]);

  const mutation = useMutation(
    ({ date }) =>
      userAuth?.role == "Admin" ? getReporteAll(date) : getReportCashier(date),
    {
      onSuccess: (resp) => {
        methods.setValue("data", resp[0].data);
      },
    }
  );

  /*   useEffect(() => {
    if (isSuccess && data) {
      const files = data?.data.
    }
  }, [isSuccess, data]); */

  const fechaBuscarValue = useWatch({
    control: methods.control,
    name: "fechaBuscar",
    defaultValue: new Date(),
  });

  const toast = useRef(null);

  const onSubmit = async (e) => {
    methods.setValue("data", null);
    await mutation.mutateAsync({
      date: dayjs(fechaBuscarValue).format("YYYY-MM-DD").toString(),
    });
  };

  const data = useWatch({
    control: methods.control,
    name: "data",
    defaultValue: null,
  });

  return (
    <FormProvider {...methods}>
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
              <h4>Reporte Diario</h4>
              {data !== null && (
                <Button
                  onClick={() => {
                    onOpen(true);
                  }}
                >
                  Reporte completo
                </Button>
              )}
            </div>

            <Container fluid style={{ marginLeft: "2rem" }}>
              <Row>
                <Col xs={12} lg={1.5}>
                  <Calendar
                    name="fechaBuscar"
                    value={fechaBuscarValue}
                    onChange={(e) => methods.setValue("fechaBuscar", e.value)}
                  />
                </Col>
                <Col lg={3}>
                  <Button onClick={methods.handleSubmit(onSubmit)}>
                    Buscar registro
                  </Button>
                </Col>
              </Row>
            </Container>

            {mutation.isSuccess &&
              (() => {
                const itemVar = mutation.data[0];

                if (userAuth.role === "Admin") {
                  if (itemVar?.data[0].quantityByProduct.length <= 0) {
                    toast.current.show({
                      severity: "error",
                      summary: "Error",
                      detail: "Este día no tiene ninguna venta que mostrar",
                      sticky: true,
                      life: 3000,
                    });
                    mutation.reset();
                    return <></>;
                  }

                  if (!Array.isArray(itemVar?.data[0].quantityByProduct)) {
                    return <></>;
                  }

                  const items = itemVar?.data[0].quantityByProduct.map(
                    (item, i) => {
                      return {
                        key: i,
                        data: {
                          name: item?.productName,
                          description: item?.quantitySale,
                        },
                      };
                    }
                  );

                  return (
                    <div
                      css={css`
                        margin-left: 3rem;
                        margin-right: 3rem;
                        margin-top: 2rem;
                      `}
                    >
                      <TreeTable
                        value={items}
                        paginator
                        rows={5}
                        rowsPerPageOptions={[5, 10, 25]}
                        tableStyle={{ minWidth: "100%" }}
                      >
                        <Column field="name" header="NOMBRE" expander></Column>
                        <Column
                          field="description"
                          header="CANTIDAD VENDIDA"
                        ></Column>
                      </TreeTable>
                    </div>
                  );
                }

                if (itemVar?.data[0].productSale.length <= 0) {
                  toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Este día no tiene ninguna venta que mostrar para este cajero",
                    sticky: true,
                    life: 3000,
                  });
                  mutation.reset();
                  return <></>;
                }

                if (!Array.isArray(itemVar?.data[0].productSale)) {
                  return <></>;
                }

                const items = itemVar?.data[0].productSale.map(
                  (item, i) => {
                    return {
                      key: i,
                      data: {
                        name: item?.productName,
                        description: item?.quantitySale,
                      },
                    };
                  }
                );

                return (
                  <div
                    css={css`
                      margin-left: 3rem;
                      margin-right: 3rem;
                      margin-top: 2rem;
                    `}
                  >
                    <TreeTable
                      value={items}
                      paginator
                      rows={5}
                      rowsPerPageOptions={[5, 10, 25]}
                      tableStyle={{ minWidth: "100%" }}
                    >
                      <Column field="name" header="NOMBRE" expander></Column>
                      <Column
                        field="description"
                        header="CANTIDAD VENDIDA"
                      ></Column>
                    </TreeTable>
                  </div>
                );
              })()}

            {mutation.isLoading && (
              <div
                css={css`
                  margin-top: 1rem;
                  width: 100%;
                  display: grid;
                  place-content: center;
                `}
              >
                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <CreateUpdateModal
        userRole={userAuth?.role}
        data={data}
        open={open}
        onClose={onClose}
      />
      <Toast ref={toast} position="bottom-center" />
    </FormProvider>
  );
}
