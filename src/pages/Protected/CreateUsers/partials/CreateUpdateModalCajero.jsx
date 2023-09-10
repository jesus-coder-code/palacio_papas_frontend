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
  setCreateCajero,
  putActualizarCajero,
} from "../../../../api";

export function CreateUpdateModalCajero({ open, onClose, action, id, users }) {
  const methods = useForm();

  const { data, isSuccess } = useQuery({
    queryKey: "getProducts",
    queryFn: getCategories,
  });

  useEffect(() => {
    if (action === "update") {
      const category = [...users?.data].find((item) => item?.id === id);

      const { password, ...res } = category;
      methods.reset({ ...res });
      console.log(category);
    }
  }, [action, id]);

  const mutaton = useMutation(
    ({ body, id = 0 }) => {
      return action === "update"
        ? putActualizarCajero(id, body)
        : setCreateCajero(body);
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
    console.log(e);

    if (action === "update") {
      await mutaton.mutateAsync({ body: e, id: id });
      return;
    }
    await mutaton.mutateAsync({ body: e });
  };

  const categoriesSelected = useWatch({
    control: methods.control,
    name: "categories",
  });

  return (
    <Dialog
      header={
        action === "update"
          ? "Actualizar Usuario Cajero"
          : "Crear Usuario Cajero"
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
            <Col xs={12}>
              {isSuccess && (
                <MultiSelect
                  options={data?.data.map((item) => {
                    return {
                      name: item?.name,
                      value: item?.id,
                    };
                  })}
                  value={categoriesSelected}
                  onChange={(e) => {
                    methods.setValue("categories", e.value);
                  }}
                  optionLabel="name"
                  style={{ width: "100%", marginTop: ".5rem" }}
                  placeholder="Seleccionar Categoria"
                />
              )}
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
