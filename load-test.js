import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Test scenarios
  scenarios: {
    // Warm up with few users
    warm_up: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '1m', target: 10 },
      ],
    },
    // Load test
    load_test: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '2m', target: 50 },  // Ramp up
        { duration: '5m', target: 50 },  // Stay at peak
        { duration: '2m', target: 0 },   // Ramp down
      ],
    },
  },
  // Test thresholds
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.05'],    // Less than 5% of requests should fail
  },
};

export default function() {
  // Define your API endpoints
  const BASE_URL = 'https://spotlight-strategic-solutions.vercel.app';
  
  // Make HTTP requests
  const responses = {
    home: http.get(`${BASE_URL}/dashboard`),
    products: http.get(`${BASE_URL}/api/`),
    login: http.post(`${BASE_URL}/api/auth/login`, {
      username: 'testuser',
      password: 'testpass',
    }),
  };

  // Check responses
  check(responses.home, {
    'homepage status is 200': (r) => r.status === 200,  
    'homepage loads fast': (r) => r.timings.duration < 1000,
  });

  check(responses.products, {
    'products status is 200': (r) => r.status === 200,
    'products return valid data': (r) => r.body.indexOf('products') !== -1,
  });

  check(responses.login, {
    'login successful': (r) => r.status === 200,
    'login response has token': (r) => r.json('token') !== undefined,
  });

  // Wait between iterations
  sleep(1);
}