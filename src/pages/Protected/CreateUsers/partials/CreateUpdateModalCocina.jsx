import { Dialog } from "primereact/dialog";
import { useMutation } from "react-query";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Button } from "primereact/button";
import { Row, Col, Container } from "react-grid-system";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { Message } from "primereact/message";
import {
  getCategories,
  setCreateCocina,
  putActualizarCajero,
} from "../../../../api";

export function CreateUpdateModalCocina({ open, onClose, action, id, users }) {
  const methods = useForm();

  useEffect(() => {
    if (action === "update") {
      const userCocina = [...users?.data].find((item) => item?.id === id);

      const { password, ...res } = userCocina;
      methods.reset({ ...res });
      console.log(userCocina);
    }
  }, [action, id]);

  const mutaton = useMutation(
    ({ body, id = 0 }) => {
      return action === "update"
        ? putActualizarCajero(id, body)
        : setCreateCocina(body);
    },
    {
      onSuccess: (e) => {
        alert(e?.message);
        onClose();
        methods.reset({
          username: "",
          password: ""
        });
      },
      onError: async (error) => {
        const data = await error;

        alert(data?.response?.data?.message);

        //alert(e?.response?.data?.message[0].msg);
      },
    }
  );

  const onSubmit = async (e) => {
    console.log(e);

    if (action === "update") {
      await mutaton.mutateAsync({ body: e, id: id });
      return;
    }
    await mutaton.mutateAsync({ body: { ...e, role: "Kitchen" } });
  };

  return (
    <Dialog
      header={
        action === "update"
          ? "Actualizar Usuario Cocina"
          : "Crear Usuario Cocina"
      }
      visible={open}
      style={{ width: "30vw" }}
      onHide={onClose}
    >
      <FormProvider {...methods}>
        <Container className="p-0 m-0" fluid>
          <Row>
            <Col xs={12}>
              <InputText
                placeholder="Usuario"
                style={{ width: "100%" }}
                name="name"
                {...methods.register("username")}
              />
            </Col>
            <Col xs={12}>
              <InputText
                placeholder="Contraseña"
                style={{ width: "100%", marginTop: ".5rem" }}
                name="price"
                {...methods.register("password")}
              />
            </Col>
          </Row>
        </Container>
        <Button
          onClick={methods.handleSubmit(onSubmit)}
          loading={mutaton.isLoading}
          style={{ marginTop: "1rem" }}
        >
          {action === "update" ? "Actualizar" : "Registrar"}
        </Button>
      </FormProvider>
    </Dialog>
  );
}
