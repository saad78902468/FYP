import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isForgotPassword) {
        const res = await axios.post('http://localhost:3005/auth/forgot-password', {
          email: formData.email,
        });
        alert('Reset email sent (if valid): ' + res.data.message);
      } else if (isLogin) {
        const res = await axios.post('http://localhost:3005/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        alert('Login successful');
        localStorage.setItem('FoodCustomerToken', res.data.token);
        navigate('/home');
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        const res = await axios.post('http://localhost:3005/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        alert('Registration successful');
        console.log(res.data);
      }
    } catch (error) {
      console.error(error);
      alert('Error: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-yellow-500 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black">
          {isForgotPassword
            ? 'Forgot Password'
            : isLogin
              ? 'Login'
              : 'Register'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && !isForgotPassword && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>

          {!isForgotPassword && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-black text-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none"
          >
            {isForgotPassword
              ? 'Send Reset Link'
              : isLogin
                ? 'Login'
                : 'Register'}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative text-center">
            <hr className="border-t border-black mb-4" />
            <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-yellow-500 px-2 text-sm text-black">
              or
            </span>
          </div>

          <button
            type="button"
            className="flex items-center justify-center w-full py-2 bg-white text-black border border-black rounded-md hover:bg-gray-100 transition duration-200"
            onClick={() => alert('Google Sign-In coming soon!')} // Replace with actual logic later
          >
            <i className="fab fa-google mr-2 text-red-500"></i>
            Sign in with Google
          </button>
        </div>


        <div className="text-center mt-4 space-y-2">
          <button onClick={toggleForm} className="text-sm text-black hover:underline block w-full">
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
          {isLogin && (
            <button onClick={toggleForgotPassword} className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;