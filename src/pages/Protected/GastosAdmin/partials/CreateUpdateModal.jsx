import { Dialog } from "primereact/dialog";
import { useMutation } from "react-query";
import { InputText } from "primereact/inputtext";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Button } from "primereact/button";
import { Row, Col, Container } from "react-grid-system";
import { Calendar } from "primereact/calendar";
import { newGastoAdmin, updateCategories } from "../../../../api";
import { useEffect } from "react";
import numbro from "numbro";

export function CreateUpdateModal({ open, onClose, action }) {
  const methods = useForm();

  const mutaton = useMutation(
    ({ body }) => {
      return newGastoAdmin(body);
    },
    {
      onSuccess: (e) => {
        alert(e?.message);
        methods.reset({
          total: 0,
          description: "",
        });
        onClose();
      },
      onError: (e) => {
        alert("Ha ocurrido un error");
        console.log(e);
      },
    }
  );

  const onSubmit = async (e) => {
    await mutaton.mutateAsync({
      body: { ...e, total: numbro.unformat(e?.total) },
    });
  };

  const total = useWatch({
    control: methods.control,
    name: "total",
    defaultValue: 0,
  });

  return (
    <Dialog
      header={"Crear nuevo pago"}
      visible={open}
      style={{ width: "30vw" }}
      onHide={onClose}
    >
      <FormProvider {...methods}>
        <Container className="p-0 m-0" fluid>
          <Row>
            <Col xs={12}>
              <InputText
                placeholder="Descripcion"
                style={{ width: "100%", marginTop: ".5rem" }}
                name="description"
                {...methods.register("description")}
              />
            </Col>
            <Col xs={12}>
              <InputText
                placeholder="total"
                style={{ width: "100%", marginTop: ".5rem" }}
                name="total"
                value={total}
                onChange={(e) => {
                  /* methods.setValue("total", e.target.value); */

                  const inputValue = e.target.value;

                  const unformattedValue = numbro.unformat(inputValue);
                  const formattedValue = numbro(
                    parseInt(unformattedValue) || 0
                  ).format("0,0");

                  console.log(formattedValue);

                  return methods.setValue("total", formattedValue);
                }}
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
