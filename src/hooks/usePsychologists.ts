import {useState, useCallback} from "react";
import {
  ref,
  query,
  orderByChild,
  orderByKey,
  limitToFirst,
  get,
  startAfter,
} from "firebase/database";
import {db} from "../firebase";

const PAGE_SIZE = 3;

interface Review {
  reviewer: string;
  rating: number;
  comment: string;
}

export interface Psychologist {
  id?: string;
  name: string;
  avatar_url: string;
  experience: string;
  reviews: Review[];
  price_per_hour: number;
  rating: number;
  license: string;
  specialization: string;
  initial_consultation: string;
  about: string;
}

type SortDir = "asc" | "desc";

export function usePsychologists() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastKey, setLastKey] = useState<string | null>(null);

  const fetchPsychologists = useCallback(
    async (
      sortField: string = "name",
      sortDir: SortDir = "asc",
      reset: boolean = false,
    ) => {
      setLoading(true);
      try {
        const isShowAll = sortField === "show_all";
        const dbQuery =
          reset || lastKey === null
            ? query(
                ref(db, "psychologists"),
                isShowAll ? orderByKey() : orderByChild(sortField),
                limitToFirst(PAGE_SIZE),
              )
            : query(
                ref(db, "psychologists"),
                isShowAll ? orderByKey() : orderByChild(sortField),
                startAfter(lastKey),
                limitToFirst(PAGE_SIZE),
              );

        const snapshot = await get(dbQuery);
        if (!snapshot.exists()) {
          setHasMore(false);
          return;
        }

        const data: Psychologist[] = [];
        snapshot.forEach((child) => {
          data.push({id: child.key ?? undefined, ...child.val()});
        });

        const sorted = sortDir === "desc" && !isShowAll ? data.reverse() : data;

        if (reset) {
          setPsychologists(sorted);
        } else {
          setPsychologists((prev) => [...prev, ...sorted]);
        }

        setLastKey(
          isShowAll
            ? (data[data.length - 1]?.id ?? null)
            : ((data[data.length - 1] as unknown as Record<string, string>)?.[
                sortField
              ] ?? null),
        );
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [lastKey],
  );

  const resetAndFetch = useCallback(
    async (sortField: string = "name", sortDir: SortDir = "asc") => {
      setLastKey(null);
      setPsychologists([]);
      setHasMore(true);
      setLoading(true);
      try {
        const isShowAll = sortField === "show_all";
        const dbQuery = query(
          ref(db, "psychologists"),
          isShowAll ? orderByKey() : orderByChild(sortField),
          limitToFirst(PAGE_SIZE),
        );
        const snapshot = await get(dbQuery);
        if (!snapshot.exists()) {
          setHasMore(false);
          return;
        }

        const data: Psychologist[] = [];
        snapshot.forEach((child) => {
          data.push({id: child.key ?? undefined, ...child.val()});
        });

        const sorted =
          sortDir === "desc" && !isShowAll ? [...data].reverse() : data;
        setPsychologists(sorted);
        setLastKey(
          isShowAll
            ? (data[data.length - 1]?.id ?? null)
            : ((data[data.length - 1] as unknown as Record<string, string>)?.[
                sortField
              ] ?? null),
        );
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {psychologists, loading, hasMore, fetchPsychologists, resetAndFetch};
}
