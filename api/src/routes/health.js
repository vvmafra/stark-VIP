import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      api: 'healthy',
      starknet: process.env.STARKNET_RPC_URL ? 'configured' : 'not configured'
    }
  };

  res.status(200).json(healthCheck);
});

export { router as healthRoute };