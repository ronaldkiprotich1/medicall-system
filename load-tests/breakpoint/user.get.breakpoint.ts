import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 10 },
    { duration: '5s', target: 50 },
    { duration: '5s', target: 100 },
    { duration: '5s', target: 200 },
    { duration: '5s', target: 300 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = 'http://localhost:8081';


const credentials = {
  email: 'linet.chebet@email.com',
  password: 'MyStrongPass123!',
};


export function setup(): { token: string } {
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify(credentials), {
    headers: { 'Content-Type': 'application/json' },
  });

  
  console.log('Login response body:', loginRes.body);

  check(loginRes, {
    'Login successful': (res) => res.status === 200 && res.json('token') !== '',
  });

  const token = loginRes.json('token');
  if (typeof token !== 'string') {
    throw new Error('Token was not returned or is not a valid string.');
  }

  return { token };
}

// Load test per VU
export default function (data: { token: string }) {
  const res = http.get(`${BASE_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
