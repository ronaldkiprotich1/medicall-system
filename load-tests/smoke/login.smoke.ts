import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '5s',
};

export default function () {
  const res = http.post('http://localhost:8081/api/auth/login', JSON.stringify({
    email: 'linet.chebet@email.com',
    password: 'MyStrongPass123!',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'login status is 200': (r) => r.status === 200,
    'received token': (r) => !!r.json('token'),
    'received user object': (r) => !!r.json('user'),
  });

  sleep(1);
}
