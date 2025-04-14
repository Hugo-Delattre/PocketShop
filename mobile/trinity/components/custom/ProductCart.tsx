import { Icon } from "@rneui/base";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { CartInfo } from "@/constants/interface/Cart";
import useCartApi, { AddPayload, removePayload } from "@/hooks/api/cart";
import React, { useEffect, useState } from "react";
import { getUserIdFromJwt } from "@/hooks/auth";

export interface ProductCartProps {
  productData: CartInfo;
  orderId: number;
  onQuantityChange?: (updatedQuantity: number) => void;
}
const ProductCard = (props: ProductCartProps) => {
  console.log("PRODUCT IN CART", props.productData.code);
  const { addToCart, removeFromCart } = useCartApi();
  const [userId, setUserId] = useState("1");
  const [isEmpty, setIsEmpty] = useState(false);
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromJwt();
      setUserId(userId?.toString() || "1");
    };
    fetchUserId();
  }, []);
  const addPayload: AddPayload = {
    productId: props.productData.code,
    shopId: "1",
    userId: userId,
  };
  const removePayload: removePayload = {
    productId: Number(props.productData.product.id),
    orderId: Number(props.orderId),
    shopId: 1,
    userId: Number(userId),
  };
  useEffect(() => {
    if (isEmpty) {
      console.log("Cart is empty, returning empty component");
    }
  }, [isEmpty]);

  if (isEmpty) {
    return <></>;
  }

  return (
    <SafeAreaView>
      <View key={props.productData.product.id} style={styles.productCard}>
        <Image
          source={{
            uri: props.productData.product.image_url,
          }}
          style={styles.productImage}
        />
        <View style={styles.cardInfo}>
          <ThemedText numberOfLines={3} ellipsizeMode="tail">
            {props.productData.product.product_name_fr}
          </ThemedText>
          <View style={{ flexDirection: "row" }}>
            <ThemedText style={styles.price}>
              {props.productData.price} €
            </ThemedText>
            <View style={styles.quantity}>
              <TouchableOpacity
                style={styles.btnRemove}
                onPress={() => {
                  props.productData.selectedQuantity--;
                  props.onQuantityChange?.(props.productData.selectedQuantity);
                  console.log(
                    "selectedQuantity",
                    props.productData.selectedQuantity
                  );
                  if (props.productData.selectedQuantity === 0) {
                    setIsEmpty(true);
                    console.log("isEmpty", isEmpty);
                  }
                  removeFromCart(removePayload);
                }}
              >
                <Icon name={"remove"} size={15} color="white" />
              </TouchableOpacity>
              <ThemedText style={styles.quantityText}>
                {props.productData.selectedQuantity}
              </ThemedText>
              <TouchableOpacity
                style={styles.btnAdd}
                onPress={() => {
                  props.productData.selectedQuantity++;
                  props.onQuantityChange?.(props.productData.selectedQuantity);
                  addToCart(addPayload);
                }}
              >
                <Icon name={"add"} size={15} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productCard: {
    width: 100,
    height: 100,
    margin: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cardInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 2,
    padding: 2,
  },
  price: {
    fontSize: 16,
    marginTop: 2,
    fontWeight: "500",
  },
  quantity: {
    flexDirection: "row",
    justifyContent: "space-evenly",
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
  quantityText: {
    fontSize: 16,
    marginTop: 2,
    fontWeight: "600",
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
});
