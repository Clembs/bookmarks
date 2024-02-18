import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id')
		.notNull()
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	displayName: text('display_name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	categories: many(categories),
	bookmarks: many(bookmarks)
}));

export const sessions = pgTable('sessions', {
	id: text('id')
		.notNull()
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at').notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const categories = pgTable('categories', {
	id: text('id')
		.notNull()
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	user: one(users, {
		fields: [categories.userId],
		references: [users.id]
	}),
	bookmarks: many(bookmarks)
}));

export const bookmarks = pgTable('bookmarks', {
	id: text('id')
		.notNull()
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	categoryId: text('category_id').references(() => categories.id),
	url: text('url').notNull(),
	title: text('title').notNull(),
	iconUrl: text('icon_url').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id]
	}),
	category: one(categories, {
		fields: [bookmarks.categoryId],
		references: [categories.id]
	})
}));
