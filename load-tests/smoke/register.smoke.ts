import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '5s',
};

export default function () {
  const payload = JSON.stringify({
    firstName: 'Smoke',
    lastName: 'Test',
    email: `smoketest_${Date.now()}@test.com`,
    password: 'password123',
  });

  const res = http.post('http://localhost:8081/api/auth/register', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const json = res.json() as { userId?: number; user?: { userId?: number } };

  check(res, {
    'register status is 201': (r) => r.status === 201,
    'userId exists': () => !!json.userId || !!json.user?.userId,
  });

  sleep(1);
}
