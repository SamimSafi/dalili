import axios from 'axios';
import React, { useState } from 'react';
import { baseUrl } from '../Constaints/baseUrl';
import { Container, Form, Button, Alert } from 'react-bootstrap';

type Role = 'admin' | 'user';

type RegisterData = {
  email: string;
  password: string;
  roles: Role[];
};

type RegisterResponse = {
  message: string;
};

type ErrorResponse = {
  error: string;
};

export default function RegisterUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRolesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const role = event.target.value as Role;
    if (event.target.checked) {
      setRoles([...roles, role]);
    } else {
      setRoles(roles.filter((r) => r !== role));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: RegisterResponse = await axios.post(baseUrl + '/register', {
        email,
        password,
        roles,
      });
      console.log(response.message);
    } catch (err) {
      console.error(err);
      setErrorMessage('Error registering user');
    }
  };

  return (
    <Container>
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleEmailChange} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Roles:</Form.Label>
          <Form.Check
            type="checkbox"
            id="admin"
            label="Admin"
            value="admin"
            checked={roles.includes('admin')}
            onChange={handleRolesChange}
          />
          <Form.Check
            type="checkbox"
            id="user"
            label="User"
            value="user"
            checked={roles.includes('user')}
            onChange={handleRolesChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </Container>
  );
}