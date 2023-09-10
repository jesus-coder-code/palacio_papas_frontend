import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-grid-system";
import { css } from "@emotion/react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import { VirtualScroller } from "primereact/virtualscroller";
import { TabMenu } from "primereact/tabmenu";
import { Card } from "primereact/card";
import { useRecoilState } from "recoil";
import { Dropdown } from "primereact/dropdown";
import numbro from "numbro";
import { useNavigate } from "react-router-dom";
import { getCategories, setCortesias } from "../../../api";
import { cartStore, sideBar, user } from "../../../stores";
import { CardFoodCart } from "../../../components/CardFoodCart";
import { setSales } from "../../../api";
import { axios } from "../../../lib/axios";

export function Sales() {
  const itemTemplate = (item, _) => {
    return <CardFoodCart data={item} />;
  };

  const navigation = useNavigate();

  const { data, isSuccess } = useQuery({
    queryFn: () => getCategories(),
    queryKey: "getCategories",
  });

  const { data: clientes, isSuccess: isSuccessClientes } = useQuery(
    "clientes",
    () => {
      return axios.get("clients/getClients");
    }
  );

  const [cart, setCart] = useRecoilState(cartStore);
  const [userState] = useRecoilState(user);
  const [_, setControlSideBar] = useRecoilState(sideBar);
  const [products, setProducts] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (userState?.role != "Admin" || userState?.role != "Cashier") {
      navigation("/");
    }
  }, [userState]);

  useEffect(() => {
    if (isSuccess) {
      setProducts(data?.data[index].products);
    }
  }, [data, isSuccess, index]);

  const [visible, setVisible] = useState(false);

  const mutationSales = useMutation(
    ({ body }) => {
      return setSales(body);
    },
    {
      onSuccess: (e) => {
        alert(e?.message);
        setCart([]);
        setVisible(false);
      },
      onerror: (e) => {
        alert(e);
      },
    }
  );

  const mutationCortesias = useMutation(
    ({ body }) => {
      return setCortesias(body);
    },
    {
      onSuccess: (e) => {
        alert(e?.message);
        setCart([]);
        setVisible(false);
      },
      onerror: (e) => {
        alert(e);
      },
    }
  );

  const methods = useForm();

  const method = useWatch({ control: methods.control, name: "method" });

  const cliente = useWatch({
    control: methods.control,
    name: "cliente",
  });

  const onClick = async (e) => {
    const { method, cliente } = e;

    console.log(method);
    console.log(cliente);

    if (method === "cortesia" && userState?.role === "Admin") {
      mutationCortesias.mutateAsync({
        body: {
          clientId: cliente,
          products: cart.map((item) => {
            return {
              id: item?.id,
              quantity: item?.itemCount,
            };
          }),
        },
      });
      return;
    }

    await mutationSales.mutateAsync({
      body: {
        method,
        userId: userState.userId,
        products: cart.map((item) => {
          return {
            id: item?.id,
            quantity: item?.itemCount,
          };
        }),
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Container fluid className="w-100 vh-100">
        <Row gutterWidth={30}>
          <Col xl={9} lg={7} md={6} className="p-0 m-0">
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
              {isSuccess && (
                <div
                  css={css`
                    margin-top: 1rem;
                    margin-bottom: 2rem;
                  `}
                >
                  <TabMenu
                    model={data?.data.map((item) => {
                      return {
                        label: item?.name,
                      };
                    })}
                    activeIndex={index}
                    onTabChange={(e) => setIndex(e?.index)}
                  />
                </div>
              )}
              {products !== null && (
                <Container fluid>
                  <Row>
                    {products.map((item, index) => {
                      let binary = new Uint8Array(item?.image?.buffer?.data);

                      const blob = new Blob([binary], { type: "image/jpeg" });

                      const url = URL.createObjectURL(blob);

                      return (
                        <Col md={6} lg={3} sm={12} key={index}>
                          <Card
                            header={
                              <div
                                css={css`
                                  position: relative;
                                `}
                              >
                                <div
                                  onClick={() => {
                                    const itemSearch = [...cart].find(
                                      (element) =>
                                        element?.categoryId ===
                                          item?.categoryId &&
                                        element?.id === item?.id
                                    );
                                    if (
                                      itemSearch !== undefined ||
                                      itemSearch !== undefined
                                    )
                                      return;

                                    setCart([
                                      ...cart,
                                      { ...item, itemCount: 1 },
                                    ]);
                                  }}
                                  css={css`
                                    width: 35px;
                                    height: 40px;
                                    position: absolute;
                                    bottom: 20px;
                                    top: 18px;
                                    left: 2;
                                    right: 12px;
                                    background: var(--color-text);
                                    color: white;
                                    cursor: pointer;

                                    :active {
                                      opacity: 0.7;
                                    }
                                  `}
                                >
                                  <div
                                    css={css`
                                      width: 100%;
                                      height: 100%;
                                      align-items: center;
                                      display: flex;
                                      justify-content: center;
                                    `}
                                  >
                                    <p className="p-0 m-0 unselectable">+</p>
                                  </div>
                                </div>
                                <Image
                                  width="100%"
                                  height="200"
                                  alt="Imagen"
                                  src={url}
                                />
                              </div>
                            }
                          >
                            <p
                              style={{
                                textAlign: "start",
                                textTransform: "capitalize",
                                fontSize: "1.5rem",
                                marginTop: 5,
                              }}
                            >
                              {item?.name}
                            </p>
                            <p
                              style={{
                                textAlign: "start",
                                fontWeight: "normal",
                                fontSize: "1.4rem",
                              }}
                              css={css`
                                color: var(--color-text);
                              `}
                            >
                              {numbro(item?.price).formatCurrency({
                                thousandSeparated: true,
                              })}
                            </p>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </Container>
              )}
            </div>
          </Col>
          <Col xl={3} lg={5} md={6} className="p-0 m-0">
            <div
              css={css`
                width: 100%;
                height: 100vh;
                display: grid;
                place-items: center;
              `}
            >
              <div
                css={css`
                  height: 90%;
                  width: 90%;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                `}
              >
                <div
                  className="px-4"
                  css={css`
                    flex: 0.8;
                  `}
                >
                  <div
                    style={{
                      marginBottom: "1.5rem",
                    }}
                  >
                    <p className="text-start">Orden Actual</p>
                  </div>
                  <VirtualScroller
                    items={[...cart]}
                    itemTemplate={itemTemplate}
                    itemSize={30}
                    className="m-0"
                    style={{ width: "100%", height: "85%" }}
                  />
                </div>
                <div
                  css={css`
                    width: 100%;
                    flex: 0.2;
                    border-top: 15px solid rgba(255, 255, 255, 0.7);
                    display: flex;
                    justify-content: space-between;
                    flex-direction: column;
                  `}
                  className="px-4"
                >
                  <div>
                    <div
                      css={css`
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        padding: 0 3rem 0 3rem;
                      `}
                    >
                      <span
                        css={css`
                          font-size: 1.2rem;
                        `}
                      >
                        Subtotal
                      </span>
                      <span
                        css={css`
                          font-size: 1.2rem;
                          font-weight: bold;
                        `}
                      >
                        {(() => {
                          const price = cart.reduce(
                            (sum, { price, itemCount }) =>
                              price * itemCount + sum,
                            0
                          );
                          return numbro(price).formatCurrency({
                            thousandSeparated: true,
                          });
                        })()}
                      </span>
                    </div>
                    <div
                      css={css`
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        padding: 0 3rem 0 3rem;
                      `}
                    >
                      <span
                        css={css`
                          font-size: 1.2rem;
                        `}
                      >
                        Total
                      </span>
                      <span
                        css={css`
                          font-size: 1.2rem;
                          font-weight: bold;
                        `}
                      >
                        {(() => {
                          const price = cart.reduce(
                            (sum, { price, itemCount }) =>
                              price * itemCount + sum,
                            0
                          );
                          return numbro(price).formatCurrency({
                            thousandSeparated: true,
                          });
                        })()}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setVisible(true);
                    }}
                    size="large"
                    style={{ width: "100%" }}
                    label="Continuar pago"
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Dialog
          draggable={false}
          header="Realizar compra"
          visible={visible}
          style={{ width: "400px" }}
          onHide={() => setVisible(false)}
          footer={() => {
            return (
              <Button
                loading={mutationSales.isLoading || mutationCortesias.isLoading}
                onClick={methods.handleSubmit(onClick)}
              >
                Realizar transacción
              </Button>
            );
          }}
        >
          <Dropdown
            value={method}
            defaultValue={"Cash"}
            name="method"
            onChange={(e) => methods.setValue("method", e.value)}
            options={
              userState?.role === "Admin"
                ? [
                    {
                      name: "Efectivo",
                      value: "Cash",
                    },
                    {
                      name: "Transferencia",
                      value: "Transfer",
                    },
                    {
                      name: "Cortesia",
                      value: "cortesia",
                    },
                  ]
                : [
                    {
                      name: "Efectivo",
                      value: "Cash",
                    },
                    {
                      name: "Transferencia",
                      value: "Transfer",
                    },
                  ]
            }
            optionLabel="name"
            placeholder="Seleccionar método de pago"
            className="w-100 mt-4"
          />
          {method === "cortesia" && userState?.role === "Admin" && (
            <Dropdown
              options={clientes?.data.map((item) => {
                return {
                  name: item?.name,
                  value: item?.id,
                };
              })}
              value={cliente}
              onChange={(e) => {
                methods.setValue("cliente", e.value);
              }}
              optionLabel="name"
              style={{ width: "100%", marginTop: ".5rem" }}
              placeholder="Seleccionar clientes"
            />
          )}
        </Dialog>
      </Container>
    </FormProvider>
  );
}
