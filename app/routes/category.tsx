import { Link, useLoaderData, useTransition } from "remix";

import type { LoaderFunction, ActionFunction, LinksFunction } from "remix";

import styles from "../styles/category.css";
import { BiArrowToLeft } from "react-icons/bi";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader: LoaderFunction = async () => {
  const shopData = await fetch(
    "https://fakestoreapi.com//products/categories"
  ).then((res) => res.json());

  return shopData;
};

export default function Category() {
  const data = useLoaderData();
  const transition = useTransition();

  const UpperCase = (str: string) => {
    const arr = str.split(" ");

    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    const str2 = arr.join(" ");
    return str2;
  };

  return (
    <div className="category">
      {transition.state !== "idle" ? (
        <div className="loading">
          <div className="loader"></div>
        </div>
      ) : null}
      <div className="back" onClick={() => history.back()}>
        <BiArrowToLeft />
      </div>
      <ul className="cat-ul">
        {data.map((category: string) => {
          const word = UpperCase(category);
          return (
            <Link to={`/?category=${category}`}>
              <li>{word}</li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
