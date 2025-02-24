Nous allons procéder en 3 étapes : 
- Authentification à Paypal POST https://api-m.sandbox.paypal.com/v1/oauth2/token
- Création d'une commande POST https://api-m.sandbox.paypal.com/v2/checkout/orders
- Capture d'une commande POST https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}/capture


L'authentification à Paypal est à faire pour pour obtenir un token d'accès.

La création d'une commande paypal est à faire dès qu'on clique sur le bouton Payer.

La capture d'une commande paypal est à faire dès qu'on a reçu le paiement.
