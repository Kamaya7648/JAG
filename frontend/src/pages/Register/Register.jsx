import { useState } from 'react';
import garageLogo from '../../assets/icons/garage-logo.svg';
import garageLogoNavy from '../../assets/icons/garage-logo-navy.svg';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Briefcase,
  Car,
  Zap,
  BarChart2,
  Camera,
} from 'lucide-react';
import regbg from '../../assets/images/regbg.jpg';
import './Register.css';

const DEPARTMENTS = [
  'General Services',
  'Body & Paint',
  'Electrical',
  'Diagnostics',
];

const EXPERIENCE_LEVELS = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5+ years',
];

const initialForm = {
  firstName: '',
  lastName: '',
  employeeId: '',
  phone: '',
  email: '',
  department: '',
  tempPassword: '',
  experience: '',
  agree: false,
};

const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const employeeIdRegex = /^\d{3,}$/;
const phoneRegex = /^\d{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    if (name === 'firstName') {
      if (!value.trim()) {
        error = 'First name is required';
      } else if (!nameRegex.test(value.trim())) {
        error = 'Enter a valid first name';
      }
    }

    if (name === 'lastName') {
      if (!value.trim()) {
        error = 'Last name is required';
      } else if (!nameRegex.test(value.trim())) {
        error = 'Enter a valid last name';
      }
    }

    if (name === 'employeeId') {
      if (!value.trim()) {
        error = 'Employee ID is required';
      } else if (!employeeIdRegex.test(value.trim())) {
        error = 'Use the format 001';
      }
    }

    if (name === 'phone') {
      if (!value.trim()) {
        error = 'Phone number is required';
      } else if (!phoneRegex.test(value.trim())) {
        error = 'Enter a valid 10-digit phone number';
      }
    }

    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email address is required';
      } else if (!emailRegex.test(value.trim())) {
        error = 'Enter a valid email, e.g. name@gmail.com';
      }
    }

    if (name === 'department') {
      if (!value) {
        error = 'Please select a department';
      }
    }

    if (name === 'tempPassword') {
      if (!value.trim()) {
        error = 'Temporary password is required';
      } else if (value.length < 8) {
        error = 'Password must be at least 8 characters';
      }
    }

    if (name === 'agree') {
      if (!value) {
        error = 'You must accept the Terms & Conditions';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === 'checkbox' ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      validateField(name, newValue);
    }

    setErrors((prev) => ({
      ...prev,
      submit: '',
    }));
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;

    validateField(
      name,
      type === 'checkbox' ? checked : value
    );
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const next = {};

    const fields = [
      'firstName',
      'lastName',
      'employeeId',
      'phone',
      'email',
      'department',
      'tempPassword',
    ];

    fields.forEach((field) => {
      let value = form[field];

      if (typeof value === 'string') {
        value = value.trim();
      }

      if (field === 'firstName') {
        if (!value) {
          next.firstName = 'First name is required';
        } else if (!nameRegex.test(value)) {
          next.firstName = 'Enter a valid first name';
        }
      }

      if (field === 'lastName') {
        if (!value) {
          next.lastName = 'Last name is required';
        } else if (!nameRegex.test(value)) {
          next.lastName = 'Enter a valid last name';
        }
      }

      if (field === 'employeeId') {
        if (!value) {
          next.employeeId = 'Employee ID is required';
        } else if (!employeeIdRegex.test(value)) {
          next.employeeId = 'Use the format EMP-001';
        }
      }

      if (field === 'phone') {
        if (!value) {
          next.phone = 'Phone number is required';
        } else if (!phoneRegex.test(value)) {
          next.phone = 'Enter a valid 10-digit phone number';
        }
      }

      if (field === 'email') {
        if (!value) {
          next.email = 'Email address is required';
        } else if (!emailRegex.test(value)) {
          next.email =
            'Enter a valid email, e.g. name@gmail.com';
        }
      }

      if (field === 'department') {
        if (!value) {
          next.department = 'Please select a department';
        }
      }

      if (field === 'tempPassword') {
        if (!value) {
          next.tempPassword =
            'Temporary password is required';
        } else if (value.length < 8) {
          next.tempPassword =
            'Password must be at least 8 characters';
        }
      }
    });

    if (!form.agree) {
      next.agree =
        'You must accept the Terms & Conditions';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validate();

    if (!isValid) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${form.firstName.trim()} ${form.lastName.trim()}`,
            employeeId: form.employeeId.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            department: form.department,
            experience: form.experience,
            password: form.tempPassword,
            profilePhoto: '',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          submit: data.message || 'Registration failed',
        });
        return;
      }

      navigate('/login');
    } catch {
      setErrors({
        submit:
          'Unable to connect to the server. Make sure the backend is running.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div
        className="auth-screen__bg"
        style={{ backgroundImage: `url(${regbg})` }}
      />

      <div className="auth-side">
        <div className="auth-side__brand">
          <img
            src={garageLogo}
            alt="JAG"
            className="auth-logo-img"
          />
        </div>

        <div className="auth-side__content">
          <h1>Join the JAG Team</h1>

          <p>
            Register as a Garage Supervisor to manage vehicles,
            assign mechanics, and monitor workshop progress.
          </p>
        </div>

        <div className="auth-side__features">
          <div className="feature">
            <Car size={20} />
            <span>Smart Vehicle Assignment</span>
          </div>

          <div className="feature">
            <Zap size={20} />
            <span>Live Workshop Updates</span>
          </div>

          <div className="feature">
            <BarChart2 size={20} />
            <span>Performance Reports</span>
          </div>
        </div>

        <p className="auth-side__footer">
          © 2026 JAG. All rights reserved.
        </p>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <img
              src={garageLogoNavy}
              alt="JAG"
              className="auth-logo-img auth-logo-img--center"
            />

            <h1 className="auth-form__title">
              Create Supervisor Account
            </h1>

            <p className="auth-form__subtitle">
              Fill in your details to get started
            </p>

            {errors.submit && (
              <div className="register-error">
                {errors.submit}
              </div>
            )}

            {Object.keys(errors).some(
              (key) => key !== 'submit' && errors[key]
            ) && (
              <div className="register-error">
                Please fix the errors below.
              </div>
            )}

            <div className="form-grid">
              <div className="field">
                <label className="field-label" htmlFor="firstName">
                  First Name
                </label>

                <div
                  className={`input-group ${
                    errors.firstName
                      ? 'input-group--error'
                      : ''
                  }`}
                >
                  <User
                    size={18}
                    className="input-group__icon"
                  />

                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                  />
                </div>

                {errors.firstName && (
                  <span className="field-error">
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div className="field">
                <label className="field-label" htmlFor="lastName">
                  Last Name
                </label>

                <div
                  className={`input-group ${
                    errors.lastName
                      ? 'input-group--error'
                      : ''
                  }`}
                >
                  <User
                    size={18}
                    className="input-group__icon"
                  />

                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    value={form.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                  />
                </div>

                {errors.lastName && (
                  <span className="field-error">
                    {errors.lastName}
                  </span>
                )}
              </div>

              <div className="field">
                <label className="field-label" htmlFor="employeeId">
                  Employee ID
                </label>

                <div
                  className={`input-group ${
                    errors.employeeId
                      ? 'input-group--error'
                      : ''
                  }`}
                >
                  <Briefcase
                    size={18}
                    className="input-group__icon"
                  />

                  <input
                    id="employeeId"
                    name="employeeId"
                    placeholder="001"
                    value={form.employeeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                  />
                </div>

                {errors.employeeId && (
                  <span className="field-error">
                    {errors.employeeId}
                  </span>
                )}
              </div>

              <div className="field">
                <label className="field-label" htmlFor="phone">
                  Phone Number
                </label>

                <div
                  className={`input-group ${
                    errors.phone
                      ? 'input-group--error'
                      : ''
                  }`}
                >
                  <Phone
                    size={18}
                    className="input-group__icon"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="+94 77 123 4567"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                  />
                </div>

                {errors.phone && (
                  <span className="field-error">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className="field field--span2">
                <label className="field-label" htmlFor="email">
                  Email Address
                </label>

                <div
                  className={`input-group ${
                    errors.email
                      ? 'input-group--error'
                      : ''
                  }`}
                >
                  <Mail
                    size={18}
                    className="input-group__icon"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="email"
                    disabled={submitting}
                  />
                </div>

                {errors.email && (
                  <span className="field-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="field">
                <label className="field-label" htmlFor="department">
                  Department
                </label>

                <div
                  className={`input-group ${
                    errors.department
                      ? 'input-group--error'
                      : ''
                  }`}
                >
                  <Briefcase
                    size={18}
                    className="input-group__icon"
                  />

                  <select
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                  >
                    <option value="">
                      Select department
                    </option>

                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.department && (
                  <span className="field-error">
                    {errors.department}
                  </span>
                )}
              </div>

              <div className="field">
                <label className="field-label" htmlFor="experience">
                  Years of Experience
                </label>

                <div className="input-group">
                  <BarChart2
                    size={18}
                    className="input-group__icon"
                  />

                  <select
                    id="experience"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="">
                      Select experience
                    </option>

                    {EXPERIENCE_LEVELS.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field field--span2">
                <label className="field-label" htmlFor="tempPassword">
                  Temporary Password
                </label>

                <div
                  className={`input-group ${
                    errors.tempPassword
                      ? 'input-group--error'
                      : ''
                  }`}
                >
                  <Lock
                    size={18}
                    className="input-group__icon"
                  />

                  <input
                    id="tempPassword"
                    name="tempPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter the temporary password given by your company"
                    value={form.tempPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                    disabled={submitting}
                  />

                  <button
                    type="button"
                    className="input-group__toggle"
                    onClick={() =>
                      setShowPassword((s) => !s)
                    }
                    disabled={submitting}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.tempPassword && (
                  <span className="field-error">
                    {errors.tempPassword}
                  </span>
                )}

                <span
                  style={{
                    fontSize: '12px',
                    color: '#8B93A3',
                    marginTop: '6px',
                  }}
                >
                  You'll be asked to set a new password after
                  your first login.
                </span>
              </div>

              <div className="field field--span2 photo-field">
                <label className="field-label">
                  Profile Photo
                </label>

                <div className="photo-picker">
                  <div className="photo-picker__preview">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                      />
                    ) : (
                      <User size={22} />
                    )}
                  </div>

                  <label className="btn btn--ghost btn--sm">
                    <Camera size={16} />
                    Upload Photo

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handlePhoto}
                      disabled={submitting}
                    />
                  </label>
                </div>
              </div>
            </div>

            <label className="checkbox checkbox--terms">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting}
              />

              <span>
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="link link--strong"
                >
                  Terms &amp; Conditions
                </Link>
              </span>
            </label>

            {errors.agree && (
              <span className="field-error">
                {errors.agree}
              </span>
            )}

            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting
                ? 'Creating account…'
                : 'Register'}
            </button>

            <p className="auth-form__switch">
              Already have an account?{' '}
              <Link
                to="/login"
                className="link link--strong"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;