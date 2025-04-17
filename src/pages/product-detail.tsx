import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Api from "src/helpers/Api";

import { CONFIG } from 'src/config-global';

import { ProductDetailPage } from 'src/sections/product/view/product-detail-page';
import { ProductItemProps } from 'src/sections/product/product-item';
// ----------------------------------------------------------------------

export default function Page() {
  const [product, setProduct] = useState<ProductItemProps | null>(null);
  const { productId } = useParams();

  useEffect(() => {
    if (!productId) return;

    Api.getActivityById(productId)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
        
  }, [productId]);

  if (!productId) {
    return <div>Invalid product ID</div>;
  }

  if (!product) {
    return <div>Loading product...</div>;
  }

  return (
    <>
      <Helmet>
        <title> {`${product.name} - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProductDetailPage product={product}/>
    </>
  );
}
