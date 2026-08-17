import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Phone,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  Package,
  MapPin,
  Pencil,
  X,
  Save,
  LoaderCircle,
  Plus,
  Trash2,
  Star,
  Home,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";


function Profile() {
  const navigate = useNavigate();

  const token = localStorage.getItem(
    "aicommerce-token"
  );


  // =========================================================
  // USER
  // =========================================================

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "aicommerce-user"
        ) || "null"
      );
    } catch {
      return null;
    }
  });


  // =========================================================
  // PROFILE EDIT
  // =========================================================

  const [editOpen, setEditOpen] =
    useState(false);

  const [editForm, setEditForm] =
    useState({
      name: "",
      email: "",
      phone: "",
    });

  const [savingProfile, setSavingProfile] =
    useState(false);


  // =========================================================
  // ADDRESSES
  // =========================================================

  const [addresses, setAddresses] =
    useState([]);

  const [addressesLoading, setAddressesLoading] =
    useState(true);

  const [addressOpen, setAddressOpen] =
    useState(false);

  const [editingAddressId, setEditingAddressId] =
    useState(null);

  const [savingAddress, setSavingAddress] =
    useState(false);

  const [deletingAddressId, setDeletingAddressId] =
    useState(null);

  const [addressMessage, setAddressMessage] =
    useState("");

  const [addressError, setAddressError] =
    useState("");


  const emptyAddress = {
    label: "Home",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  };


  const [addressForm, setAddressForm] =
    useState(emptyAddress);


  // =========================================================
  // GENERAL MESSAGES
  // =========================================================

  const [profileMessage, setProfileMessage] =
    useState("");

  const [profileError, setProfileError] =
    useState("");


  // =========================================================
  // AUTH CHECK
  // =========================================================

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    fetchAddresses();
  }, []);


  // =========================================================
  // FETCH ADDRESSES
  // =========================================================

  const fetchAddresses = async () => {
    const currentToken =
      localStorage.getItem(
        "aicommerce-token"
      );

    if (!currentToken) {
      navigate("/login");
      return;
    }

    try {
      setAddressesLoading(true);
      setAddressError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/addresses",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${currentToken}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load addresses"
        );
      }

      setAddresses(
        Array.isArray(data.addresses)
          ? data.addresses
          : []
      );

    } catch (error) {
      console.error(
        "Address fetch error:",
        error
      );

      setAddressError(
        error.message ||
        "Failed to load addresses"
      );

    } finally {
      setAddressesLoading(false);
    }
  };


  // =========================================================
  // EDIT PROFILE
  // =========================================================

  const handleOpenEdit = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setProfileMessage("");
    setProfileError("");

    setEditOpen(true);
  };


  const handleCloseEdit = () => {
    if (savingProfile) return;

    setEditOpen(false);
    setProfileMessage("");
    setProfileError("");
  };


  const handleEditChange = (event) => {
    setEditForm({
      ...editForm,
      [event.target.name]:
        event.target.value,
    });
  };


  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const handleUpdateProfile = async (
    event
  ) => {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    if (!editForm.name.trim()) {
      setProfileError(
        "Name cannot be empty."
      );
      return;
    }

    if (!editForm.email.trim()) {
      setProfileError(
        "Email cannot be empty."
      );
      return;
    }

    const currentToken =
      localStorage.getItem(
        "aicommerce-token"
      );

    if (!currentToken) {
      navigate("/login");
      return;
    }

    setSavingProfile(true);

    try {
      const response =
        await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${currentToken}`,
            },

            body: JSON.stringify({
              name:
                editForm.name.trim(),

              email:
                editForm.email
                  .trim()
                  .toLowerCase(),

              phone:
                editForm.phone.trim(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to update profile"
        );
      }

      const updatedUser =
        data.user || {
          ...user,

          name:
            editForm.name.trim(),

          email:
            editForm.email
              .trim()
              .toLowerCase(),

          phone:
            editForm.phone.trim(),
        };

      setUser(updatedUser);

      localStorage.setItem(
        "aicommerce-user",
        JSON.stringify(
          updatedUser
        )
      );

      setProfileMessage(
        "Profile updated successfully."
      );

      setTimeout(() => {
        setEditOpen(false);
        setProfileMessage("");
      }, 800);

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setProfileError(
        error.message ||
        "Failed to update profile."
      );

    } finally {
      setSavingProfile(false);
    }
  };


  // =========================================================
  // OPEN ADD ADDRESS
  // =========================================================

  const handleAddAddress = () => {
    setEditingAddressId(null);

    setAddressForm({
      ...emptyAddress,

      name:
        user?.name || "",

      phone:
        user?.phone || "",
    });

    setAddressMessage("");
    setAddressError("");

    setAddressOpen(true);
  };


  // =========================================================
  // OPEN EDIT ADDRESS
  // =========================================================

  const handleEditAddress = (
    address
  ) => {
    setEditingAddressId(
      address._id
    );

    setAddressForm({
      label:
        address.label ||
        "Home",

      name:
        address.name ||
        "",

      phone:
        address.phone ||
        "",

      address:
        address.address ||
        "",

      city:
        address.city ||
        "",

      state:
        address.state ||
        "",

      pincode:
        address.pincode ||
        "",
    });

    setAddressMessage("");
    setAddressError("");

    setAddressOpen(true);
  };


  // =========================================================
  // CLOSE ADDRESS FORM
  // =========================================================

  const handleCloseAddress = () => {
    if (savingAddress) return;

    setAddressOpen(false);
    setEditingAddressId(null);
    setAddressMessage("");
    setAddressError("");
  };


  // =========================================================
  // ADDRESS INPUT
  // =========================================================

  const handleAddressChange = (
    event
  ) => {
    setAddressForm({
      ...addressForm,

      [event.target.name]:
        event.target.value,
    });
  };


  // =========================================================
  // SAVE ADDRESS
  // =========================================================

  const handleSaveAddress = async (
    event
  ) => {
    event.preventDefault();

    setAddressMessage("");
    setAddressError("");

    const currentToken =
      localStorage.getItem(
        "aicommerce-token"
      );

    if (!currentToken) {
      navigate("/login");
      return;
    }


    const requiredFields = [
      "name",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];


    for (const field of requiredFields) {
      if (
        !addressForm[field] ||
        !addressForm[field].trim()
      ) {
        setAddressError(
          "Please complete all address fields."
        );

        return;
      }
    }


    setSavingAddress(true);


    try {
      const isEditing =
        Boolean(
          editingAddressId
        );


      const url = isEditing
        ? `http://localhost:5000/api/auth/addresses/${editingAddressId}`
        : "http://localhost:5000/api/auth/addresses";


      const response =
        await fetch(url, {
          method: isEditing
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${currentToken}`,
          },

          body: JSON.stringify({
            label:
              addressForm.label,

            name:
              addressForm.name.trim(),

            phone:
              addressForm.phone.trim(),

            address:
              addressForm.address.trim(),

            city:
              addressForm.city.trim(),

            state:
              addressForm.state.trim(),

            pincode:
              addressForm.pincode.trim(),
          }),
        });


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to save address"
        );
      }


      setAddressMessage(
        isEditing
          ? "Address updated successfully."
          : "Address added successfully."
      );


      await fetchAddresses();


      setTimeout(() => {
        setAddressOpen(false);
        setEditingAddressId(null);
        setAddressMessage("");
      }, 700);

    } catch (error) {
      console.error(
        "Save address error:",
        error
      );

      setAddressError(
        error.message ||
        "Failed to save address"
      );

    } finally {
      setSavingAddress(false);
    }
  };


  // =========================================================
  // DELETE ADDRESS
  // =========================================================

  const handleDeleteAddress = async (
    addressId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this address?"
      );

    if (!confirmed) {
      return;
    }


    const currentToken =
      localStorage.getItem(
        "aicommerce-token"
      );

    if (!currentToken) {
      navigate("/login");
      return;
    }


    setDeletingAddressId(
      addressId
    );

    setAddressError("");


    try {
      const response =
        await fetch(
          `http://localhost:5000/api/auth/addresses/${addressId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${currentToken}`,
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to delete address"
        );
      }


      await fetchAddresses();

    } catch (error) {
      console.error(
        "Delete address error:",
        error
      );

      setAddressError(
        error.message ||
        "Failed to delete address"
      );

    } finally {
      setDeletingAddressId(null);
    }
  };


  // =========================================================
  // SET DEFAULT ADDRESS
  // =========================================================

  const handleSetDefault = async (
    addressId
  ) => {
    const currentToken =
      localStorage.getItem(
        "aicommerce-token"
      );

    if (!currentToken) {
      navigate("/login");
      return;
    }


    try {
      setAddressError("");

      const response =
        await fetch(
          `http://localhost:5000/api/auth/addresses/${addressId}/default`,
          {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${currentToken}`,
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to set default address"
        );
      }


      await fetchAddresses();

    } catch (error) {
      console.error(
        "Default address error:",
        error
      );

      setAddressError(
        error.message ||
        "Failed to set default address"
      );
    }
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "aicommerce-token"
    );

    localStorage.removeItem(
      "aicommerce-user"
    );

    navigate("/");
  };


  // =========================================================
  // USER CHECK
  // =========================================================

  if (!user) {
    return null;
  }


  // =========================================================
  // AVATAR
  // =========================================================

  const firstLetter =
    user.name
      ?.charAt(0)
      ?.toUpperCase() || "U";


  return (
    <main className="profile-page">

      <div className="profile-container">


        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <section className="profile-header">

          <div className="profile-avatar">
            {firstLetter}
          </div>


          <div className="profile-header-info">

            <span>
              MY ACCOUNT
            </span>


            <div className="profile-name-row">

              <h1>
                {user.name}
              </h1>


              <button
                type="button"
                className="profile-edit-button"
                onClick={
                  handleOpenEdit
                }
              >
                <Pencil size={17} />

                Edit Profile
              </button>

            </div>


            <p>
              Manage your account
              and saved addresses
            </p>

          </div>

        </section>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="profile-content">


          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <section className="profile-info-card">

            <div className="profile-section-heading">

              <div>

                <h2>
                  Personal Information
                </h2>

                <p>
                  Your account details
                </p>

              </div>

            </div>


            {/* NAME */}

            <div className="profile-info">

              <div className="profile-info-icon">
                <User size={18} />
              </div>

              <div>
                <small>
                  Full Name
                </small>

                <strong>
                  {user.name ||
                    "Not added"}
                </strong>
              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-info">

              <div className="profile-info-icon">
                <Mail size={18} />
              </div>

              <div>
                <small>
                  Email Address
                </small>

                <strong>
                  {user.email ||
                    "Not added"}
                </strong>
              </div>

            </div>


            {/* PHONE */}

            <div className="profile-info">

              <div className="profile-info-icon">
                <Phone size={18} />
              </div>

              <div>
                <small>
                  Mobile Number
                </small>

                <strong>
                  {user.phone ||
                    "Not added"}
                </strong>
              </div>

            </div>


            {/* =================================================
                SAVED ADDRESSES
            ================================================= */}

            <div className="saved-addresses-section">

              <div className="saved-addresses-header">

                <div>

                  <div className="saved-address-title">

                    <MapPin size={20} />

                    <h2>
                      Saved Addresses
                    </h2>

                  </div>

                  <p>
                    Manage your delivery
                    addresses
                  </p>

                </div>


                <button
                  type="button"
                  className="add-address-button"
                  onClick={
                    handleAddAddress
                  }
                >
                  <Plus size={17} />

                  Add Address
                </button>

              </div>


              {/* ADDRESS ERROR */}

              {addressError && (

                <div className="address-error">
                  {addressError}
                </div>

              )}


              {/* LOADING */}

              {addressesLoading ? (

                <div className="addresses-loading">

                  <LoaderCircle
                    size={22}
                    className="profile-loader"
                  />

                  <span>
                    Loading addresses...
                  </span>

                </div>

              ) : addresses.length === 0 ? (

                /* EMPTY */

                <div className="no-addresses">

                  <div className="no-address-icon">

                    <Home size={25} />

                  </div>

                  <h3>
                    No saved addresses
                  </h3>

                  <p>
                    Add a delivery address
                    to make checkout faster.
                  </p>

                  <button
                    type="button"
                    className="add-first-address"
                    onClick={
                      handleAddAddress
                    }
                  >
                    <Plus size={16} />

                    Add Your First Address
                  </button>

                </div>

              ) : (

                /* ADDRESS LIST */

                <div className="address-list">

                  {addresses.map(
                    (address) => (

                      <article
                        className={`address-card ${
                          address.isDefault
                            ? "default-address"
                            : ""
                        }`}
                        key={
                          address._id
                        }
                      >

                        {/* ADDRESS TOP */}

                        <div className="address-card-top">

                          <div className="address-label">

                            <MapPin size={17} />

                            <strong>
                              {
                                address.label ||
                                "Address"
                              }
                            </strong>

                            {address.isDefault && (

                              <span className="default-badge">

                                <Star
                                  size={12}
                                />

                                Default

                              </span>

                            )}

                          </div>


                          <div className="address-card-actions">

                            <button
                              type="button"
                              onClick={() =>
                                handleEditAddress(
                                  address
                                )
                              }
                              title="Edit address"
                            >
                              <Pencil
                                size={15}
                              />
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteAddress(
                                  address._id
                                )
                              }
                              title="Delete address"
                              disabled={
                                deletingAddressId ===
                                address._id
                              }
                            >

                              {deletingAddressId ===
                              address._id ? (

                                <LoaderCircle
                                  size={15}
                                  className="profile-loader"
                                />

                              ) : (

                                <Trash2
                                  size={15}
                                />

                              )}

                            </button>

                          </div>

                        </div>


                        {/* ADDRESS CONTENT */}

                        <div className="address-details">

                          <strong>
                            {
                              address.name
                            }
                          </strong>

                          <span>
                            {
                              address.phone
                            }
                          </span>

                          <p>
                            {
                              address.address
                            }
                            <br />

                            {
                              address.city
                            }
                            ,{" "}
                            {
                              address.state
                            }{" "}

                            -{" "}

                            {
                              address.pincode
                            }
                          </p>

                        </div>


                        {/* DEFAULT BUTTON */}

                        {!address.isDefault && (

                          <button
                            type="button"
                            className="set-default-button"
                            onClick={() =>
                              handleSetDefault(
                                address._id
                              )
                            }
                          >

                            <Star
                              size={15}
                            />

                            Set as Default

                          </button>

                        )}

                      </article>

                    )
                  )}

                </div>

              )}

            </div>

          </section>


          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <aside className="profile-actions">


            {/* MY ORDERS */}

            <Link
              to="/orders"
              className="profile-action profile-outline-action"
            >

              <Package size={19} />

              <span>
                My Orders
              </span>

            </Link>


            {/* CONTINUE SHOPPING */}

            <Link
              to="/"
              className="profile-action profile-outline-action"
            >

              <ShoppingBag size={19} />

              <span>
                Continue Shopping
              </span>

            </Link>


            {/* VIEW CART */}

            <Link
              to="/cart"
              className="profile-action profile-outline-action"
            >

              <ShoppingCart size={19} />

              <span>
                View Cart
              </span>

            </Link>


            {/* LOGOUT */}

            <button
              type="button"
              className="profile-logout"
              onClick={
                handleLogout
              }
            >

              <LogOut size={19} />

              <span>
                Logout
              </span>

            </button>

          </aside>

        </div>

      </div>


      {/* =====================================================
          EDIT PROFILE MODAL
      ===================================================== */}

      {editOpen && (

        <div
          className="profile-modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseEdit();
            }

          }}
        >

          <div className="profile-modal">


            <div className="profile-modal-header">

              <div>

                <span>
                  ACCOUNT SETTINGS
                </span>

                <h2>
                  Edit Profile
                </h2>

              </div>


              <button
                type="button"
                className="profile-modal-close"
                onClick={
                  handleCloseEdit
                }
                disabled={
                  savingProfile
                }
              >
                <X size={19} />
              </button>

            </div>


            <form
              onSubmit={
                handleUpdateProfile
              }
              className="profile-edit-form"
            >

              <label>
                Full Name

                <div className="profile-input-wrapper">

                  <User size={16} />

                  <input
                    type="text"
                    name="name"
                    value={
                      editForm.name
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="Enter your name"
                    required
                  />

                </div>
              </label>


              <label>
                Email Address

                <div className="profile-input-wrapper">

                  <Mail size={16} />

                  <input
                    type="email"
                    name="email"
                    value={
                      editForm.email
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="Enter your email"
                    required
                  />

                </div>
              </label>


              <label>
                Mobile Number

                <div className="profile-input-wrapper">

                  <Phone size={16} />

                  <input
                    type="tel"
                    name="phone"
                    value={
                      editForm.phone
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="Enter mobile number"
                    maxLength="15"
                  />

                </div>
              </label>


              {profileError && (

                <div className="profile-form-error">
                  {profileError}
                </div>

              )}


              {profileMessage && (

                <div className="profile-form-success">
                  {profileMessage}
                </div>

              )}


              <div className="profile-modal-actions">

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={
                    handleCloseEdit
                  }
                  disabled={
                    savingProfile
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={
                    savingProfile
                  }
                >

                  {savingProfile ? (

                    <>
                      <LoaderCircle
                        size={16}
                        className="profile-loader"
                      />

                      Saving...
                    </>

                  ) : (

                    <>
                      <Save size={16} />

                      Save Changes
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
          ADD / EDIT ADDRESS MODAL
      ===================================================== */}

      {addressOpen && (

        <div
          className="profile-modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseAddress();
            }

          }}
        >

          <div className="profile-modal address-modal">


            {/* HEADER */}

            <div className="profile-modal-header">

              <div>

                <span>
                  DELIVERY ADDRESS
                </span>

                <h2>
                  {editingAddressId
                    ? "Edit Address"
                    : "Add Address"}
                </h2>

              </div>


              <button
                type="button"
                className="profile-modal-close"
                onClick={
                  handleCloseAddress
                }
                disabled={
                  savingAddress
                }
              >
                <X size={19} />
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleSaveAddress
              }
              className="profile-edit-form"
            >


              {/* LABEL */}

              <label>
                Address Type

                <select
                  name="label"
                  value={
                    addressForm.label
                  }
                  onChange={
                    handleAddressChange
                  }
                >
                  <option value="Home">
                    Home
                  </option>

                  <option value="Work">
                    Work
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </label>


              {/* NAME */}

              <label>
                Full Name

                <div className="profile-input-wrapper">

                  <User size={16} />

                  <input
                    type="text"
                    name="name"
                    value={
                      addressForm.name
                    }
                    onChange={
                      handleAddressChange
                    }
                    placeholder="Full name"
                    required
                  />

                </div>
              </label>


              {/* PHONE */}

              <label>
                Mobile Number

                <div className="profile-input-wrapper">

                  <Phone size={16} />

                  <input
                    type="tel"
                    name="phone"
                    value={
                      addressForm.phone
                    }
                    onChange={
                      handleAddressChange
                    }
                    placeholder="Mobile number"
                    maxLength="15"
                    required
                  />

                </div>
              </label>


              {/* ADDRESS */}

              <label>
                Address

                <div className="profile-input-wrapper">

                  <MapPin size={16} />

                  <textarea
                    name="address"
                    value={
                      addressForm.address
                    }
                    onChange={
                      handleAddressChange
                    }
                    placeholder="House no, street, area"
                    rows="3"
                    required
                  />

                </div>
              </label>


              {/* CITY + STATE */}

              <div className="address-form-grid">

                <label>
                  City

                  <input
                    type="text"
                    name="city"
                    value={
                      addressForm.city
                    }
                    onChange={
                      handleAddressChange
                    }
                    placeholder="City"
                    required
                  />
                </label>


                <label>
                  State

                  <input
                    type="text"
                    name="state"
                    value={
                      addressForm.state
                    }
                    onChange={
                      handleAddressChange
                    }
                    placeholder="State"
                    required
                  />
                </label>

              </div>


              {/* PINCODE */}

              <label>
                Pincode

                <input
                  type="text"
                  name="pincode"
                  value={
                    addressForm.pincode
                  }
                  onChange={
                    handleAddressChange
                  }
                  placeholder="6-digit pincode"
                  maxLength="6"
                  required
                />

              </label>


              {/* ERROR */}

              {addressError && (

                <div className="profile-form-error">
                  {addressError}
                </div>

              )}


              {/* SUCCESS */}

              {addressMessage && (

                <div className="profile-form-success">
                  {addressMessage}
                </div>

              )}


              {/* ACTIONS */}

              <div className="profile-modal-actions">

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={
                    handleCloseAddress
                  }
                  disabled={
                    savingAddress
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={
                    savingAddress
                  }
                >

                  {savingAddress ? (

                    <>
                      <LoaderCircle
                        size={16}
                        className="profile-loader"
                      />

                      Saving...
                    </>

                  ) : (

                    <>
                      <Save size={16} />

                      {editingAddressId
                        ? "Update Address"
                        : "Save Address"}
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}


export default Profile;