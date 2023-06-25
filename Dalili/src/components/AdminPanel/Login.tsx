import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { baseUrl } from '../Constaints/baseUrl';
import '../AdminPanel/login.css';
type Role = 'admin' | 'user';
interface LoginProps {
  setIsLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
}
type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

type RolesResponse = {
  roles: Role[];
};

type ErrorResponse = {
  error: string;
};

export default function Login({ setIsLoggedIn }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userRoles, setUserRoles] = useState<Role[]>([]);

  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(baseUrl + '/login', { email, password });
      console.log(response.data.token); // log the response object
      localStorage.setItem('token', response.data.token);
      const rolesResponse: RolesResponse = await axios.get(baseUrl + '/roles', {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      });
      setUserRoles(rolesResponse.roles);
      setIsLoggedIn!(true);
      navigate('/');
    } catch (err) {
      console.error(err);
      console.log(err.response); // log the error response object
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <Container className="h-100">
        <Row className="align-items-center h-100">
          <Col className="col-6 order-2 order-md-1">
            <div className="login-form-container text-dark px-5 py-4">
              <div className="w-100">
                <div className="logo-container">
                  <img src="./logo.png" alt="Logo" />
                </div>
                {errorMessage && (
                  <Alert variant="danger" className="mt-3">
                    {errorMessage}
                  </Alert>
                )}
                <h2>Login</h2>
                <Form onSubmit={handleLogin}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mt-3">
                    Login
                  </Button>
                </Form>
              </div>
            </div>
          </Col>
          <Col md={{ span: 6, order: 1 }} className="p-0 order-1 order-md-2">
            <div className="bg-text">
              <h1>Welcome Back</h1>
              <p>Please enter your login details to access your account.</p>
            </div>
            <div className="curve"></div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
