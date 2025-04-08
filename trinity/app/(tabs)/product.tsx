import { ProductInShop } from "@/constants/interface/Product";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
  BarcodeScanningResult,
} from "expo-camera";
import { useEffect, useState } from "react";
import { Button } from "@rneui/themed";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { Audio } from "expo-av";
import { Card } from "@rneui/base";
import useProductApi from "@/hooks/api/product";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScrollView } from "react-native";
import useCartApi from "@/hooks/api/cart";
import React from "react";
import { getUserIdFromJwt } from "@/hooks/auth";
import { set } from "react-hook-form";
export default function ProductScreen() {
  const router = useRouter();
  const { addToCart, removeFromCart } = useCartApi();
  const params = useLocalSearchParams();
  const { getProduct, loading, error } = useProductApi();
  const [productInShop, setProductShop] = useState<ProductInShop | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  // from string | string[] to string
  const productId = Array.isArray(params?.productId)
    ? params.productId[0]
    : params?.productId;
  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProduct(productId);
      const userId = await getUserIdFromJwt();
      setUserId(userId?.toString() || null);
      if (productData) {
        setProductShop(productData);
      }
    };

    fetchProduct();
  }, [productId]);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text
            style={[
              styles.message,
              { textAlign: "center", color: "red", marginBottom: 10 },
            ]}
          >
            Une erreur est survenue :
          </Text>
          <Text style={[styles.message, { textAlign: "center" }]}>
            {error.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  if (loading || !productInShop) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Loading...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text numberOfLines={2} ellipsizeMode="clip" style={styles.screenTitle}>
          {productInShop.product?.product_name_fr !== ""
            ? productInShop.product.product_name_fr
            : productInShop.product?.name}
          {" - "}
          {productInShop.product?.brands}
        </Text>
      </View>
      <View style={styles.productCard}>
        <Image
          source={{
            uri: productInShop.product?.image_url
              ? productInShop.product.image_url
              : "https://www.granitz.fr/images/image-not-found.jpg",
          }}
          style={styles.productImage}
        />
        {/* <Text style={{ fontSize: 30 }}>
          {productDataTest?.price} €
          <Text style={{ fontSize: 15 }}>
            {" ("}
            {productDataTest?.available
              ? `${productDataTest?.availableQuantity} left in stock`
              : "Not available"}
            {")"}
          </Text>
        </Text> */}
      </View>
      {/* <View>
        <Button
          color={"primary"}
          radius={15}
          title="Add to Cart"
          onPress={() => {
            addToCart(product);
          }}
        />
      </View> */}

      <View style={styles.nutritionFacts}>
        <Card>
          <Card.Title>Nutrition facts</Card.Title>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Calories for 100g</Text>
              <Text style={{ fontWeight: "bold" }}>
                {productInShop.product.nutriments?.["energy-kcal"]} kcal
              </Text>
            </View>
          </View>
          <CardDivider />

          <ScrollView style={{ height: 125, padding: 10 }}>
            {productInShop.product?.nutriments &&
              Object.entries(productInShop.product.nutriments).map(
                ([key, value]) => (
                  <View
                    key={key}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{key}</Text>
                    <Text style={{ fontWeight: "bold" }}>{value}</Text>
                  </View>
                )
              )}
          </ScrollView>
        </Card>
      </View>
      <View style={styles.addToCart}>
        <Button
          color={"#0B132B"}
          title="Add to Cart"
          onPress={() => {
            console.log("Adding to cart", {
              productId: productInShop.code,
              shopId: "1",
              userId: userId,
            });
            addToCart({
              productId: productInShop.code,
              shopId: "1",
              userId: userId?.toString() || "1",
            });
          }}
          radius={5}
        >
          <Text style={styles.price}>{productInShop.price} €</Text>
          <FontAwesome name="cart-arrow-down" size={20} color="white" />
        </Button>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  productCard: {
    padding: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  productImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontFamily: "Crimson Text",
    fontStyle: "normal",
    fontWeight: 400,
    padding: 10,
    fontSize: 22,
    textAlign: "center",
  },
  nutritionFacts: {
    margin: 24,
    borderRadius: 10,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addToCart: {
    height: 40,
    marginRight: 39,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 10,
  },
  price: {
    fontSize: 18,
    color: "white",
    marginRight: 10,
  },
  backgroundImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
});
