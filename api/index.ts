import 'reflect-metadata';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import app from '../src/app';
import { connectDatabase } from '../src/database/sequelize/connection';

let isConnected = false;

export default async function handler(req: any, res: any) {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (e) {
      console.error('Lambda DB Connection error:', e);
    }
  }
  return app(req, res);
}
