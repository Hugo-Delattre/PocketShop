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

export default function Product({ product }: { product: Product }) {
  const [bipSound, setBipSound] = useState<Audio.Sound | null>(null);

  // FOR TESTING PURPOSE
  const productDataTest: ProductInShop = {
    ...product,
    available: true,
    availableQuantity: Math.trunc(Math.random() * 100),
    price: 2.99,
  };
  //END TEST

  const [productData, setProductData] = useState<ProductInShop | null>(
    productDataTest
  );

  function addToCart(product: Product) {
    console.log(`Adding product ${product.name} to cart`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.productCard}>
        <Image
          source={{
            uri: product?.image_url
              ? product.image_url
              : "https://www.granitz.fr/images/image-not-found.jpg",
          }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <Text numberOfLines={2} ellipsizeMode="clip" style={{ fontSize: 22 }}>
          {product?.product_name_fr !== ""
            ? product.product_name_fr
            : product?.name}
          {", "}
          <Text style={{ fontWeight: "bold" }}>{product?.brands}</Text>
        </Text>
        <Card.Divider />
        <Text style={{ fontSize: 30 }}>
          {productData?.price} €
          <Text style={{ fontSize: 15 }}>
            {" ("}
            {productData?.available
              ? `${productData?.availableQuantity} left in stock`
              : "Not available"}
            {")"}
          </Text>
        </Text>
      </View>
      <View style={styles.buttonsPart}>
        <Button
          color={"primary"}
          radius={15}
          title="Add to Cart"
          onPress={() => {
            addToCart(product);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  productImage: {
    aspectRatio: 3 / 4,
    width: "50%",
    height: "66%",
    borderRadius: 30,
    margin: 10,
  },
  productCard: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 10,
  },
  message: {
    padding: 5,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  productName: {
    fontWeight: "bold",
  },
  buttonsPart: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
