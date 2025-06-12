import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constants";
import { getQueryClient, trpc } from "@/trpc/server";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { loadProductFilters } from "@/modules/products/search-params";

interface Props {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();

  // fetch and cache data
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    // hydrate (restore) cache on the client with data fetched on the server
    // dehydrate(queryClient) serializes(dehydrades) the query cache state
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  );
};

export default Page;