import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem("aicommerce-user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("aicommerce-token");
    localStorage.removeItem("aicommerce-user");

    setUser(null);
  };

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem(
        "aicommerce-token"
      );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Invalid session");
        }

        const data = await response.json();

        setUser(data.user);

        localStorage.setItem(
          "aicommerce-user",
          JSON.stringify(data.user)
        );
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}