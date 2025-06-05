import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  const { cart, setCart, products, user } = useContext(AppContext);
  const [orderValue, setOrderValue] = useState(0);
  const Navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  // Update orderValue whenever cart or products change
  useEffect(() => {
    const value = products.reduce((sum, product) => {
      return sum + product.price * (cart[product.pid] || 0);
    }, 0);
    setOrderValue(value);
  }, [cart, products]);

  const increment = (id) => {
    setCart((prevCart) => ({
      ...prevCart,
      [id]: (prevCart[id] || 0) + 1,
    }));
  };

  const decrement = (id) => {
    setCart((prevCart) => {
      const updatedQty = Math.max((prevCart[id] || 0) - 1, 0);
      const updatedCart = { ...prevCart, [id]: updatedQty };
      if (updatedQty === 0) delete updatedCart[id]; // remove item if qty = 0
      return updatedCart;
    });
  };

  const placeOrder = async () => {
    const url = `${API}/orders/new`;
    await axios.post(url, { email: user.email, orderValue });
    setCart({});
    Navigate("/order");
  };

  const loginToOrder = () => {
    Navigate("/login");
  };

  return (
    <div>
      <h2>My Cart</h2>
      {products.map((product) =>
        cart[product.pid] ? (
          <div key={product.pid}>
            {product.pid} {product.name}-{product.price}-
            <button onClick={() => decrement(product.pid)}>-</button>
            {cart[product.pid]}
            <button onClick={() => increment(product.pid)}>+</button>
            {product.price * cart[product.pid]}
          </div>
        ) : null
      )}
      <hr />
      <h3>Order Value: {orderValue}</h3>
      <hr />
      {user?.name ? (
        <button onClick={placeOrder}>Place Order</button>
      ) : (
        <button onClick={loginToOrder}>Login to Order</button>
      )}
      <hr />
    </div>
  );
}
