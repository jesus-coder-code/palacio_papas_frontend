import { FormProvider, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useMutation } from "react-query";
import { css } from "@emotion/react";
import { loginUser } from "../../../api";
import { token } from "../../../lib/token";


export function LoginForm({ data }) {
  const { setChangeLogin } = data;

  const methods = useForm();

  const mutation = useMutation(
    ({ data }) => {
      return loginUser(data);
    },
    {
      onSuccess: (resp) => {
        token.setToken(resp?.token);
        window.location.reload();
      },
    }
  );

  const onSubmit = async (e) => {
    await mutation.mutateAsync({ data: e });
  };

  return (
    <FormProvider {...methods}>
      <p
        css={css`
          font-weight: 700;
          color: #d02500;
          margin-bottom: 1.2rem;
        `}
      >
        Iniciar Sesión
      </p>
      <InputText
        {...methods.register("username")}
        placeholder="Usuario"
        name="username"
      />
      <InputText
        style={{ marginTop: 5 }}
        {...methods.register("password")}
        placeholder="Contraseña"
        name="password"
      />

      <Button
        css={css`
          border-width: 2px !important;
          border-image: var(--principal-color) !important;
          border-image-slice: 1 !important;
          border-style: solid !important;

          @media screen and (min-width: 1200px) {
            height: 45px !important;
          }
          span {
            font-size: 18px;
            background: var(--principal-color);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
        outlined
        loading={mutation.isLoading}
        severity="danger"
        onClick={methods.handleSubmit(onSubmit)}
        style={{ marginTop: 15 }}
      >
        Login
      </Button>
      <span
        className="p-login"
        style={{ marginTop: 8 }}
        onClick={() => setChangeLogin((dataLogin) => !dataLogin)}
      >
        Volver
      </span>
    </FormProvider>
  );
}
