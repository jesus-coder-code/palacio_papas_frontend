import { useState, useEffect } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { useQuery, useMutation } from "react-query";
import { Container, Row, Col } from "react-grid-system";
import { css } from "@emotion/react";
import { Button } from "primereact/button";
import { useRecoilState } from "recoil";
import { getCategories } from "../../../api";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useNavigate } from "react-router-dom";
import { sideBar } from "../../../stores";
import { CreateUpdateModal } from "./partials";
import { user } from "../../../stores";


export function CategoriesAdmin() {
  const [_, setControlSideBar] = useRecoilState(sideBar);

  const [userAuth] = useRecoilState(user);

  const { open, onClose, onOpen } = useDisclosure();
  const [action, setAction] = useState("create");
  const [id, setId] = useState(null);

  const { data, isSuccess } = useQuery({
    queryKey: "getCategories",
    queryFn: getCategories,
  });
  
  const navigation = useNavigate()

  useEffect(() => {
    if(userAuth?.role != "Admin"){
      navigation("/")
    }
  }, [userAuth])

  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (isSuccess && data) {
      const files = data?.data.map((item, i) => {
        return {
          key: i,
          data: {
            id: item?.id,
            name: item?.name,
            description: item?.description,
          },
          children: [
            {
              key: i + 3,
              data: {
                id: (
                  <Button
                    onClick={() => {
                      setId(item?.id);
                      setAction("update");
                      onOpen();
                    }}
                  >
                    Actualizar
                  </Button>
                ),
              },
            },
          ],
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
            <h4>Administrar Categorias</h4>
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
              <Column field="id" header="ID" expander></Column>
              <Column field="name" header="NOMBRE"></Column>
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
