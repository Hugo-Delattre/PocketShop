import Ionicons from "@expo/vector-icons/Ionicons";
import { WebView } from "react-native-webview";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
} from "react-native";
import { ProductInShop } from "@/constants/interface/Product";
import React, { useState, useEffect } from "react";
import useCartApi from "@/hooks/api/cart";
import { ScrollView } from "react-native";
import Icon from "@rneui/themed/dist/Icon";
import ProductCard from "@/components/custom/ProductCart";
import { CartResponseDao } from "@/constants/interface/Cart";
import { usePathname } from "expo-router";
import usePaypalApi from "@/hooks/api/paypal";
import * as Linking from "expo-linking";

export default function Cart() {
  const [cart, setCart] = useState<CartResponseDao>();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState<string | null>(null);
  const path = usePathname();
  const { getCart, loading } = useCartApi();
  const {
    initiatePaypalPayment,
    loading: isPaypalLoading,
    error,
  } = usePaypalApi();

  useEffect(() => {
    const fetchCart = async () => {
      const cart = await getCart(1);
      if (!cart) return;
      setCart(cart);
    };
    fetchCart();
  }, [path]);

  const handlePaypalPayment = async () => {
    console.log("handlePaypalPayment");
    try {
      const paypalResponse = await initiatePaypalPayment(2); //We will have to use order.id instead, for now i've just used an hardcoded value
      if (paypalResponse?.paypalUrl) {
        console.log("Redirection vers PayPal :", paypalResponse.paypalUrl);
        setPaypalUrl(paypalResponse.paypalUrl);
        setShowPaymentModal(true);
      }
    } catch (err) {
      console.error("Erreur lors du paiement PayPal :", err);
    }
  };

  const handleNavigationStateChange = (navState: { url: string }) => {
    const { url } = navState;
    console.log("URL détectée :", url);
    if (url.startsWith("trinity://payment-success")) {
      console.log("Paiement réussi");
      setShowPaymentModal(false);
      //TODO: Success logic
    } else if (url.startsWith("trinity://payment-cancel")) {
      console.log("Paiement annulé !");
      setShowPaymentModal(false);
      //TODO: Cancel logic
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* <Image
            source={require("../../assets/images/background.png")}
            style={styles.backgroundImage}
          /> */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {cart?.products.length} differents products for{" "}
          </Text>
          <Text style={styles.headerPrice}>
            <Text style={styles.totalPrice}>{cart?.totalPrice} €</Text>
          </Text>
        </View>
      </View>
      <View style={styles.productCardContainer}>
        <ScrollView style={styles.scrollArea}>
          {loading ? (
            <Text>loading..</Text>
          ) : (
            cart?.products.map((product) => {
              return (
                <ProductCard
                  key={product.code}
                  productData={product}
                  orderId={cart.orderId}
                />
              );
            })
          )}
        </ScrollView>
      </View>
      <View style={styles.payArea}>
        <Text style={styles.checkoutText}>Checkout {cart?.totalPrice}</Text>
        <TouchableOpacity
          style={styles.paypal}
          onPress={() => {
            handlePaypalPayment();
            console.log("pay clicked");
          }}
        >
          <Icon name={"paypal"} size={25} color="white" />
          <Text style={styles.payText}>
            {isPaypalLoading ? "Chargement..." : "Pay now"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPaymentModal}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {paypalUrl && (
            <WebView
              source={{ uri: paypalUrl }}
              onNavigationStateChange={handleNavigationStateChange}
              style={{ flex: 1 }}
            />
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPaymentModal(false)}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
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
  closeButton: {
    padding: 10,
    backgroundColor: "#0079C1",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
