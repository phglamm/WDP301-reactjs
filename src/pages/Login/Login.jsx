import React, { useState } from 'react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginUser } from '../../redux/features/userSlice';

const Login = () => {
  const [form, setForm] = useState({
    phone: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

 const dispatch = useDispatch();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const resultAction = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(resultAction)) {
      console.log('✅ Đăng nhập thành công:', resultAction.payload);
    } else {
      console.error('❌ Lỗi từ backend:', resultAction.payload);
      alert(`❌ Lỗi đăng nhập: ${resultAction.payload}`);
    }
  } catch (err) {
    console.error('🔥 Lỗi hệ thống:', err);
    alert('Lỗi hệ thống khi gửi yêu cầu.');
  }
};



  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Đăng nhập tài khoản</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
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
            placeholder="Mật khẩu"
            value={form.password}
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

          <button type="submit" style={styles.loginButton}>
            Đăng nhập
          </button>

          <p style={styles.registerRedirect}>
            Chưa có tài khoản?{' '}
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
    maxWidth: 400,
    margin: '60px auto',
    padding: 30,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#222',
    boxShadow: '0 8px 24px rgba(34, 58, 106, 0.1)',
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: '#223A6A',
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 24,
    textAlign: 'center',
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
  loginButton: {
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
  registerRedirect: {
    textAlign: 'center',
    fontSize: 14,
    color: '#223A6A',
    marginTop: 8,
  },
  registerLink: {
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

export default Login;
