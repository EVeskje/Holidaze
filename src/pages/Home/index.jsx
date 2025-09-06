import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Hero } from "../../components/ui_elements/Hero";
import { Card } from "../../components/ui_elements/Card";
import { useFetch } from "../../hooks/useFetch";
import { all_Venues, API_Url } from "../../js/api/constants";

// ---------------------------------------------
// Home Page
// ---------------------------------------------

/* ---------- Config ---------- */
const PAGE_SIZE = 24;
const MAX_TOTAL = 96;
const SEARCH_DEBOUNCE = 250;

/* ---------- Helpers ---------- */
const normalize = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[æÆ]/g, "ae")
    .replace(/[øØ]/g, "o")
    .replace(/[åÅ]/g, "a")
    .toLowerCase();

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  // Initial fetch (page 1 + limit)
  const initialUrl = `${API_Url + all_Venues}?page=1&limit=${PAGE_SIZE}`;
  const { data: initialData = [], isLoading, hasError, refetch } = useFetch(initialUrl);

  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery);

  const isSearching = debouncedTerm.trim().length > 0;
  const abortRef = useRef(null);

  const mergeUniqueById = (prev, next) => {
    const map = new Map(prev.map((v) => [v.id, v]));
    for (const item of next) map.set(item.id, item);
    return Array.from(map.values());
  };

  /* Seed first page */
  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      setAllData((prev) => mergeUniqueById(prev, initialData));
      setPage(1);
      setHasMore(true);
    }
  }, [initialData]);

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), SEARCH_DEBOUNCE);
    return () => clearTimeout(t);
  }, [searchTerm]);

  /* Reflect search in URL */
  useEffect(() => {
    const q = debouncedTerm.trim();
    if (q) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("q", q);
        return next;
      });
    } else {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (next.has("q")) next.delete("q");
        return next;
      });
    }
  }, [debouncedTerm, setSearchParams]);

  /* Load more */
  const loadMoreData = useCallback(async () => {
    if (loadingMore || isSearching || !hasMore) return;

    if (allData.length >= MAX_TOTAL) {
      setHasMore(false);
      return;
    }

    setLoadingMore(true);

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const nextPage = page + 1;
      const res = await fetch(
        `${API_Url + all_Venues}?page=${nextPage}&limit=${PAGE_SIZE}`,
        { signal: abortRef.current.signal }
      );
      const result = await res.json();

      const newData = Array.isArray(result?.data) ? result.data : [];
      const merged = mergeUniqueById(allData, newData);
      const capped = merged.slice(0, MAX_TOTAL);

      setAllData(capped);

      const current = Number(result?.meta?.currentPage ?? nextPage);
      setPage(current);

      const lastFromAPI = Boolean(result?.meta?.isLastPage);
      const reachedMax = capped.length >= MAX_TOTAL;
      setHasMore(!lastFromAPI && !reachedMax);
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Error fetching more data:", err);
        setHasMore(false);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, isSearching, loadingMore, allData]);

  /* Filtered results (name/description/city/country) */
  const results = useMemo(() => {
    if (!isSearching) return allData;

    const q = normalize(debouncedTerm);
    if (!q) return allData;

    const tokens = q.split(/\s+/).filter(Boolean);

    return allData.filter((v) => {
      const fields = [
        v?.name,
        v?.description,
        v?.location?.city,
        v?.location?.country,
      ].filter(Boolean);

      const haystack = normalize(fields.join(" "));
      return tokens.every((t) => haystack.includes(t));
    });
  }, [isSearching, debouncedTerm, allData]);

  /* Handlers */
  const handleSearch = (term) => setSearchTerm(term);

  /* Render helpers */
  const Container = ({ children }) => (
    <div className="mx-auto w-11/12 max-w-screen-2xl px-0">{children}</div>
  );

  const renderSkeletonGrid = () => (
    <Container>
      <div className="grid grid-cols-1 gap-4 pt-10 md:pt-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </Container>
  );

  const renderError = () => (
    <Container>
      <section className="mx-auto my-12 max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-700">
        <h3 className="text-lg font-semibold">We couldn’t load stays</h3>
        <p className="mt-1 text-sm">Please try again in a moment.</p>
        <button
          onClick={refetch}
          className="mt-3 rounded-lg border border-red-300 bg-white px-4 py-2 hover:bg-red-100"
        >
          Retry
        </button>
      </section>
    </Container>
  );

  const renderEmptySearch = () => (
    <Container>
      <section
        className="mx-auto my-12 w-full max-w-md rounded-xl border border-secondary/20 bg-surface p-6 text-center shadow-sm"
        aria-live="polite"
      >
        <h3 className="text-base font-semibold text-primary">No matches</h3>
        <p className="mt-1 text-sm text-secondary">
          We couldn’t find results for <span className="font-medium">“{debouncedTerm}”</span>.
        </p>
      </section>
    </Container>
  );

  const showLoadMore = !isSearching && hasMore;
  const reachedMaxNote = !hasMore && allData.length >= MAX_TOTAL;

  return (
    <>
      <Helmet>
        <title>Home | Holidaze</title>
        <meta
          name="description"
          content="Book your next holiday with Holidaze. Find the perfect accommodation for your next trip."
        />
      </Helmet>

      {/* Hero */}
      <Hero searchTerm={searchTerm} onSearch={handleSearch} />

      {/* Content */}
      {isLoading ? (
        renderSkeletonGrid()
      ) : hasError ? (
        renderError()
      ) : isSearching && results.length === 0 ? (
        renderEmptySearch()
      ) : (
        <>
          {/* Grid */}
          <Container>
            <section
              id="venues"
              className="scroll-mt-28 grid grid-cols-1 gap-4 pt-10 md:pt-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {results.map((item) => (
                <Card data={item} key={item.id} />
              ))}
            </section>

            {/* Load more / loading state */}
            {!isSearching && (
              <div className="mb-16 mt-6 flex items-center justify-center">
                {showLoadMore ? (
                  <button
                    onClick={loadMoreData}
                    disabled={loadingMore}
                    className="inline-flex items-center rounded-xl border border-secondary/30 bg-surface px-5 py-2.5 font-medium text-primary hover:border-secondary hover:shadow-sm disabled:opacity-60"
                  >
                    {loadingMore ? "Loading…" : "Load more"}
                  </button>
                ) : reachedMaxNote ? (
                  <p className="text-sm text-secondary">
                    Showing the first {MAX_TOTAL} stays. Refine your search to see more.
                  </p>
                ) : null}
              </div>
            )}
          </Container>
        </>
      )}
    </>
  );
};

/* ---------- Lightweight Skeleton ---------- */
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-secondary/20 bg-surface p-3">
      <div className="h-40 w-full rounded-xl bg-secondary/10" />
      <div className="mt-3 h-4 w-3/4 rounded bg-secondary/10" />
      <div className="mt-2 h-4 w-1/2 rounded bg-secondary/10" />
      <div className="mt-4 h-9 w-full rounded-lg bg-secondary/10" />
    </div>
  );
}