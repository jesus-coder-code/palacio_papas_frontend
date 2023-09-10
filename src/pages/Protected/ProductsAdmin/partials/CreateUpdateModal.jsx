import { Dialog } from "primereact/dialog";
import { useMutation } from "react-query";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Button } from "primereact/button";
import { Row, Col, Container } from "react-grid-system";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { css } from "@emotion/react";
import { useDropzone } from "react-dropzone";
import { Message } from "primereact/message";
import {
  updateProducts,
  getCategories,
  setCreateProducts,
} from "../../../../api";

export function CreateUpdateModal({ open, onClose, action, id, categories }) {
  const methods = useForm();

  const { data, isSuccess } = useQuery({
    queryKey: "getProducts",
    queryFn: getCategories,
  });

  const { acceptedFiles, getRootProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".jpeg", ".png", ".jpg"],
    },
  });

  const categoriesSelected = useWatch({
    control: methods.control,
    name: "categoryId",
  });

  const typeSelected = useWatch({
    control: methods.control,
    name: "type",
  });

  useEffect(() => {
    if (action === "update") {
      const product = [...categories?.data[0].products].find(
        (item) => item?.id === id
      );

      const { type, image, ...res } = product;
      methods.reset({ ...res });
      methods.setValue("categoryId", product?.categoryId);
      methods.setFocus("type ");
      methods.setValue("type", type === "Withstock" ? true : false);
    }
  }, [action, id]);

  const mutaton = useMutation(
    ({ body, id = 0 }) => {
      return action === "update"
        ? updateProducts(id, body)
        : setCreateProducts(body);
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
    const body = new FormData();

    Object.keys(e).forEach((key) => {
      body.append(key, e[key]);
    });

    body.set("stock", e?.type ? parseInt(e?.stock) : 0);
    body.set("type", e?.type ? "Withstock" : "Nostock");
    body.append("image", acceptedFiles[0] ?? null);

    if (action === "update") {
      await mutaton.mutateAsync({ body: body, id: id });
      return;
    }
    await mutaton.mutateAsync({ body: body });
  };

  return (
    <Dialog
      header={action === "update" ? "Actualizar Producto" : "Crear Producto "}
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
                placeholder="Precio"
                style={{ width: "100%", marginTop: ".5rem" }}
                name="price"
                {...methods.register("price")}
              />
            </Col>
            <Col xs={12}>
              {isSuccess && (
                <Dropdown
                  options={data?.data.map((item) => {
                    return {
                      name: item?.name,
                      value: item?.id,
                    };
                  })}
                  value={categoriesSelected}
                  onChange={(e) => {
                    methods.setValue("categoryId", e.value);
                  }}
                  optionLabel="name"
                  style={{ width: "100%", marginTop: ".5rem" }}
                  placeholder="Seleccionar Categoria"
                />
              )}
            </Col>
            <Col xs={12}>
              <InputText
                placeholder="Stock"
                style={{ width: "100%", marginTop: ".5rem" }}
                name="stock"
                {...methods.register("stock")}
              />
            </Col>
            <Col xs={6}>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  height: 100%;
                  margin-top: 0.5rem;
                `}
              >
                <span>Producto con stock: </span>
                <InputSwitch
                  style={{ marginLeft: "0.5rem" }}
                  name="type"
                  checked={typeSelected}
                  onChange={(e) => methods.setValue("type", e.value)}
                />
              </div>
            </Col>
            <Col xs={6}>
              {acceptedFiles.length <= 0 ? (
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    height: 100%;
                    margin-top: 0.5rem;
                  `}
                >
                  <Button {...getRootProps()}>Subir Archivo Portada</Button>
                </div>
              ) : (
                <InputText
                  defaultValue={acceptedFiles[0]?.name}
                  disabled={true}
                  style={{ width: "100%", marginTop: ".5rem" }}
                  name="imageFile"
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
