import OrdersPage from "@/components/Orders/OrdersPageTable";

export default async function Orders({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  return <OrdersPage params={resolvedParams} />;
}
