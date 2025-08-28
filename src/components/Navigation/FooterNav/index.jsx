export const FooterNav = () => {
  return (
    <footer className="bg-surface border-t border-secondary/20">
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        
        {/* Text logo */}
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-primary">
              Holi<span className="text-accent">daze</span>
            </span>
          </a>


        {/* Bottom: legal line */}
        <div className="mt-10 border-t border-secondary/20 pt-6 flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} Holidaze. All rights reserved.
          </p>
          <p className="text-secondary text-sm">
            Designed & developed by{" "}
            <a href="#" className="text-accent hover:underline">
              Eirik N. Veskje
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};