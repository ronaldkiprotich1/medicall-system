import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const email = `user_${uuidv4()}@test.com`;
  const password = 'password123';

  // Register
  const registerRes = http.post('http://localhost:8081/api/auth/register', JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    email,
    password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerRes, {
    'register status is 201': (r) => r.status === 201,
  });

  sleep(1);

  // Login
  const loginRes = http.post('http://localhost:8081/api/auth/login', JSON.stringify({
    email,
    password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'received token': (r) => !!r.json('token'),
  });

  sleep(1);
}
