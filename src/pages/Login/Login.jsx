import React, { useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import AnimatedLogo from "../../components/AnimatedLogo/AnimatedLogo";
import { motion } from "framer-motion";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (form) => {
    try {
      setLoading(true);
      setError("");

      const response = await authService.login(form);

      // Dispatch login action to Redux store
      dispatch(login(response));
      toast.success("Đăng nhập thành công!");

      // Navigate based on user role
      const userRole = response.user?.role;
      switch (userRole) {
        case "nurse":
          navigate("/nurse");
          break;
        case "parent":
          navigate("/");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      // Handle different error types
      if (error.response?.status === 401) {
        setError("Số điện thoại hoặc mật khẩu không đúng.");
      } else if (error.response?.status === 404) {
        setError("Tài khoản không tồn tại.");
      } else if (error.response?.status >= 500) {
        setError("Lỗi máy chủ. Vui lòng thử lại sau.");
      } else {
        setError(
          "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.phone.trim() || !form.password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    handleLogin(form);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <motion.div 
        className="flex items-center justify-center absolute w-full h-full"
        // style={{ background: 'linear-gradient(135deg, #407ce2, #223a6a)' }}
        initial={{zIndex: 100, background: 'linear-gradient(135deg, #407ce2, #223a6a)' }}
        animate={{zIndex: 10, opacity: 0.9, background: 'linear-gradient(135deg, #407ce2, #223a6a)' }}
        transition={{ duration: 5, ease: "easeInOut", delay: 5 }}
      >
          <AnimatedLogo
            width={400}
            height={360}
            style={styles.animatedLogo}
          />
      </motion.div>

      <motion.div style={styles.container}
        initial={{ opacity: 0, scale: 0.8, zIndex: 100 }}
        animate={{ opacity: 1, scale: 1, zIndex: 100 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 5 }}
      >
        <div style={styles.formWrapper}>
          <h2 style={styles.title}>Đăng nhập tài khoản</h2>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <form style={styles.form} onSubmit={handleSubmit}>
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: error ? "#ff4d4f" : "#407CE2",
              }}
              pattern="[0-9]{9,12}"
              title="Vui lòng nhập số điện thoại hợp lệ (9-12 chữ số)"
              disabled={loading}
              required
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: error ? "#ff4d4f" : "#407CE2",
              }}
              disabled={loading}
              required
            />

            <label style={styles.showPasswordLabel}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={toggleShowPassword}
                disabled={loading}
              />{" "}
              Hiện mật khẩu
            </label>

            <button
              type="submit"
              style={{
                ...styles.loginButton,
                backgroundColor: loading ? "#ccc" : "#223A6A",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <p style={styles.registerRedirect}>
              Chưa có tài khoản?{" "}
              <Link to="/register" style={styles.registerLink}>
                Đăng ký ngay
              </Link>
            </p>
          </form>

          <p style={styles.orConnect}>hoặc đăng nhập với</p>
          <div style={styles.socialButtons}>
            <button
              style={{
                ...styles.socialButton,
                marginRight: 16,
                borderColor: "#407CE2",
                color: "#407CE2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              disabled={loading}
            >
              <FaGoogle size={18} /> Google
            </button>
            <button
              style={{
                ...styles.socialButton,
                borderColor: "#223A6A",
                color: "#223A6A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              disabled={loading}
            >
              <FaFacebookF size={18} /> Facebook
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  logoContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 5,
    opacity: 1,
  },
  animatedLogo: {
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
  },
  container: {
    padding: 70,
    width: 500,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#222",
    boxShadow: "0 8px 24px rgba(34, 58, 106, 0.1)",
    position: "relative",
  },
  formWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    color: "#223A6A",
    fontWeight: "700",
    fontSize: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  errorMessage: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
    border: "1px solid #ffcdd2",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    border: "1px solid #407CE2",
    fontSize: 14,
    outline: "none",
    color: "#222",
    transition: "border-color 0.3s ease",
  },
  showPasswordLabel: {
    fontSize: 14,
    color: "#223A6A",
    marginBottom: 24,
    userSelect: "none",
  },
  loginButton: {
    backgroundColor: "#223A6A",
    color: "#fff",
    fontWeight: "700",
    borderRadius: 24,
    padding: 12,
    border: "none",
    cursor: "pointer",
    marginBottom: 8,
    transition: "background-color 0.3s ease",
  },
  registerRedirect: {
    textAlign: "center",
    fontSize: 14,
    color: "#223A6A",
    marginTop: 8,
  },
  registerLink: {
    color: "#407CE2",
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer",
  },
  orConnect: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 13,
    color: "#223A6A",
  },
  socialButtons: {
    display: "flex",
    justifyContent: "center",
  },
  socialButton: {
    flex: 1,
    padding: 12,
    borderRadius: 24,
    border: "1px solid #eee",
    backgroundColor: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default Login;
