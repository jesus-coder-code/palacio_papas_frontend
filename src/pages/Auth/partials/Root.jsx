import { useState } from "react";
import { css } from "@emotion/react";
import { Row, Container, Col, useScreenClass } from "react-grid-system";
import { Button } from "primereact/button";
import hamburger from "../../../assets/svg/hamburger.svg";
import Logo from "../../../assets/svg/logo-palacio.svg";
import { Sphere } from "../../../components/Sphere";
import { LoginForm } from "./LoginForm";

const dicScreen = {
  sm: true,
  xs: true,
  md: true,
};

export function Root() {
  const screenClass = useScreenClass();
  const [changeLogin, setChangeLogin] = useState(true);

  return (
    <Container fluid className="w-100 vh-100">
      <Row
        className="h-100"
        direction={dicScreen[screenClass] ? "column" : "row"}
      >
        <Col lg={6.5} sm={7} className="p-0 m-0 mw-100 w-100">
          <div
            css={css`
              height: 100%;
              flex-direction: column;
            `}
            className="w-100 d-flex justify-content-center align-items-center"
          >
            {changeLogin ? (
              <>
                {" "}
                <img
                  css={css`
                    height: 160px;
                    @media screen and (min-width: 1200px) {
                      height: 200px;
                    }
                  `}
                  src={Logo}
                  alt="logo palacio de las papas"
                />
                <Button
                  css={css`
                    border-width: 5px !important;
                    border-image: var(--principal-color) !important;
                    border-image-slice: 1 !important;
                    border-style: solid !important;

                    @media screen and (min-width: 1200px) {
                      height: 60px !important;
                    }
                    span {
                      font-size: 18px;
                      background: var(--principal-color);
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                    }
                  `}
                  onClick={() => setChangeLogin((data) => !data)}
                  type="button"
                  severity="danger"
                  outlined
                  label="Iniciar sesión"
                />
              </>
            ) : (
              <LoginForm data={{ setChangeLogin }} />
            )}
          </div>
        </Col>
        <Col lg={5.5} sm={5} className="p-0 m-0 mw-100 w-100">
          <div
            css={css`
              width: 100%;
        
              height: 100%;

              overflow: hidden;

              position: relative;

              background: var(--sphere-color);
              
              border-bottom-left-radius: ${dicScreen[screenClass]} ?  18% : 0;
              border-radius: ${dicScreen[screenClass] && "116px 116px 0 0"} 
            `}
          >
            <img
              css={css`
                /* min-height: 515px */
                width: 300px;

                position: absolute;
                z-index: 100;
                right: 0;
                left: 0;
                top: 0;
                bottom: 0;
                margin: auto;

                @media screen and (min-width: 1200px) {
                  width: 360px;
                }
              `}
              src={hamburger}
              alt="Imagen Hamburguesa"
            />
            <Sphere
              cssStyle={css`
                width: 242.22px;
                height: 245px;
                left: 20px;
                top: -100px;
              `}
            />
            <Sphere
              cssStyle={css`
                width: 250px;
                height: 300px;
                right: -100px;
                top: 140px;
              `}
            />
            <Sphere
              cssStyle={css`
                width: 250px;
                height: 270px;
                bottom: 100px;
                left: 120px;
              `}
            />
            <Sphere
              cssStyle={css`
                width: 280px;
                height: 300px;
                bottom: -100px;
                right: -100px;
              `}
            />
          </div>
        </Col>
        <div
          className="d-flex justify-content-around align-items-center"
          css={css`
            width: 400px;
            min-height: 150px;
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);

            @media screen and (min-width: 1500px) {
              width: 500px;
            }
          `}
        >
          <p
            css={css`
              font-weight: 700;
              color: #d02500;
            `}
          >
            ¿Quienes somos?
          </p>
          <p
            css={css`
              font-weight: 700;

              color: #808080;
            `}
          >
            Menú
          </p>
          <p
            css={css`
              font-weight: 400;
              color: #d02500;
              @media screen and (min-width: 992px) {
                color: #ffffff;
              }
            `}
          >
            Contáctenos
          </p>
        </div>
      </Row>
    </Container>
  );
}
