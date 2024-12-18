import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const questionCategories = pgTable("question_categories", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
});

export const questions = pgTable("questions", {
    id: serial("id").primaryKey(),
    questionText: text("question_text").notNull(),
    categoryId: integer("category_id").references(() => questionCategories.id),
    answer: text("answer").notNull(), // Single answer field
});

export const questionCategoriesRelation = relations(questionCategories, ({ many }) => ({
    questions: many(questions),
}));

export const questionsRelation = relations(questions, ({ one }) => ({
    category: one(questionCategories, {
        fields: [questions.categoryId],
        references: [questionCategories.id],
    }),
}));
