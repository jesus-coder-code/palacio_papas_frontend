import { useQuery } from "react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { css } from "@emotion/react";
import { useRecoilState } from "recoil";
import { token } from "../lib/token";
import { getUser } from "../api";
import { user } from "../stores";

export function AuthProvider(props) {
  const { Auth, Protected } = props;
  const [_, setUserAuth] = useRecoilState(user);
  const { data, isSuccess, isLoading, isError } = useQuery(
    {
      queryFn: () => getUser(),
      queryKey: "getUser",
    },
    {
      enabled: !!token.getToken(),
    }
  );

  if (isSuccess) {
    if (data?.message === "necesitas un token" || data === undefined) {
      return Auth;
    }
    if (data?.authData) {
      setUserAuth(data?.authData);
    }
    return <Protected />;
  }

  if (isError) {
    return Auth;
  }
  
  if (isLoading) {
    return (
      <div
        css={css`
          min-height: 100vh;
        `}
        className="w-100 d-flex justify-content-center align-items-center"
      >
        <ProgressSpinner />
      </div>
    );
  }

  return Auth;
}
