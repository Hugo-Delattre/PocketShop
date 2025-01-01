import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { CameraView } from "expo-camera";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Product, ProductInShop } from "@/constants/interface/Product";
import React, { useState, useEffect } from "react";
import useCartApi from "@/hooks/api/cart";
import { ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "@rneui/base";
import Icon from "@rneui/themed/dist/Icon";

const cartDataTest: ProductInShop = {
  available: true,
  availableQuantity: Math.trunc(Math.random() * 100),
  price: 2.99,
  id: "1",
  name: "Test Product",
  image_url: "https://via.placeholder.com/150",
  testNutriments: {
    "energy-kcal": 0,
    fat: 0,
    proteins: 0,
    carbohydrates: 0,
    fiber: 0,
    salt: 0,
    sugars: 0,
    sodium: 0,
  },
  brands: "",
  product_name_fr: "",
  generic_name_fr: "",
  ingredients_text: "",
  link: "",
  categories: [],
  ingredients: [],
  allergens: [],
  quantity: "",
};
export default function Cart() {
  const [cart, setCart] = useState<ProductInShop[]>([]);
  const { getCart } = useCartApi();
  useEffect(() => {
    const fetchCart = async () => {
      // const cartData = await getCart("1");
      // const cartDataInShop = cartData.map((product) => ({
      //   ...product,
      //   available: true,
      //   availableQuantity: 1,
      //   price: 2.99,
      // }));

      setCart([
        cartDataTest,
        cartDataTest,
        cartDataTest,
        cartDataTest,
        cartDataTest,
      ]);
    };
    fetchCart();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* <Image
          source={require("../../assets/images/background.png")}
          style={styles.backgroundImage}
        /> */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {cart.length} differents products for{" "}
          </Text>
          <Text style={styles.headerPrice}>
            {" "}
            <Text style={styles.totalPrice}>30.00 €</Text>
          </Text>
        </View>
      </View>
      <View style={styles.productCardContainer}>
        <ScrollView style={styles.scrollArea}>
          {" "}
          {cart.map((product) => (
            <View
              key={product.id + Math.random().toString()}
              style={styles.productCard}
            >
              <Image
                source={{
                  uri: "https://www.granitz.fr/images/image-not-found.jpg",
                }}
                style={styles.productImage}
              />
              <View style={styles.cardInfo}>
                <ThemedText>{product.name}</ThemedText>
                <View style={{ flexDirection: "row" }}>
                  <ThemedText style={styles.price}>
                    {product.price} €
                  </ThemedText>
                  <View style={styles.quantity}>
                    <TouchableOpacity
                      style={styles.btnRemove}
                      onPress={() => console.log("remove")}
                    >
                      <Icon name={"remove"} size={15} color="white" />
                    </TouchableOpacity>
                    <ThemedText style={styles.quantityText}>
                      {product.availableQuantity}
                    </ThemedText>
                    <TouchableOpacity
                      style={styles.btnAdd}
                      onPress={() => console.log("add")}
                    >
                      <Icon name={"add"} size={15} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.payArea}>
        <Text style={styles.checkoutText}>Checkout 30.00 €</Text>
        <TouchableOpacity
          style={styles.paypal}
          onPress={() => console.log("remove")}
        >
          <Icon name={"paypal"} size={25} color="white" />
          <Text style={styles.payText}>Pay now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "75%",
  },
  backgroundImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    fontFamily: "Crimson Text",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: 16,
    textAlign: "center",
  },
  headerPrice: {
    fontFamily: "Crimson Text",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "500",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  price: {
    fontSize: 16,
    marginTop: 2,
    fontWeight: "500",
  },
  productCardContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "75%",
  },
  scrollArea: {
    width: "75%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  productCard: {
    width: "100%",
    height: 100,
    margin: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cardInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 10,
    padding: 10,
  },
  quantity: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    marginLeft: 5,
    width: "50%",
  },
  btnRemove: {
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    backgroundColor: "red",
    borderRadius: 50,
    margin: 5,
  },
  btnAdd: {
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    backgroundColor: "green",
    borderRadius: 50,
    margin: 5,
  },
  payArea: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  paypal: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: 120,
    borderRadius: 10,
    height: 40,
    backgroundColor: "#0079C1",
  },
  payText: {
    color: "white",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  quantityText: {
    fontSize: 16,
    marginTop: 2,
    fontWeight: "600",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
