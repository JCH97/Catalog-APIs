import 'dotenv/config';
import { startGraphQLServer } from './presentation/graphql/server.js';

startGraphQLServer().catch((err) => {
  console.error(err);
  process.exit(1);
});