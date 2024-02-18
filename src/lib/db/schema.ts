import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').notNull().primaryKey().default(`gen_random_uuid()`),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const categories = pgTable('categories', {
	id: text('id').notNull().primaryKey().default(`gen_random_uuid()`),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const bookmarks = pgTable('bookmarks', {
	id: text('id').notNull().primaryKey().default(`gen_random_uuid()`),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	categoryId: text('category_id')
		.notNull()
		.references(() => categories.id),
	url: text('url').notNull(),
	title: text('title').notNull(),
	iconUrl: text('icon_url').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
