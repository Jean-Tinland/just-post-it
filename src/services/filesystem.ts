import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { PostItItem } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";

const CONTENTS_DIR = path.join(process.cwd(), "contents");
const CATEGORIES_FILE = path.join(CONTENTS_DIR, "categories.json");

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 100000;
const MIN_WIDTH = 240;
const MIN_HEIGHT = 180;
const MAX_WIDTH = 2400;
const MAX_HEIGHT = 2400;
const MAX_CATEGORY_NAME_LENGTH = 80;
const MAX_CATEGORY_COLOR_LENGTH = 80;
const MAX_CATEGORY_POSITION = 10000;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function parsePositiveInt(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function normalizePercent(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return clamp(value, 0, 100);
}

function normalizeBoundsSize(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return clamp(Math.round(value), min, max);
}

function normalizeCategoryId(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return parsePositiveInt(value);
}

function normalizeDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

async function ensureContentsDir() {
  try {
    await fs.access(CONTENTS_DIR);
  } catch {
    await fs.mkdir(CONTENTS_DIR, { recursive: true });
  }
}

export async function getAllPostIts(): Promise<PostItItem[]> {
  await ensureContentsDir();

  try {
    const files = await fs.readdir(CONTENTS_DIR);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    const categories = await getAllCategories();
    const categoryMap = categories.reduce(
      (acc, cat) => {
        acc[cat.id] = cat;
        return acc;
      },
      {} as Record<number, CategoryItem>,
    );

    const existingIds = new Set<number>();
    const fileIdMap = new Map<string, number>();

    for (const file of mdFiles) {
      const fileName = path.basename(file, ".md");
      const fileNameId = parseInt(fileName, 10);

      if (!isNaN(fileNameId) && fileNameId > 0) {
        existingIds.add(fileNameId);
        fileIdMap.set(file, fileNameId);
      }

      try {
        const filePath = path.join(CONTENTS_DIR, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data } = matter(fileContent);
        if (data.id && typeof data.id === "number") {
          existingIds.add(data.id);
        }
      } catch {
        console.error(`Failed to read or parse ${file}`);
      }
    }

    const postIts = await Promise.all(
      mdFiles.map(async (file) => {
        const filePath = path.join(CONTENTS_DIR, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        let postItId = data.id;
        const fileName = path.basename(file, ".md");
        const fileNameId = parseInt(fileName, 10);
        let needsUpdate = false;

        if (!postItId || typeof postItId !== "number") {
          if (
            !isNaN(fileNameId) &&
            fileNameId > 0 &&
            fileIdMap.get(file) === fileNameId
          ) {
            postItId = fileNameId;
          } else {
            let newId = existingIds.size > 0 ? Math.max(...existingIds) + 1 : 1;
            while (existingIds.has(newId)) {
              newId++;
            }
            postItId = newId;
            existingIds.add(newId);
          }
          data.id = postItId;
          needsUpdate = true;
        }

        if (!data.title) {
          data.title = "New idea";
          needsUpdate = true;
        }
        if (data.dueDate === undefined) {
          data.dueDate = null;
          needsUpdate = true;
        }
        if (typeof data.topPosition !== "number") {
          data.topPosition = 10;
          needsUpdate = true;
        }
        if (typeof data.leftPosition !== "number") {
          data.leftPosition = 10;
          needsUpdate = true;
        }
        if (typeof data.width !== "number") {
          data.width = 380;
          needsUpdate = true;
        }
        if (typeof data.height !== "number") {
          data.height = 240;
          needsUpdate = true;
        }
        if (data.categoryId === undefined) {
          data.categoryId = null;
          needsUpdate = true;
        }
        if (!data.lastUpdated) {
          data.lastUpdated = new Date().toISOString();
          needsUpdate = true;
        }
        if (typeof data.minimized !== "number") {
          data.minimized = 0;
          needsUpdate = true;
        }

        if (needsUpdate) {
          const updatedContent = matter.stringify(content, data);
          await fs.writeFile(filePath, updatedContent, "utf-8");
        }

        if (fileNameId !== postItId) {
          const newFilePath = path.join(CONTENTS_DIR, `${postItId}.md`);
          try {
            await fs.rename(filePath, newFilePath);
          } catch (error) {
            console.error(
              `Failed to rename ${filePath} to ${newFilePath}:`,
              error,
            );
          }
        }

        const category = data.categoryId ? categoryMap[data.categoryId] : null;

        return {
          id: postItId,
          title: data.title || "New idea",
          content: content.trim(),
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          bounds: {
            top: data.topPosition || 10,
            left: data.leftPosition || 10,
            width: data.width || 380,
            height: data.height || 240,
          },
          categoryId: data.categoryId || null,
          lastUpdated: new Date(data.lastUpdated || Date.now()),
          minimized: data.minimized || 0,
          categoryName: category?.name || "",
          categoryColor: category?.color || "",
        } as PostItItem;
      }),
    );

    const validPostIts = postIts.filter((p): p is PostItItem => p !== null);

    return validPostIts.sort(
      (a, b) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
    );
  } catch {
    return [];
  }
}

export async function getPostIt(id: number): Promise<PostItItem | null> {
  const postIts = await getAllPostIts();
  return postIts.find((p) => p.id === id) || null;
}

export async function createPostIt(
  categoryId: number | null,
  top: number = 10,
  left: number = 10,
): Promise<number> {
  await ensureContentsDir();

  const postIts = await getAllPostIts();
  const newId =
    postIts.length > 0 ? Math.max(...postIts.map((p) => p.id)) + 1 : 1;

  const safeCategoryId = normalizeCategoryId(categoryId);
  const safeTop = normalizePercent(top, 10);
  const safeLeft = normalizePercent(left, 10);

  const frontMatter = {
    id: newId,
    title: "New idea",
    dueDate: null,
    topPosition: safeTop,
    leftPosition: safeLeft,
    width: 380,
    height: 240,
    categoryId: safeCategoryId,
    lastUpdated: new Date().toISOString(),
    minimized: 0,
  };

  const fileContent = matter.stringify("", frontMatter);
  const filePath = path.join(CONTENTS_DIR, `${newId}.md`);

  await fs.writeFile(filePath, fileContent, "utf-8");

  return newId;
}

export async function updatePostIt(
  id: number,
  updates: Partial<
    Omit<PostItItem, "bounds"> & { bounds?: Partial<PostItItem["bounds"]> }
  >,
): Promise<void> {
  const safeId = parsePositiveInt(id);
  if (!safeId) {
    throw new Error("Invalid post-it ID");
  }

  if (
    updates.content !== undefined &&
    typeof updates.content === "string" &&
    updates.content.length > MAX_CONTENT_LENGTH
  ) {
    throw new Error("Post-it content is too large");
  }

  const filePath = path.join(CONTENTS_DIR, `${safeId}.md`);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const updatedData: Record<string, unknown> = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };

    if (updates.title !== undefined) {
      if (typeof updates.title !== "string") {
        throw new Error("Invalid post-it title");
      }

      updatedData.title = updates.title.slice(0, MAX_TITLE_LENGTH);
    }

    if (updates.dueDate !== undefined) {
      updatedData.dueDate =
        normalizeDate(updates.dueDate)?.toISOString() || null;
    }

    if (updates.categoryId !== undefined) {
      const normalizedCategoryId = normalizeCategoryId(updates.categoryId);

      if (updates.categoryId !== null && normalizedCategoryId === null) {
        throw new Error("Invalid post-it category ID");
      }

      updatedData.categoryId = normalizedCategoryId;
    }

    if (updates.minimized !== undefined) {
      if (updates.minimized !== 0 && updates.minimized !== 1) {
        throw new Error("Invalid minimized state");
      }

      updatedData.minimized = updates.minimized;
    }

    if (updates.bounds) {
      if (updates.bounds.top !== undefined)
        updatedData.topPosition = normalizePercent(updates.bounds.top, 10);
      if (updates.bounds.left !== undefined)
        updatedData.leftPosition = normalizePercent(updates.bounds.left, 10);
      if (updates.bounds.width !== undefined)
        updatedData.width = normalizeBoundsSize(
          updates.bounds.width,
          380,
          MIN_WIDTH,
          MAX_WIDTH,
        );
      if (updates.bounds.height !== undefined)
        updatedData.height = normalizeBoundsSize(
          updates.bounds.height,
          240,
          MIN_HEIGHT,
          MAX_HEIGHT,
        );
    }

    const newContent =
      updates.content !== undefined ? updates.content : content;
    if (newContent.length > MAX_CONTENT_LENGTH) {
      throw new Error("Post-it content is too large");
    }

    const updatedFileContent = matter.stringify(newContent, updatedData);

    await fs.writeFile(filePath, updatedFileContent, "utf-8");
  } catch (error) {
    throw new Error(`Failed to update post-it ${id}: ${error}`);
  }
}

