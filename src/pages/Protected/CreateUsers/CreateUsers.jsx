import { useState, useEffect } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { useQuery, useMutation } from "react-query";
import { Container, Row, Col } from "react-grid-system";
import { css } from "@emotion/react";
import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../api";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { sideBar } from "../../../stores";
import {
  CreateUpdateModalCajero,
  CreateUpdateModalCocina,
  CreateUpdateModalCliente,
} from "./partials";
import { axios } from "../../../lib/axios";
import { user } from "../../../stores";

export function CreateUsers() {
  const [_, setControlSideBar] = useRecoilState(sideBar);
  const [userAuth] = useRecoilState(user);
  const navigation = useNavigate();

  const { open, onClose, onOpen } = useDisclosure();
  const [action, setAction] = useState("create");
  const [id, setId] = useState(null);

  const map = {
    0: "users/cashier/getAllCashier",
    1: "users/kitchen/getKitchen",
    2: "clients/getClients",
  };

  const [index, setIndex] = useState(0);
  const { data, isSuccess } = useQuery(["getUsers", index], () => {
    return axios.get(map[index]);
  });

  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (userAuth?.role != "Admin") {
      navigation("/");
    }
  }, [userAuth]);

  useEffect(() => {
    if (isSuccess && data) {
      const files = data?.data?.map((item, i) => {
        return {
          key: i,
          data: {
            id: item?.id,
            name: item?.username || item?.name,
          },
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

            <div
              css={css`
                margin-top: 1rem;
                margin-bottom: 2rem;
              `}
            >
              <TabMenu
                model={[
                  { name: "Cajero", value: 1 },
                  { name: "Cocina", value: 2 },
                  {
                    name: "Cliente",
                    value: 3,
                  },
                ].map((item) => {
                  return {
                    label: item?.name,
                  };
                })}
                activeIndex={index}
                onTabChange={(e) => setIndex(e?.index)}
              />
            </div>
          </div>
          <div
            css={css`
              margin-left: 3rem;
              margin-right: 3rem;
              margin-top: 1.5rem;
              margin-bottom: 1.5rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <h4>Administrar Usuarios</h4>
            <Button
              onClick={() => {
                setAction("create");
                onOpen();
              }}
            >
              Crear Usuarios
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
              <Column field="actualizar" />
            </TreeTable>
          </div>
        </Col>
      </Row>
      {index === 0 && (
        <CreateUpdateModalCajero
          id={id}
          action={action}
          users={data}
          open={open}
          onClose={onClose}
        />
      )}
      {index === 1 && (
        <CreateUpdateModalCocina
          id={id}
          action={action}
          categories={data}
          open={open}
          onClose={onClose}
        />
      )}
      {index === 2 && (
        <CreateUpdateModalCliente open={open} onClose={onClose} />
      )}
    </Container>
  );
}
