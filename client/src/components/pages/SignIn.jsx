import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isEmailValid = (email, role) => {
    if (role === 'student') {
      const studentRegex = /^22wh1a12(\d{2})@[\w.-]+$/i;
      const match = email.match(studentRegex);
      const number = match ? parseInt(match[1]) : null;
      return match && number >= 1 && number <= 65;
    } else if (role === 'faculty') {
      const facultyRegex = /^[a-zA-Z]+@[\w.-]+$/;
      return facultyRegex.test(email);
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password fields.');
      return;
    }

    if (!isEmailValid(email, role)) {
      setError(
        role === 'student'
          ? 'Invalid student email. Use 22wh1a12XX@domain format where XX is between 01 and 65.'
          : 'Faculty email must contain only letters before @.'
      );
      return;
    }

    if (password !== '123456') {
      setError('Invalid password. Please use the correct password.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signin', {
        email,
        password,
        role,
      });

      localStorage.setItem('token', response.data.token);
      navigate(role === 'student' ? '/StudentDashboard' : '/FacultyDashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const theme = darkTheme;

  return (
    <div style={{ ...styles.wrapper, backgroundColor: theme.background, color: theme.textColor }}>
      <div style={styles.titleBar}>
        <h1 style={styles.title}>Novusphere</h1>
      </div>
      <div style={{ ...styles.card, backgroundColor: theme.cardBg, color: theme.textColor }}>
        <h2 style={styles.heading}>Sign In</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
          <button type="submit" style={styles.button}>Sign In</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    padding: '2rem',
    transition: 'background 0.3s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBar: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#58a6ff',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(27,31,35,0.1)',
    border: '1px solid #30363d',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  error: {
    color: '#f85149',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '1rem',
    fontSize: '14px',
    border: '1px solid #30363d',
    borderRadius: '6px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2da44e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

const darkTheme = {
  background: '#0d1117',
  cardBg: '#161b22',
  inputBg: '#0d1117',
  textColor: '#c9d1d9',
};

export default SignIn;
