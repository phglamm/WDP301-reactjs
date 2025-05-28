import React, { useState } from 'react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng ký
    console.log('Dữ liệu form:', form);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <h2 style={styles.title}>Theo dõi sự phát triển của con bạn</h2>
        <p style={styles.subtitle}>Dịch vụ chăm sóc sức khỏe tốt nhất.</p>
        <div style={styles.illustration}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2917/2917242.png"
            alt="Minh họa sức khỏe trẻ em"
            style={{ width: '100%', maxWidth: 280, filter: 'none', opacity: 1 }}
          />
        </div>
        <p style={styles.footerText}>Truy cập hồ sơ sức khỏe mọi lúc, mọi nơi.</p>
      </div>

      <div style={styles.rightPanel}>
        <h3 style={styles.getStarted}>Bắt đầu miễn phí ngay</h3>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Họ và tên của trẻ"
            value={form.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập độc nhất cho trẻ"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email của bạn"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            style={styles.input}
            pattern="[0-9]{9,12}"
            title="Vui lòng nhập số điện thoại hợp lệ (9-12 chữ số)"
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Tạo mật khẩu an toàn"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu để xác nhận"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.showPasswordLabel}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={toggleShowPassword}
            />{' '}
            Hiện mật khẩu
          </label>

          <button type="submit" style={styles.signUpButton}>
            Đăng ký
          </button>

          <p style={styles.loginRedirect}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={styles.loginLink}>
              Đăng nhập ngay
            </Link>
          </p>
        </form>

        <p style={styles.orConnect}>hoặc kết nối với</p>

        <div style={styles.socialButtons}>
          <button
            style={{
              ...styles.socialButton,
              marginRight: 16,
              borderColor: '#407CE2',
              color: '#407CE2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <FaGoogle size={18} /> Google
          </button>
          <button
            style={{
              ...styles.socialButton,
              borderColor: '#223A6A',
              color: '#223A6A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <FaFacebookF size={18} /> Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    maxWidth: 900,
    margin: '40px auto',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 40,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#222',
  },
  leftPanel: {
    flex: 1,
    paddingRight: 40,
    borderRight: '1px solid #ddd',
    textAlign: 'center',
  },
  title: {
    color: '#223A6A',
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 8,
  },
  subtitle: {
    color: '#407CE2',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 40,
  },
  illustration: {
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#223A6A',
  },
  rightPanel: {
    flex: 1,
    paddingLeft: 40,
  },
  getStarted: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 30,
    color: '#223A6A',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    border: '1px solid #407CE2',
    fontSize: 14,
    outline: 'none',
    color: '#222',
  },
  showPasswordLabel: {
    fontSize: 14,
    color: '#223A6A',
    marginBottom: 24,
    userSelect: 'none',
  },
  signUpButton: {
    backgroundColor: '#223A6A',
    color: '#fff',
    fontWeight: '700',
    borderRadius: 24,
    padding: 12,
    border: 'none',
    cursor: 'pointer',
    marginBottom: 8,
    transition: 'background-color 0.3s ease',
  },
  loginRedirect: {
    textAlign: 'center',
    fontSize: 14,
    color: '#223A6A',
    marginTop: 8,
  },
  loginLink: {
    color: '#407CE2',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  orConnect: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 13,
    color: '#223A6A',
  },
  socialButtons: {
    display: 'flex',
    justifyContent: 'center',
  },
  socialButton: {
    flex: 1,
    padding: 12,
    borderRadius: 24,
    border: '1px solid #eee',
    backgroundColor: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default Register;
