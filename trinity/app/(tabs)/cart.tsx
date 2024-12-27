import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform } from "react-native";
import { CameraView } from "expo-camera";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Product, ProductInShop } from "@/constants/interface/Product";
import { useState, useEffect } from "react";
import useCartApi from "@/hooks/api/cart";
export default function Cart() {
  const [cart, setCart] = useState<ProductInShop[]>([]);
  const { getCart } = useCartApi();
  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await getCart("1");
      const cartDataInShop = cartData.map((product) => ({
        ...product,
        available: true,
        availableQuantity: 1,
        price: 2.99,
      }));
      setCart(cartDataInShop);
    };
    fetchCart();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="cart" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Your cart</ThemedText>
      </ThemedView>
      {cart.map((product) => (
        <ThemedView key={product.id}>
          <Image source={{ uri: product.image_url }} />
          <ThemedText>{product.name}</ThemedText>
          <ThemedText>{product.price}</ThemedText>
        </ThemedView>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
