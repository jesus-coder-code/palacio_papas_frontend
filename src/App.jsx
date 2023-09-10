import { QueryClientProvider, QueryClient } from "react-query";
import { RecoilRoot } from "recoil";
import { AuthProvider } from "./provider/AuthProvider";
import { RouterProvider } from "react-router-dom";
import { useRecoilState } from "recoil";
import { user } from "./stores";
import useRouter from "./routes/routes";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AuthProvider
          Auth={<Auth />}
          Protected={() => {
            const { routes } = useRouter();

            return (
              <RouterProvider
                router={routes.current}
                fallbackElement={<>Cargando...</>}
              />
            );
          }}
        />
      </QueryClientProvider>
    </RecoilRoot>
  );
}
