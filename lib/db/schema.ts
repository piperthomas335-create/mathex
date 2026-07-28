import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

/** 学生/用户表 */
export const students = pgTable("students", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  grade: text("grade").notNull().default("高三"),
  avatar: text("avatar"),
  targetScore: integer("target_score").default(130),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

/** 知识树节点：11 模块 / 最深 5 层 / 469 节点 */
export const knNodes = pgTable(
  "kn_nodes",
  {
    id: text("id").primaryKey(),
    parentId: text("parent_id"),
    moduleId: text("module_id").notNull(),
    name: text("name").notNull(),
    textbookRef: text("textbook_ref"),
    level: integer("level").notNull(),
    sort: integer("sort").notNull().default(0),
    nodeType: text("node_type").notNull().default("知识点"),
  },
  (t) => [index("kn_nodes_parent_idx").on(t.parentId)],
)

/** 课堂整理 */
export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  studentId: text("student_id"),
  date: text("date").notNull(),
  title: text("title").notNull(),
  outlineMd: text("outline_md"),
  progressMd: text("progress_md"),
  weaknessMd: text("weakness_md"),
  nextPlanMd: text("next_plan_md"),
  coverUrl: text("cover_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

/** 错题：四段式正文 */
export const errors = pgTable("errors", {
  id: text("id").primaryKey(),
  studentId: text("student_id"),
  title: text("title").notNull(),
  causeCode: text("cause_code").notNull(),
  difficulty: integer("difficulty").notNull().default(3),
  source: text("source"),
  lessonId: text("lesson_id"),
  statementMd: text("statement_md").notNull(),
  wrongMd: text("wrong_md"),
  correctMd: text("correct_md"),
  reflectionMd: text("reflection_md"),
  tags: text("tags").array().notNull().default([]),
  images: jsonb("images").notNull().default([]),
  status: text("status").notNull().default("active"),
  origin: text("origin").notNull().default("seed"),
  noteId: text("note_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

/** 错题 ↔ 知识点 多对多 */
export const errorNodes = pgTable(
  "error_nodes",
  {
    errorId: text("error_id").notNull(),
    nodeId: text("node_id").notNull(),
    isPrimary: boolean("is_primary").notNull().default(false),
    weight: integer("weight").notNull().default(1),
  },
  (t) => [
    primaryKey({ columns: [t.errorId, t.nodeId] }),
    index("error_nodes_node_idx").on(t.nodeId),
  ],
)

/** 阶梯复习记录 */
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    studentId: text("student_id"),
    errorId: text("error_id").notNull(),
    stage: integer("stage").notNull().default(1),
    dueDate: date("due_date").notNull(),
    doneAt: timestamp("done_at", { withTimezone: true }),
    result: text("result"),
    seconds: integer("seconds"),
    note: text("note"),
  },
  (t) => [index("reviews_due_idx").on(t.dueDate, t.doneAt)],
)

/** 访客上传的笔记（待审核队列） */
export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  studentId: text("student_id"),
  authorName: text("author_name").notNull(),
  authorNote: text("author_note"),
  kind: text("kind").notNull().default("mixed"),
  rawText: text("raw_text"),
  imageUrls: text("image_urls").array().notNull().default([]),
  lessonId: text("lesson_id"),
  aiDraft: jsonb("ai_draft"),
  status: text("status").notNull().default("pending"),
  reviewerNote: text("reviewer_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
})

/** AI 节点知识合成 */
export const syntheses = pgTable("syntheses", {
  id: serial("id").primaryKey(),
  nodeId: text("node_id").notNull(),
  title: text("title").notNull(),
  bodyMd: text("body_md").notNull(),
  sourceErrorIds: text("source_error_ids").array().notNull().default([]),
  model: text("model"),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
  editedByAdmin: boolean("edited_by_admin").notNull().default(false),
})

export type Student = typeof students.$inferSelect
export type KnNode = typeof knNodes.$inferSelect
export type Lesson = typeof lessons.$inferSelect
export type ErrorRow = typeof errors.$inferSelect
export type ErrorNode = typeof errorNodes.$inferSelect
export type Review = typeof reviews.$inferSelect
export type Note = typeof notes.$inferSelect
export type Synthesis = typeof syntheses.$inferSelect
