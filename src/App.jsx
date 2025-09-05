import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import "./App.css";
import "./index.css";

const Layout = lazy(() =>
  import("./components/nav/Layout").then((m) => ({ default: m.Layout })),
);
const Home = lazy(() => import("./pages").then((m) => ({ default: m.Home })));
const SingleVenue = lazy(() =>
  import("./pages").then((m) => ({ default: m.SingleVenue })),
);
const SignUp = lazy(() =>
  import("./pages").then((m) => ({ default: m.SignUp })),
);
const LogIn = lazy(() => import("./pages").then((m) => ({ default: m.LogIn })));
const Profile = lazy(() =>
  import("./pages").then((m) => ({ default: m.Profile })),
);
const AddEditVenue = lazy(() =>
  import("./pages").then((m) => ({ default: m.AddEditVenue })),
);
const ConfirmedBooking = lazy(() =>
  import("./pages").then((m) => ({ default: m.ConfirmedBooking })),
);
const About = lazy(() => import("./pages").then((m) => ({ default: m.About })));
const Contact = lazy(() =>
  import("./pages").then((m) => ({ default: m.Contact })),
);

function Fallback() {
  return (
    <div className="text-secondary flex min-h-[40vh] items-center justify-center">
      Loading…
    </div>
  );
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

/** Friendly 404 screen */
function NotFound() {
  return (
    <main className="mx-auto my-16 flex max-w-lg flex-col items-center gap-4 px-6 text-center">
      <h1 className="text-primary text-2xl font-semibold">Page not found</h1>
      <p className="text-secondary">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <a
        href="/"
        className="border-secondary/30 bg-surface text-primary hover:border-accent hover:text-accent inline-flex items-center rounded-xl border px-4 py-2"
      >
        Go home
      </a>
    </main>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="singleVenue/:id" element={<SingleVenue />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<LogIn />} />
            <Route path="profile" element={<Profile />} />
            <Route path="addEditVenue" element={<AddEditVenue />} />
            <Route path="confirmedBooking" element={<ConfirmedBooking />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </HelmetProvider>
  );
}

export default App;
