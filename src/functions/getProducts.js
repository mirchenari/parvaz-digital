export default async function getProductsData(setProducts, productsArray) {
  setProducts([]);
  try {
    const response = await Promise.all(
      productsArray.map((product) =>
        fetch(`/api/get-data/products/${product.id}`).then(async (e) => {
          let data = await e.json();
          if (!e.ok) {
            throw new Error(data.message);
          }
          return data;
        })
      )
    );
    setProducts(response);
  } catch (error) {
    console.error(error);
  }
}
