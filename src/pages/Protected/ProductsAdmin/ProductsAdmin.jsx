import { useState, useEffect } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { useQuery, useMutation } from "react-query";
import { Container, Row, Col } from "react-grid-system";
import { css } from "@emotion/react";
import { Button } from "primereact/button";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../api";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { sideBar } from "../../../stores";
import { CreateUpdateModal } from "./partials";
import { user } from "../../../stores";

export function ProductsAdmin() {
  const [_, setControlSideBar] = useRecoilState(sideBar);

  const [userAuth] = useRecoilState(user);
  const navigation = useNavigate()

  const { open, onClose, onOpen } = useDisclosure();
  const [action, setAction] = useState("create");
  const [id, setId] = useState(null);

  useEffect(() => {
    if (userAuth?.role != "Admin") {
      navigation("/");
    }
  }, [userAuth]);

  const { data, isSuccess } = useQuery({
    queryKey: "getProducts",
    queryFn: getCategories,
  });

  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (isSuccess && data) {
      const files = data?.data.map((item, i) => {
        return {
          key: i,
          data: {
            name: item?.name,
            description: item?.description,
          },
          children: item.products.map((product, j) => {
            return {
              key: j + 3,
              data: {
                name: (
                  <span
                    css={css`
                      width: 100%;
                      height: 100%;
                      align-items: center;
                      padding-right: 1rem;
                    `}
                  >
                    {product?.name}
                  </span>
                ),
                description: (
                  <Button
                    onClick={() => {
                      setId(product?.id);
                      setAction("update");
                      onOpen();
                    }}
                  >
                    Actualizar
                  </Button>
                ),
              },
            };
          }),
        };
      });

      setNodes(files);
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
            <h4>Administrar Productos</h4>
            <Button
              onClick={() => {
                setAction("create");
                onOpen();
              }}
            >
              Crear Categoria
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
              <Column field="name" header="NOMBRE" expander></Column>
              <Column field="description" header="DESCRIPCIÓN"></Column>
            </TreeTable>
          </div>
        </Col>
      </Row>
      <CreateUpdateModal
        id={id}
        action={action}
        categories={data}
        open={open}
        onClose={onClose}
      />
    </Container>
  );
}
