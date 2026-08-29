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

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
      submit: '',
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const next = {};

    if (!form.firstName.trim()) {
      next.firstName = 'Required';
    }

    if (!form.lastName.trim()) {
      next.lastName = 'Required';
    }

    if (!form.employeeId.trim()) {
      next.employeeId = 'Required';
    }

    if (!form.phone.trim()) {
      next.phone = 'Required';
    }

    if (!form.email.trim()) {
      next.email = 'Required';
    }

    if (!form.department) {
      next.department = 'Required';
    }

    if (!form.tempPassword.trim()) {
      next.tempPassword =
        'Enter the temporary password given by your company';
    }

    if (!form.agree) {
      next.agree = 'You must accept the Terms & Conditions';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    setErrors((prev) => ({
      ...prev,
      submit: '',
    }));

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
            email: form.email.trim(),
            password: form.tempPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Registration failed'
        );
      }

      navigate('/login');
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit:
          err.message || 'Unable to create account',
      }));
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

            <div className="form-grid">
              <div className="field">
                <label
                  className="field-label"
                  htmlFor="firstName"
                >
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
                  />
                </div>

                {errors.firstName && (
                  <span className="field-error">
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div className="field">
                <label
                  className="field-label"
                  htmlFor="lastName"
                >
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
                  />
                </div>

                {errors.lastName && (
                  <span className="field-error">
                    {errors.lastName}
                  </span>
                )}
              </div>

              <div className="field">
                <label
                  className="field-label"
                  htmlFor="employeeId"
                >
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
                    placeholder="EMP-001"
                    value={form.employeeId}
                    onChange={handleChange}
                  />
                </div>

                {errors.employeeId && (
                  <span className="field-error">
                    {errors.employeeId}
                  </span>
                )}
              </div>

              <div className="field">
                <label
                  className="field-label"
                  htmlFor="phone"
                >
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
                    placeholder="+94 77 123 4567"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                {errors.phone && (
                  <span className="field-error">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className="field field--span2">
                <label
                  className="field-label"
                  htmlFor="email"
                >
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
                  />
                </div>

                {errors.email && (
                  <span className="field-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="field">
                <label
                  className="field-label"
                  htmlFor="department"
                >
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
                <label
                  className="field-label"
                  htmlFor="experience"
                >
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
                <label
                  className="field-label"
                  htmlFor="tempPassword"
                >
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
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Enter the temporary password given by your company"
                    value={form.tempPassword}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="input-group__toggle"
                    onClick={() =>
                      setShowPassword(
                        (s) => !s
                      )
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
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
                  You'll be asked to set a new password
                  after your first login.
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

            {errors.submit && (
              <span className="field-error">
                {errors.submit}
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
