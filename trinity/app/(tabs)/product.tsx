import { Product, ProductInShop } from "@/constants/interface/Product";
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
export default function ProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { getProduct, loading } = useProductApi();
  const [product, setProduct] = useState<Product | null>(null);
  const [bipSound, setBipSound] = useState<Audio.Sound | null>(null);

  // from string | string[] to string
  const productId = Array.isArray(params?.productId)
    ? params.productId[0]
    : params?.productId;

  useEffect(() => {
    console.log("Product ID", productId);
    const fetchProduct = async () => {
      const productData = await getProduct(productId);
      console.log("Product Data", productData);

      if (productData) {
        //TODO: remove this .product after fixing the API
        setProduct(productData.product);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // FOR TESTING PURPOSE
  const productDataTest: ProductInShop = {
    available: true,
    availableQuantity: Math.trunc(Math.random() * 100),
    price: 2.99,
    testNutriments: {
      "energy-kcal": 160,
      fat: 10,
      carbohydrates: 20,
      fiber: 5,
      proteins: 5,
      salt: 0.1,
      sugars: 10,
      sodium: 0.1,
    },
    ...product,
  };

  //END TEST
  function addToCart(product: Product) {
    console.log(`Adding product ${product.name} to cart`);
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text numberOfLines={2} ellipsizeMode="clip" style={styles.screenTitle}>
          {product?.product_name_fr !== ""
            ? product.product_name_fr
            : product?.name}
          {" - "}
          {product?.brands}
        </Text>
      </View>
      <View style={styles.productCard}>
        <Image
          source={{
            uri: product?.image_url
              ? product.image_url
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
              <Text style={{ fontWeight: "bold" }}>160</Text>
            </View>
          </View>
          <CardDivider />

          <ScrollView style={{ height: 125, padding: 10 }}>
            {productDataTest?.testNutriments &&
              Object.entries(productDataTest.testNutriments).map(
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
            addToCart(product);
          }}
          radius={5}
        >
          <Text style={styles.price}>{productDataTest.price} €</Text>
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
