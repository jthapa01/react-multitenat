import { SearchParams } from 'nuqs/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';
import { getQueryClient, trpc } from '@/trpc/server';

import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';


interface Props {
    params: Promise<{ subcategory: string }>,
    searchParams: Promise<SearchParams>;
};

const Page = async ({ params, searchParams }: Props) => {
    const { subcategory } = await params;
    const filters = await loadProductFilters(searchParams);

    const queryClient = getQueryClient();
    // fetch and cache data
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        category: subcategory,
        ...filters,
        limit: DEFAULT_LIMIT,
    }));

    return (
        // hydrate (restore) cache on the client with data fetched on the server
        // dehydrate(queryClient) serializes(dehydrades) the query cache state
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={subcategory} />
        </HydrationBoundary>
    );
};

export default Page;