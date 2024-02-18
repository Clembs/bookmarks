import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.POSTGRES_URL) {
	throw new Error('POSTGRES_URL is not defined');
}

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.POSTGRES_URL
	},
	verbose: true,
	strict: true
});
