require('dotenv').config();

const BASE = process.env.BASE_URL || 'http://localhost:8000';

module.exports = {
  urls: {
    loginPage: `${BASE}/accounts/signin/`,
    dashboardPage: `${BASE}/calendar/calendar/view/`,
    // diğer adresler de aynı şekilde
  },
  credentials: {
    email: process.env.TEST_USERNAME,
    password: process.env.TEST_PASSWORD,
  },
};
