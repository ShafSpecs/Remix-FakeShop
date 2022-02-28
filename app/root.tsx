import React from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useMatches,
  NavLink,
  Link,
} from "remix";
import { BiMenuAltRight } from "react-icons/bi";

import type { MetaFunction, LinksFunction } from "remix";

import styles from "./styles/root.css";

export const meta: MetaFunction = () => {
  return { title: "Remix Fake Store" };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function App() {
  let location = useLocation();
  let matches = useMatches();

  const activeClassName: string = "active";

  const triggerRef = React.useRef(null!);
  const MobileNavRef = React.useRef(null);

  let isMount = true;

  React.useEffect(() => {
    let mounted = isMount;
    isMount = false;

    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: "REMIX_NAVIGATION",
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: "REMIX_NAVIGATION",
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener("controllerchange", listener);
        return () => {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            listener
          );
        };
      }
    }
  }, [location]);

  const triggerMobileNav = () => {
    //@ts-ignore
    MobileNavRef.current && MobileNavRef.current.classList.toggle("visible");
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <link rel="manifest" href="/resources/manifest.json" />
        <link rel="icon" type="favicon" href="/icons/favicon.ico" />
        <Links />
      </head>
      <body>
        <div className="root">
          <header className="header">
            <div className="title">
              <Link to="/">
                <img src="/icons/icon-48x48.png" />
                &nbsp;
                <h1>Remix Fake Store</h1>
              </Link>
            </div>

            {/* Non-mobile Navbar */}
            <nav className="nav">
              <ul>
                <li>
                  <NavLink
                    to="category"
                    className={({ isActive }) =>
                      isActive ? activeClassName : ""
                    }
                  >
                    Categories
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    to="tasks"
                    className={({ isActive }) =>
                      isActive ? activeClassName : ""
                    }
                  >
                    Cart
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="tasks"
                    className={({ isActive }) =>
                      isActive ? activeClassName : ""
                    }
                  >
                    Profile
                  </NavLink> */}
              </ul>
            </nav>

            {/* Trigger Mobile Nav */}
            <button
              ref={triggerRef}
              className="trigger-btn"
              onClick={triggerMobileNav}
            >
              <BiMenuAltRight />
            </button>

            {/* Mobile Navbar */}
            <nav className="mobile" ref={MobileNavRef}>
              <ul className="mobile-ul">
                <Link to="category">
                  <li>Categories</li>
                </Link>
                {/* <Link to="play">
                  <li>Categories</li>
                </Link>
                <Link to="play">
                  <li>Categories</li>
                </Link> */}
              </ul>
            </nav>
          </header>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
