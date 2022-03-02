import { Form, Link, useLoaderData, useParams, useTransition } from "remix";
import { BiSearchAlt2 } from "react-icons/bi";
import { SendNotification } from "~/utils/client/pwa-utils.client";

import type { LoaderFunction, LinksFunction } from "remix";

import styles from "../styles/home.css";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  let url = new URL(request.url);

  if (url.searchParams.has("category")) {
    const categoryData = await fetch(
      `https://fakestoreapi.com/products/category/${url.searchParams.get(
        "category"
      )}`
    );

    return {
      data: await categoryData.json(),
    };
  } else if (url.searchParams.has("search")) {
    const searched = url.searchParams.get("search");
    const arr = [];

    const data = await (
      await fetch("https://fakestoreapi.com/products")
    ).json();

    for (let i = 0; i < data.length; i++) {
      data[i].title.toLowerCase().includes(searched?.toLowerCase())
        ? arr.push(data[i])
        : null;
    }

    return {
      data: arr,
    };
  } else {
    const shopData = await fetch("https://fakestoreapi.com/products");
    return {
      data: shopData.json(),
    };
  }
};

export function ItemCard({
  title,
  price,
  image,
  id,
  desc,
  category,
  star,
  count,
}: any) {
  return (
    <div className="card">
      <Link to={`products/${id}`}>
        <img src={image} className="card-img" alt={title} />
        <div className="bottom">
          <span className="card-title">{title}</span>
          <span className="card-price">{`$${price}`}</span>
        </div>
      </Link>
      <button>Add to Cart</button>
    </div>
  );
}

export default function Index() {
  const { data } = useLoaderData();
  const transition = useTransition();

  const [random, setRandom] = useState<number>(0);
  useEffect(() => {
    const randomNumber = Math.random() * 30000;
    const randomProduct = Math.random() * (data.length - 1);
    setTimeout(() => {
      setRandom((data) => data + 1);
      SendNotification("Remix FakeShop", {
        body: `New Item Here! Check it out \n${window.location.href}products/${data[randomProduct]?.id}`,
        silent: false,
        image: data[randomProduct]?.image,
        badge: "/icons/icon-48x48.png",
        icon: "/icons/icon-48x48.png",
      });
    }, randomNumber * 1000);
  }, [random]);

  return (
    <div className="home">
      {transition.state !== "idle" ? (
        <div className="handler">
          <div className="loading">
            <div className="loader"></div>
            &nbsp;
            <span>Loading...</span>
          </div>
        </div>
      ) : null}
      <section className="search">
        <Form className="form">
          <input
            type="text"
            name="search"
            id="search"
            className="search"
            placeholder="Search for items..."
          />
          <button type="submit">
            <BiSearchAlt2 />
          </button>
        </Form>
      </section>
      <section className="shop">
        {data.map((item: any) => (
          <ItemCard
            title={item.title}
            price={item.price}
            category={item.category}
            id={item.id}
            desc={item.description}
            image={item.image}
            star={item.rating.star}
            count={item.rating.count}
            key={item.id}
          />
        ))}
      </section>
    </div>
  );
}
