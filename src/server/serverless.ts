import serverless from 'serverless-http';
import createApp from './app';

const app = createApp();
export const httpHandler = serverless(app, { provider: 'aws' });
