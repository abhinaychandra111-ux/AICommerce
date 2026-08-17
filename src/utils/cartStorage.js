// =========================================================
// CART STORAGE
// Each logged-in user gets their own cart
// =========================================================

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(
      "aicommerce-user"
    );

    if (!user) {
      return null;
    }

    return JSON.parse(user);

  } catch (error) {
    console.error(
      "Failed to read current user:",
      error
    );

    return null;
  }
};


// =========================================================
// GET USER ID
// =========================================================

export const getUserCartKey = () => {

  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  const userId =
    user._id ||
    user.id ||
    user.email;

  if (!userId) {
    return null;
  }

  return `aicommerce-cart-user-${userId}`;
};


// =========================================================
// GET CART
// =========================================================

export const getUserCart = () => {

  const key =
    getUserCartKey();

  if (!key) {
    return [];
  }

  try {

    return JSON.parse(
      localStorage.getItem(key) ||
      "[]"
    );

  } catch (error) {

    console.error(
      "Failed to load user cart:",
      error
    );

    return [];
  }
};


// =========================================================
// SAVE CART
// =========================================================

export const saveUserCart = (
  cart
) => {

  const key =
    getUserCartKey();

  if (!key) {
    return;
  }

  localStorage.setItem(
    key,
    JSON.stringify(cart)
  );
};


// =========================================================
// CLEAR CART
// =========================================================

export const clearUserCart = () => {

  const key =
    getUserCartKey();

  if (!key) {
    return;
  }

  localStorage.removeItem(key);
};