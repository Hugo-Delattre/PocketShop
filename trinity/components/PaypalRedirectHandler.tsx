import React, { useEffect } from "react";
import * as Linking from "expo-linking";

export default function PayPalRedirectHandler() {
  useEffect(() => {
    const handleRedirect = ({ url }: { url: string }) => {
      if (url.startsWith("myapp://paypal-success")) {
        console.log("Paiement réussi !", url);
        const urlParams = Linking.parse(url);
        capturePaypalOrder();
        // urlParams
      } else if (url.startsWith("myapp://paypal-cancel")) {
        console.log("Paiement annulé");
      }
    };

    const subscription = Linking.addEventListener("url", handleRedirect);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleRedirect({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const capturePaypalOrder = async () =>
    // paymentData
    {
      console.log("TODO: setup capturePaypalOrder");

      // try {
      //   const response = await fetch(
      //     `/api/paypal/capture/${paymentData.paymentId}`
      //   );
      //   const data = await response.json();
      //   if (data.success) {
      //     // navigation.navigate("PaymentSuccess", { data: paymentData });
      //   } else {
      //     // navigation.navigate("PaymentError", { error: "Erreur de paiement" });
      //   }
      // } catch (error) {
      //
      //   // navigation.navigate("PaymentError", { error: error.message });
      // }
    };

  return null;
}
