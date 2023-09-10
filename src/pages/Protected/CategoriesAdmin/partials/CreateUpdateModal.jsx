import { Dialog } from "primereact/dialog";
import { useMutation } from "react-query";
import { InputText } from "primereact/inputtext";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "primereact/button";
import { Row, Col, Container } from "react-grid-system";
import { setCategories, updateCategories } from "../../../../api";
import { useEffect } from "react";

export function CreateUpdateModal({ open, onClose, action, id, categories }) {
  const methods = useForm();

  useEffect(() => {
    if (action === "update") {
      const category = [...categories?.data].find((item) => item?.id === id);
      methods.reset({ ...category });
    }
  }, [action, id]);

  const mutaton = useMutation(
    ({ body, id = 0 }) => {
      return action === "update"
        ? updateCategories(id, body)
        : setCategories(body);
    },
    {
      onSuccess: (e) => {
        alert(e?.message);
      },
      onError: (e) => {
        alert("Ha ocurrido un error");
        console.log(e);
      },
    }
  );

  const onSubmit = async (e) => {
    if (action === "update") {
      await mutaton.mutateAsync({ body: e, id: id });
      return;
    }
    await mutaton.mutateAsync({ body: e });
  };

  return (
    <Dialog
      header={
        action === "update" ? "Actualizar Categorias" : "Crear Categorias"
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
                placeholder="Nombre"
                style={{ width: "100%" }}
                name="name"
                {...methods.register("name")}
              />
            </Col>
            <Col xs={12}>
              <InputText
                placeholder="Descripción"
                style={{ width: "100%", marginTop: ".5rem" }}
                name="name"
                {...methods.register("description")}
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