export async function deletePostIt(id: number): Promise<void> {
  const safeId = parsePositiveInt(id);
  if (!safeId) {
    throw new Error("Invalid post-it ID");
  }

  const filePath = path.join(CONTENTS_DIR, `${safeId}.md`);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    throw new Error(`Failed to delete post-it ${id}: ${error}`);
  }
}

// Category operations
export async function getAllCategories(): Promise<CategoryItem[]> {
  await ensureContentsDir();

  try {
    const fileContent = await fs.readFile(CATEGORIES_FILE, "utf-8");
    const parsed = JSON.parse(fileContent) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const sortedCategories: CategoryItem[] = parsed
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const category = item as Partial<CategoryItem>;
        const id = parsePositiveInt(category.id);
        const position = parsePositiveInt(category.position);
        const name =
          typeof category.name === "string"
            ? category.name.trim().slice(0, MAX_CATEGORY_NAME_LENGTH)
            : "";
        const color =
          typeof category.color === "string"
            ? category.color.trim().slice(0, MAX_CATEGORY_COLOR_LENGTH)
            : "";

        if (!id || !position || !name || !color) {
          return null;
        }

        return {
          id,
          name,
          color,
          position: clamp(position, 1, MAX_CATEGORY_POSITION),
        } satisfies CategoryItem;
      })
      .filter((category): category is CategoryItem => Boolean(category))
      .sort((a, b) => a.position - b.position);

    return sortedCategories;
  } catch {
    return [];
  }
}

