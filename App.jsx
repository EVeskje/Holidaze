// eslint-disable-next-line no-unused-vars
import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import "./App.css";
import "./index.css";

import { Layout } from "./components/nav/Layout";
import {
  Home,
  SingleVenue,
  SignUp,
  LogIn,
  Profile,
  AddEditVenue,
  ConfirmedBooking,
  About,
  Contact,
} from "./pages";

function Fallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-secondary">
      Loading…
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="singleVenue/:id" element={<SingleVenue />} />
            <Route path="signUp" element={<SignUp />} />
            <Route path="logIn" element={<LogIn />} />
            <Route path="profile" element={<Profile />} />
            <Route path="addEditVenue" element={<AddEditVenue />} />
            <Route path="confirmedBooking" element={<ConfirmedBooking />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </HelmetProvider>
  );
}

export default App;