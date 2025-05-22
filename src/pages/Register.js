import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { validatePassword } from '../utils/formatters';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  acceptTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

const Register = () => {
  const { registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  const handlePasswordChange = (password) => {
    const strength = validatePassword(password);
    setPasswordStrength(strength);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const { confirmPassword, acceptTerms, ...userData } = values;
      const success = await registerUser(userData);
      if (!success) {
        setFieldError('email', 'Registration failed. Please try again.');
      }
    } catch (error) {
      setFieldError('email', 'Registration failed. Please try again.');
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
              <h1>Create Account</h1>
              <p>Join thousands of traders on our secure platform</p>
            </div>

            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                acceptTerms: false,
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values }) => (
                <Form className="auth-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <Field
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage name="name" component="div" className="error-message" />
                  </div>

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
                        placeholder="Create a password"
                        onChange={(e) => {
                          handlePasswordChange(e.target.value);
                        }}
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
                    
                    {passwordStrength && values.password && (
                      <div className="password-strength">
                        <div className="strength-indicators">
                          <div className={`strength-indicator ${passwordStrength.minLength ? 'valid' : ''}`}>
                            <i className={`fas fa-${passwordStrength.minLength ? 'check' : 'times'}`}></i>
                            8+ characters
                          </div>
                          <div className={`strength-indicator ${passwordStrength.hasUpperCase ? 'valid' : ''}`}>
                            <i className={`fas fa-${passwordStrength.hasUpperCase ? 'check' : 'times'}`}></i>
                            Uppercase letter
                          </div>
                          <div className={`strength-indicator ${passwordStrength.hasLowerCase ? 'valid' : ''}`}>
                            <i className={`fas fa-${passwordStrength.hasLowerCase ? 'check' : 'times'}`}></i>
                            Lowercase letter
                          </div>
                          <div className={`strength-indicator ${passwordStrength.hasNumbers ? 'valid' : ''}`}>
                            <i className={`fas fa-${passwordStrength.hasNumbers ? 'check' : 'times'}`}></i>
                            Number
                          </div>
                          <div className={`strength-indicator ${passwordStrength.hasSpecialChar ? 'valid' : ''}`}>
                            <i className={`fas fa-${passwordStrength.hasSpecialChar ? 'check' : 'times'}`}></i>
                            Special character
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="password-input">
                      <Field
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`fas fa-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <Field type="checkbox" name="acceptTerms" />
                      <span className="checkmark"></span>
                      I agree to the{' '}
                      <Link to="/terms" className="terms-link">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="terms-link">
                        Privacy Policy
                      </Link>
                    </label>
                    <ErrorMessage name="acceptTerms" component="div" className="error-message" />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-small"></div>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
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
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="auth-info">
            <div className="info-content">
              <h2>Join Our Community</h2>
              <p>
                Start your cryptocurrency journey with our secure and user-friendly platform.
              </p>
              <div className="info-features">
                <div className="info-feature">
                  <i className="fas fa-lock"></i>
                  <span>Secure wallet storage</span>
                </div>
                <div className="info-feature">
                  <i className="fas fa-exchange-alt"></i>
                  <span>Easy crypto trading</span>
                </div>
                <div className="info-feature">
                  <i className="fas fa-mobile-alt"></i>
                  <span>Mobile-friendly interface</span>
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
          padding: 2rem 0;
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

        .password-strength {
          margin-top: 0.5rem;
        }

        .strength-indicators {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .strength-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--text-secondary);
        }

        .strength-indicator.valid {
          color: var(--success-color);
        }

        .strength-indicator i {
          width: 0.75rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .checkbox-label input {
          width: auto;
          margin: 0;
          margin-top: 0.25rem;
        }

        .terms-link {
          color: var(--primary-color);
          text-decoration: none;
        }

        .terms-link:hover {
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

export default Register;
