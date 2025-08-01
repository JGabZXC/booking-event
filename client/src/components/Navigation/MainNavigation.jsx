import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function MainNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  return (
    <header className="bg-slate-50/50 backdrop-blur-2xl sticky top-0 z-50 border-b border-slate-200">
      <nav>
        <DesktopMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          logo={logo}
          handleLogout={handleLogout}
          user={user}
        />

        {/* Mobile Menu */}
        <MobileMenu menuOpen={menuOpen} user={user} logout={handleLogout} />
      </nav>
    </header>
  );
}
