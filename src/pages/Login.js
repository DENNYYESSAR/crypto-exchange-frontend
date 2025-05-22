import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const success = await loginUser(values);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setFieldError('email', 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your account to continue trading</p>
            </div>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="auth-form">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input">
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="form-control"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="error-message" />
                  </div>

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="forgot-link">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-small"></div>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="social-login">
              <button className="btn btn-outline btn-full social-btn">
                <i className="fab fa-google"></i>
                Continue with Google
              </button>
              <button className="btn btn-outline btn-full social-btn">
                <i className="fab fa-github"></i>
                Continue with GitHub
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="auth-info">
            <div className="info-content">
              <h2>Start Trading Today</h2>
              <p>
                Join thousands of traders who trust our platform for secure and 
                reliable cryptocurrency trading.
              </p>
              <div className="info-features">
                <div className="info-feature">
                  <i className="fas fa-shield-alt"></i>
                  <span>Bank-level security</span>
                </div>
                <div className="info-feature">
                  <i className="fas fa-chart-line"></i>
                  <span>Real-time trading</span>
                </div>
                <div className="info-feature">
                  <i className="fas fa-headset"></i>
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .auth-card {
          background-color: var(--bg-card);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: var(--text-secondary);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: -0.5rem 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .checkbox-label input {
          width: auto;
          margin: 0;
        }

        .forgot-link {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.9rem;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .btn-full {
          width: 100%;
          justify-content: center;
        }

        .spinner-small {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        .auth-divider {
          text-align: center;
          margin: 1.5rem 0;
          position: relative;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: var(--border-color);
        }

        .auth-divider span {
          background-color: var(--bg-card);
          padding: 0 1rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .social-login {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .auth-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        .auth-info {
          display: none;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          color: white;
        }

        @media (min-width: 1024px) {
          .auth-info {
            display: block;
          }
        }

        .info-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .info-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .info-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .info-feature i {
          width: 1.5rem;
          text-align: center;
          color: var(--secondary-color);
        }
      `}</style>
    </div>
  );
};

export default Login;
