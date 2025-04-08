import React, { useState } from "react";
import {
  useGetInvoicePdf,
  useGetOrders,
  useGetPaidOrders,
} from "@/hooks/api/order";
import { Feather } from "@expo/vector-icons";
import { Button } from "@rneui/base";

import { StyleSheet, Text, View } from "react-native";
import { PaidOrder as TPaidOrder } from "@/queries/order";
import { sizes } from "@/utils/sizes";
import { ScrollView } from "react-native-gesture-handler";
import { primaryColor } from "@/utils/colors";

export function OrdersView() {
  // TODO: Replace useGetOrders with useGetPaidOrders when ready
  const { data, isLoading, error } = useGetOrders();

  const [isInvoiceLimited, setIsInvoiceLimited] = useState(true);

  if (isLoading || !data) {
    return <Text>loading...</Text>;
  }

  if (error) {
    return <Text>An error occured</Text>;
  }

  const invoices = isInvoiceLimited ? data.slice(0, 5) : data;

  return (
    <ScrollView style={{ width: "100%", marginTop: sizes.lg }}>
      <Text
        style={{
          fontSize: 26,
          fontFamily: "CrimsonText_400Regular",
          marginBottom: sizes.md,
        }}
      >
        Your previous orders
      </Text>
      {invoices.map((order) => (
        <PaidOrder key={order.id} order={order} />
      ))}
      {isInvoiceLimited && (
        <Button
          color={primaryColor}
          radius="md"
          onPress={() => setIsInvoiceLimited(false)}
        >
          <Text style={{ color: "#FFF" }}>Show all {data.length} invoices</Text>
        </Button>
      )}
    </ScrollView>
  );
}

function PaidOrder({ order }: { order: TPaidOrder }) {
  const { mutateAsync: downloadInvoice, error, isPending } = useGetInvoicePdf();
  const paymentData = new Date(order.payment_date).toLocaleDateString("fr");
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "black",
        marginBottom: sizes.xs,
        paddingBottom: sizes.xs,
        alignItems: "center",
      }}
    >
      {error && <Text>{String(error)}</Text>}
      <Text>{paymentData}</Text>
      <Text>{parseFloat(order.total_price).toFixed(2)} €</Text>
      <Button
        type="outline"
        onPress={() => downloadInvoice(order.id)}
        loading={isPending}
        radius="md"
      >
        <Feather name="download" /> <Text>Invoice</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({});
