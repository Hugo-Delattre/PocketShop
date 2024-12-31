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
} from "react-native";
import { Audio } from "expo-av";
import { Card } from "@rneui/base";
import useProductApi from "@/hooks/api/product";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
      <View>
        <Text numberOfLines={2} ellipsizeMode="clip" style={styles.screenTitle}>
          {product?.product_name_fr !== ""
            ? product.product_name_fr
            : product?.name}
          {" - "}
          {product?.brands}
        </Text>
      </View>

      <Image
        source={require("../../assets/images/background.png")}
        style={styles.backgroundImage}
      />
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
  productCard: {
    position: "absolute",
    left: 87,
    top: 214,
  },
  productImage: { width: 218, height: 218 },
  screenTitle: {
    position: "absolute",
    width: 300,
    height: 28,
    left: 46,
    top: 100,
    fontFamily: "Crimson Text",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 28,
    lineHeight: 28,
    textAlign: "center",
  },
  nutritionFacts: {
    padding: 24,
    gap: 10,
    position: "absolute",
    width: 300,
    height: 282,
    left: 46,
    top: 400,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addToCart: {
    position: "absolute",
    width: 135,
    height: 40,
    left: 245,
    top: 700,
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
