import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '5s', target: 5 },
    { duration: '10s', target: 5 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:8081';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzUyODE4NDQwLCJleHAiOjE3NTI5MDQ4NDB9.HFigcaKxW6lbxoApSO4lv8v1vT77Lvpw6Ow6LeMyWbw'; // 🔐 Replace with your actual token

function randomString(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export default function () {
  const unique = randomString();

  const payload = JSON.stringify({
    name: `Dr. Test ${unique}`,
    email: `dr_${unique}@example.com`,
    specialization: 'Cardiology',
    phone: `07${Math.floor(10000000 + Math.random() * 90000000)}`
  });

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const res = http.post(`${BASE_URL}/doctors`, payload, headers);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
