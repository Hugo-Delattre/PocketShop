import { Product, ProductInShop } from "@/constants/interface/Product";
import { fetchByCode } from "@/hooks/api/test";
import { CameraView, CameraType, useCameraPermissions, Camera, BarcodeScanningResult } from "expo-camera";
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
export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [currentlyScanning, setCurrentlyScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<Product | null>(null);
  const [bipSound, setBipSound] = useState<Audio.Sound | null>(null);

  // FOR TESTING PURPOSE
  const productDataTest: ProductInShop = {
    product: scannedData,
    available: true,
    avaibleQuantity: Math.trunc(Math.random() * 100),
    price: 2.99,
  };
  //END TEST

  const [productData, setProductData] = useState<ProductInShop | null>(
    productDataTest
  );

  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/bip.wav")
      );
      setBipSound(sound);
    }
    loadSound();
  }, []);
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </SafeAreaView>
    );
  }
  const handleBarcodeScanned = async (result : BarcodeScanningResult ) => {

    console.log("Scanning...");
      await bip();
      await onBarCodeScanned(result.data)
    };
  async function bip() {
    console.log("Playing Sound");
    if (bipSound) {
      await bipSound.replayAsync();
    }
  }

  async function onBarCodeScanned(data:string) {
    CameraView.dismissScanner();
    console.log("Scanned data:", data);
    setCurrentlyScanning(true);
    const productData = await fetchByCode(data);
    setScannedData(productData.product);
    console.log("Scanned data:", scannedData);
  }

  if (currentlyScanning && scannedData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.productCard}>
          <Image
            source={{
              uri: scannedData.image_url
                ? scannedData.image_url
                : "https://www.granitz.fr/images/image-not-found.jpg",
            }}
            style={styles.productImage}
            resizeMode="contain"
          />
          <Text numberOfLines={2} ellipsizeMode="clip" style={{ fontSize: 22 }}>
            {scannedData.product_name_fr !== ""
              ? scannedData.product_name_fr
              : scannedData.name}
            {", "}
            <Text style={{ fontWeight: "bold" }}>{scannedData.brands}</Text>
          </Text>
          <Card.Divider />
          {/* <Text>{scannedData.quantity}</Text> */}
          {/* <Text style={{ fontSize: 10 }}>
            {"["}
            {scannedData.id}
            {"]"}
          </Text> */}
          {/* <Text>Ingrédients : {scannedData.ingredients_text}</Text> */}
          {/* <Text>{scannedData.categories}</Text> */}
          {/* <Text>{scannedData.allergens}</Text> */}

          <Text style={{ fontSize: 30 }}>
            {productData?.price} €
            <Text style={{ fontSize: 15 }}>
              {" ("}
              {productData?.available
                ? `${productData?.avaibleQuantity} left in stock`
                : "Not vailable"}
              {")"}
            </Text>
          </Text>
        </View>
        <View style={styles.buttonsPart}>
          <Button
            type="outline"
            title="Back to scan"
            radius={15}
            onPress={() => setCurrentlyScanning(false)}
          ></Button>
          <Button
            color={"primary"}
            radius={15}
            title="Add to Cart"
            onPress={() => {
              console.log(
                "Product added to cart:",
                scannedData.generic_name_fr
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={facing} onBarcodeScanned={currentlyScanning ? undefined : handleBarcodeScanned}>
        <View style={styles.buttonContainer}>
        </View>
      </CameraView>
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
