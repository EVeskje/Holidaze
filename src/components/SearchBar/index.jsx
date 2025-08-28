export const SearchBar = () => {
  const handleSubmit = (e) => e.preventDefault();

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto mt-6 pb-8 px-4"
    >
      <label htmlFor="site-search" className="sr-only">
        Search
      </label>

      <div className="flex items-stretch bg-surface border border-secondary/20 shadow-sm focus-within:ring-2 focus-within:ring-accent">

        {/* Input */}
        <input
          id="site-search"
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent px-3 py-2 text-sm text-primary placeholder-secondary/60 focus:outline-none"
        />

        {/* Button */}
    <button
  type="submit"
  aria-label="Search"
  className="px-3 flex items-center justify-center bg-accent text-white hover:opacity-90 transition-opacity"
>
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
  </svg>
</button>
      </div>
    </form>
  );
};