import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuration options
export const options = {
  vus: 50, 
  duration: '30s', 
};

export default function () {
  const res = http.get('http://localhost:8081/api/users'); 

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // simulate user wait time
}
