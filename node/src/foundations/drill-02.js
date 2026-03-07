import 'dotenv/config';

console.log('API_KEY:', process.env.API_KEY);
console.log('PORT:', process.env.PORT);

const port = process.env.PORT || 5000;

console.log('Running on port:', port);

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const apiKey = requireEnv('API_KEY');
console.log('API Key loaded:', apiKey);
