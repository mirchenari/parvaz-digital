export default function getTotalPrice(cart, products, off = 0, shipment = 0) {
  if (cart.length != 0 && products.length != 0) {
    let result = shipment - off;
    cart.forEach((element) => {
      result += element.num * products.find((e) => e._id == element.id).price;
    });
    return result.toLocaleString("fa-IR") + " تومان";
  }
}
