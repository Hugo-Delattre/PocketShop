import React from "react";
import { userAtom } from "@/hooks/auth";
import { sizes } from "@/utils/sizes";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function index() {
  const router = useRouter();

  const user = useAtomValue(userAtom);

  return (
    <View style={styles.page}>
      {user?.username && <Text style={styles.h1}>Hii, {user.username} 👋</Text>}

      <TouchableOpacity
        style={{ ...styles.card, ...styles.flex }}
        onPress={() => router.navigate("/(tabs)/scan")}
      >
        <MaterialCommunityIcons size={40} name="barcode-scan" />
        <View>
          <Text style={styles.cardTitle}>Scan the products</Text>
          <Text style={{ color: "#585858" }}>
            Do your shopping using your phone
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.navigate("/(tabs)/cart")}
      >
        <View
          style={{
            ...styles.flex,
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.cardTitle}>Access your cart</Text>
          <MaterialCommunityIcons size={40} name="arrow-top-right" />
        </View>
        <Text style={{ color: "#585858" }}>
          See products that are currently in your cart
        </Text>
      </TouchableOpacity>
      <Text style={{ ...styles.h1, marginTop: sizes.md }}>
        You don’t find what you are looking for ?
      </Text>
      <TouchableOpacity
        onPress={() => router.navigate("/(tabs)/product")}
        style={{ ...styles.card, ...styles.flex, alignItems: "center" }}
      >
        <Ionicons size={40} name="search" />
        <Text style={{ ...styles.cardTitle, flexShrink: 1 }}>
          Search for products
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default index;

const styles = StyleSheet.create({
  h1: {
    fontSize: 22,
    fontFamily: "CrimsonText_400Regular",
    marginBottom: sizes.md,
  },
  card: {
    padding: sizes.sm,
    marginVertical: sizes.sm,
    marginHorizontal: "auto",
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 12,
    boxShadow: "0 2px 10px -1px #00000021",
  },
  cardTitle: {
    fontFamily: "Karla_500Medium",
    fontSize: 18,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    gap: sizes.sm,
    flexWrap: "nowrap",
  },
  page: {
    padding: sizes.md,
  },
});
