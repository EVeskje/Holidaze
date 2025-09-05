import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { LogInForm } from "../../components/forms/LogInForm";
import { TextLink } from "../../components/ui_elements/TextLink";

export const LogIn = () => {
  return (
    <>
      <Helmet>
        <title>Log In | Holidaze</title>
        <meta name="description" content="Log in to your Holidaze account." />
      </Helmet>
      <section className="mx-auto mb-12 mt-[90px] flex w-11/12 max-w-sm flex-col items-center justify-center rounded-xl bg-light-blue sm:mt-[115px]">
        <header className="mb-3 mt-6">
          <h1 className="text-2xl sm:text-3xl">Please log in</h1>
        </header>
        <LogInForm />
        <footer className="pb-8">
          <Link
            to="/signup"
            aria-label="Sign up"
            className="mb-6 w-40 text-center sm:mb-8 sm:w-52"
          >
            <TextLink>
              Don’t have an account?{" "}
              <span className="font-medium">Please sign up</span>
            </TextLink>
          </Link>
        </footer>
      </section>
    </>
  );
};
