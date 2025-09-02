import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="focus:bg-surface sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-md focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <Header />

      <main id="main-content" role="main" className="flex-1">
        <div className="mx-auto max-w-screen-2xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
