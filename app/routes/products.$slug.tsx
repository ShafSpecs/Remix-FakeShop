import {
  LoaderFunction,
  ActionFunction,
  LinksFunction,
  json,
  useLoaderData,
  useTransition,
} from "remix";
import { WebShareLink } from "~/utils/client/pwa-utils.client";
import { BsBack, BsShareFill } from "react-icons/bs";

import styles from "../styles/product-slug.css";
import { BiArrowToLeft } from "react-icons/bi";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const product = await fetch(
    `https://fakestoreapi.com/products/${params.slug}`
  ).then((data) => data.json());

  return product;
};

export default function Slug() {
  const data = useLoaderData();
  const transition = useTransition();

  return (
    <div className="slug">
      {transition.state !== "idle" ? (
        <div className="handler">
          <div className="loading">
            <div className="loader"></div>
            &nbsp;
            <span>Loading...</span>
          </div>
        </div>
      ) : null}
      <div className="back" onClick={() => history.back()}>
        <BiArrowToLeft />
      </div>
      <div className="prod">
        <section className="img">
          <img
            src={`${data.image}`}
            alt={`${data.image}`}
            className="product-img"
          />
        </section>
        <section className="details">
          <div className="title">{data.title}</div>
          <div className="desc">{data.description}</div>
          <div className="price">${data.price}</div>
          <div className="holder">
            <button className="cart">Add to cart</button>
            <button
              className="share"
              onClick={() =>
                WebShareLink(
                  window.location.href,
                  `${data.title}`,
                  `${data.description}`
                )
              }
            >
              <BsShareFill />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
