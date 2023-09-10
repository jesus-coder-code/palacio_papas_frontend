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
import { setCreateCliente } from "../../../../api";

export function CreateUpdateModalCliente({ open, onClose, action, id, users }) {
  const methods = useForm();

  const mutaton = useMutation(
    ({ body }) => {
      return setCreateCliente(body);
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
    await mutaton.mutateAsync({ body: e });
  };

  const categoriesSelected = useWatch({
    control: methods.control,
    name: "categories",
  });

  return (
    <Dialog
      header={"Crear cliente"}
      visible={open}
      style={{ width: "30vw" }}
      onHide={onClose}
    >
      <FormProvider {...methods}>
        <Container className="p-0 m-0" fluid>
          <Row>
            <Col xs={12}>
              <InputText
                placeholder="Cliente"
                style={{ width: "100%" }}
                name="name"
                {...methods.register("name")}
              />
            </Col>
          </Row>
        </Container>
        <Button
          onClick={methods.handleSubmit(onSubmit)}
          loading={mutaton.isLoading}
          style={{ marginTop: "1rem" }}
        >
          {"Registrar"}
        </Button>
      </FormProvider>
    </Dialog>
  );
}