export async function createCategory(position: number): Promise<number> {
  await ensureContentsDir();

  const categories = await getAllCategories();
  const newId =
    categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
  const fallbackPosition =
    categories.reduce((max, category) => Math.max(max, category.position), 0) +
    1;
  const safePosition = parsePositiveInt(position) ?? fallbackPosition;

  const newCategory: CategoryItem = {
    id: newId,
    name: "New category",
    color: "red",
    position: clamp(safePosition, 1, MAX_CATEGORY_POSITION),
  };

  categories.push(newCategory);
  await fs.writeFile(
    CATEGORIES_FILE,
    JSON.stringify(categories, null, 2),
    "utf-8",
  );

  return newId;
}

export async function updateCategory(
  id: number,
  updates: Partial<Omit<CategoryItem, "id">>,
): Promise<void> {
  const safeId = parsePositiveInt(id);
  if (!safeId) {
    throw new Error("Invalid category ID");
  }

  const categories = await getAllCategories();
  const categoryIndex = categories.findIndex((c) => c.id === safeId);

  if (categoryIndex === -1) {
    throw new Error(`Category ${safeId} not found`);
  }

  const normalizedUpdates: Partial<Omit<CategoryItem, "id">> = {};

  if (updates.name !== undefined) {
    if (typeof updates.name !== "string") {
      throw new Error("Invalid category name");
    }

    const safeName = updates.name.trim().slice(0, MAX_CATEGORY_NAME_LENGTH);
    if (!safeName) {
      throw new Error("Invalid category name");
    }

    normalizedUpdates.name = safeName;
  }

  if (updates.color !== undefined) {
    if (typeof updates.color !== "string") {
      throw new Error("Invalid category color");
    }

    const safeColor = updates.color.trim().slice(0, MAX_CATEGORY_COLOR_LENGTH);
    if (!safeColor) {
      throw new Error("Invalid category color");
    }

    normalizedUpdates.color = safeColor;
  }

  if (updates.position !== undefined) {
    const safePosition = parsePositiveInt(updates.position);
    if (!safePosition) {
      throw new Error("Invalid category position");
    }

    normalizedUpdates.position = clamp(safePosition, 1, MAX_CATEGORY_POSITION);
  }

  categories[categoryIndex] = {
    ...categories[categoryIndex],
    ...normalizedUpdates,
  };

  await fs.writeFile(
    CATEGORIES_FILE,
    JSON.stringify(categories, null, 2),
    "utf-8",
  );
}

export async function deleteCategory(id: number): Promise<void> {
  const safeId = parsePositiveInt(id);
  if (!safeId) {
    throw new Error("Invalid category ID");
  }

  const categories = await getAllCategories();
  const filteredCategories = categories.filter((c) => c.id !== safeId);

  await fs.writeFile(
    CATEGORIES_FILE,
    JSON.stringify(filteredCategories, null, 2),
    "utf-8",
  );
}
