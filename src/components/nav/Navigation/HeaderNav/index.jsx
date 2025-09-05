import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { load } from "../../../../js/storage/load";

export const HeaderNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const token = load("accessToken");

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profile");
    setOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const linkBase =
    "block px-3 py-2 transition-colors text-secondary hover:text-accent md:p-0";
  const activeCls = "text-primary";

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/80 shadow-sm">
      <nav className="mx-auto max-w-screen-xl px-4">
        <div className="flex h-16 items-center justify-between">
         
          <Link to="/" onClick={() => setOpen(false)} aria-label="Holidaze home" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-primary">
              Holi<span className="text-accent">daze</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8 font-normal text-base">
            <li>
              <Link to="/" className={`${linkBase} ${isActive("/") ? activeCls : ""}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={`${linkBase} ${isActive("/about") ? activeCls : ""}`}>
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`${linkBase} ${isActive("/contact") ? activeCls : ""}`}>
                Contact
              </Link>
            </li>
            {token && (
              <li>
                <Link to="/profile" className={`${linkBase} ${isActive("/profile") ? activeCls : ""}`}>
                  My profile
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {!token ? (
              <>
                <Link to="/logIn" className="px-4 py-2 rounded-md text-secondary hover:text-accent transition-colors">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-colors"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md text-secondary hover:text-accent transition-colors"
              >
                Log out
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-primary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu (animated height) */}
        <div
          id="mobile-menu"
          className={`${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} md:hidden grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out`}
        >
          <div className="overflow-hidden">
            <ul className="border-t border-secondary/20 py-3 space-y-1 text-center">
              <li>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className={`${linkBase} ${isActive("/") ? activeCls : ""}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setOpen(false)}
                  className={`${linkBase} ${isActive("/about") ? activeCls : ""}`}
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className={`${linkBase} ${isActive("/contact") ? activeCls : ""}`}
                >
                  Contact
                </Link>
              </li>
              {token && (
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className={`${linkBase} ${isActive("/profile") ? activeCls : ""}`}
                  >
                    My profile
                  </Link>
                </li>
              )}

              <li className="mt-2 flex items-center justify-center gap-2 px-3">
                {!token ? (
                  <>
                    <Link
                      to="/logIn"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-md px-3 py-2 text-secondary hover:text-accent transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-md px-3 py-2 border border-accent text-accent hover:bg-accent hover:text-white transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full rounded-md px-3 py-2 text-secondary hover:text-accent transition-colors"
                  >
                    Log out
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};