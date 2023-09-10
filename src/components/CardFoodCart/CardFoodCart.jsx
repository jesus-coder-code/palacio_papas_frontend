import React from "react";
import { Image } from "primereact/image";
import { css } from "@emotion/react";
import numbro from "numbro";
import { useRecoilState } from "recoil";
import { cartStore } from "../../stores";

export function CardFoodCart({ data }) {
  const { name, price, itemCount, categoryId, id, image } = data;
  const [cart, setCart] = useRecoilState(cartStore);

  let binary = new Uint8Array(image?.buffer?.data);

  const blob = new Blob([binary], { type: "image/jpeg" });

  const url = URL.createObjectURL(blob);

  return (
    <div
      css={css`
        width: 100%;
        display: flex;
        height: 90px;
        justify-content: space-between;
        margin-bottom: 1.2rem;
      `}
    >
      <Image
        width="90"
        height="90"
        alt="Imagen"
        css={css`
          img {
            border-radius: 0.8rem;
          }
        `}
        src={
          url ||
          "https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/4e4293857c03d819e4ae51de1e86d66a.jpg"
        }
      />
      <div
        css={css`
          width: 100%;
          display: flex;
          height: 90px;
          justify-content: space-evenly;
          flex-direction: column;
        `}
      >
        <div
          style={{
            marginLeft: "0.5rem",
          }}
        >
          <p
            className="p-0 m-0"
            style={{
              fontWeight: "normal",
              fontSize: "1.2rem",
              textAlign: "start",
              opacity: 0.7,
            }}
          >
            {name}
          </p>
        </div>
        <div
          css={css`
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 0.5rem;
          `}
        >
          <p
            className="p-0 m-0"
            css={css`
              color: var(--color-text) !important;
              font-size: 1.4rem;
            `}
          >
            {numbro(price).formatCurrency({
              thousandSeparated: true,
            })}
          </p>
          <div
            css={css`
              display: flex;
              justify-content: space-around;
              align-items: center;
              width: 100%;
            `}
          >
            <button
              onClick={() => {
                const findOne = [...cart].findIndex(
                  (element) =>
                    element?.categoryId === categoryId && element?.id === id
                );
                const cartParallel = [...cart];
                cartParallel[findOne] = {
                  ...cartParallel[findOne],
                  itemCount: cartParallel[findOne].itemCount + 1,
                };
                setCart([...cartParallel]);
              }}
              css={css`
                display: grid;
                place-content: center;
                width: 2rem;
                height: 2rem;
                background: var(--color-text);
                color: white;
                border: none;
              `}
            >
              +
            </button>
            <span>{itemCount}</span>
            <button
              onClick={() => {
                const findOne = [...cart].findIndex(
                  (element) =>
                    element?.categoryId === categoryId && element?.id === id
                );
                const cartParallel = [...cart];

                if (cartParallel[findOne].itemCount <= 1) {
                  const itemCart = cartParallel.filter((_, index) => {
                    return index !== findOne;
                  });
                  console.log(itemCart);
                  setCart([...itemCart]);
                  return;
                }

                cartParallel[findOne] = {
                  ...cartParallel[findOne],
                  itemCount: cartParallel[findOne].itemCount - 1,
                };

                setCart([...cartParallel]);
              }}
              css={css`
                display: grid;
                place-content: center;
                width: 2rem;
                height: 2rem;
                background: var(--color-text);
                color: white;
                border: none;
              `}
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
