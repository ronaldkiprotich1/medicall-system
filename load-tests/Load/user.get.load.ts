import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },  
    { duration: '30s', target: 10 },  
    { duration: '10s', target: 0 },   
  ],
};

export default function () {
  const res = http.get('http://localhost:8081/users');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
