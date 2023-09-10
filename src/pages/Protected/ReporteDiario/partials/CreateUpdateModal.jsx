import { Dialog } from "primereact/dialog";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Row, Col, Container } from "react-grid-system";
import { useEffect } from "react";
import numbro from "numbro";
import { Divider } from "primereact/divider";

export function CreateUpdateModal({ open, onClose, data, userRole }) {
  const methods = useForm();

  useEffect(() => {
    if (!Array.isArray(data)) {
      onClose();
    }
  }, [data]);

  return (
    data !== null && (
      <Dialog
        draggable={false}
        header={"Reporte diario detalle"}
        visible={open}
        style={{ width: "30vw" }}
        onHide={onClose}
      >
        <FormProvider {...methods}>
          <Container className="p-0 m-0" fluid>
            <Row>
              {userRole == "Admin" && (
                <>
                  <Divider />
                  <Col xs={12}>
                    <Row>
                      <Col md={6} xs={12}>
                        <p>Total de cortesías</p>
                      </Col>
                      <Col md={6} xs={12}>
                        <p>
                          {numbro(data[0].dailyCourtesy).formatCurrency({
                            thousandSeparated: true,
                          })}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </>
              )}

              {userRole == "Admin" && (
                <>
                  <Divider />
                  <Col xs={12}>
                    <Row>
                      <Col md={6} xs={12}>
                        <p>Total de pagos diarios</p>
                      </Col>
                      <Col md={6} xs={12}>
                        <p>
                          {numbro(data[0].dailyPayment || 0).formatCurrency({
                            thousandSeparated: true,
                          })}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </>
              )}
              <Divider />
              <Col xs={12}>
                <Row>
                  <Col md={6} xs={12}>
                    <p>Total de gastos diarios</p>
                  </Col>
                  <Col md={6} xs={12}>
                    <p>
                      {numbro(data[0].totalDailyExpense || 0).formatCurrency({
                        thousandSeparated: true,
                      })}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Divider />
              <Col xs={12}>
                <Row>
                  <Col md={6} xs={12}>
                    <p>Total de ventas</p>
                  </Col>
                  <Col md={6} xs={12}>
                    <p>
                      {numbro(data[0].totalDailySale || 0).formatCurrency({
                        thousandSeparated: true,
                      })}
                    </p>
                  </Col>
                </Row>
              </Col>

              {userRole == "Admin" && (
                <>
                  <Divider />
                  <Col xs={12}>
                    <Row>
                      <Col md={6} xs={12}>
                        <p>Total de descuentos</p>
                      </Col>
                      <Col md={6} xs={12}>
                        <p>
                          {numbro(data[0].totalDiscount || 0).formatCurrency({
                            thousandSeparated: true,
                          })}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </>
              )}
              <Divider />
              <Col xs={12}>
                <Row>
                  <Col md={6} xs={12}>
                    <p>Total de dinero en efectivo</p>
                  </Col>
                  <Col md={6} xs={12}>
                    <p>
                      {numbro(data[0].totalOnCash || 0).formatCurrency({
                        thousandSeparated: true,
                      })}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Divider />
              <Col xs={12}>
                <Row>
                  <Col md={6} xs={12}>
                    <p>Total de dinero en transferencia</p>
                  </Col>
                  <Col md={6} xs={12}>
                    <p>
                      {numbro(data[0].totalOnTransfer || 0).formatCurrency({
                        thousandSeparated: true,
                      })}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </FormProvider>
      </Dialog>
    )
  );
}
