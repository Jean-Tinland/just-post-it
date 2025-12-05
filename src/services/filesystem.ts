import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { PostItItem } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";

const CONTENTS_DIR = path.join(process.cwd(), "contents");
const CATEGORIES_FILE = path.join(CONTENTS_DIR, "categories.json");

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
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<number, CategoryItem>);

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
              error
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
      })
    );

    const validPostIts = postIts.filter((p): p is PostItItem => p !== null);

    return validPostIts.sort(
      (a, b) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
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
  left: number = 10
): Promise<number> {
  await ensureContentsDir();

  const postIts = await getAllPostIts();
  const newId =
    postIts.length > 0 ? Math.max(...postIts.map((p) => p.id)) + 1 : 1;

  const frontMatter = {
    id: newId,
    title: "New idea",
    dueDate: null,
    topPosition: top,
    leftPosition: left,
    width: 380,
    height: 240,
    categoryId,
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
  >
): Promise<void> {
  const filePath = path.join(CONTENTS_DIR, `${id}.md`);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const updatedData: Record<string, unknown> = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };

    if (updates.title !== undefined) updatedData.title = updates.title;
    if (updates.dueDate !== undefined)
      updatedData.dueDate = updates.dueDate?.toISOString() || null;
    if (updates.categoryId !== undefined)
      updatedData.categoryId = updates.categoryId;
    if (updates.minimized !== undefined)
      updatedData.minimized = updates.minimized;

    if (updates.bounds) {
      if (updates.bounds.top !== undefined)
        updatedData.topPosition = updates.bounds.top;
      if (updates.bounds.left !== undefined)
        updatedData.leftPosition = updates.bounds.left;
      if (updates.bounds.width !== undefined)
        updatedData.width = updates.bounds.width;
      if (updates.bounds.height !== undefined)
        updatedData.height = updates.bounds.height;
    }

    const newContent =
      updates.content !== undefined ? updates.content : content;
    const updatedFileContent = matter.stringify(newContent, updatedData);

    await fs.writeFile(filePath, updatedFileContent, "utf-8");
  } catch (error) {
    throw new Error(`Failed to update post-it ${id}: ${error}`);
  }
}

export async function deletePostIt(id: number): Promise<void> {
  const filePath = path.join(CONTENTS_DIR, `${id}.md`);

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
    const sortedCategories: CategoryItem[] = JSON.parse(fileContent).sort(
      (a: CategoryItem, b: CategoryItem) => a.position - b.position
    );
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

  const newCategory: CategoryItem = {
    id: newId,
    name: "New category",
    color: "red",
    position,
  };

  categories.push(newCategory);
  await fs.writeFile(
    CATEGORIES_FILE,
    JSON.stringify(categories, null, 2),
    "utf-8"
  );

  return newId;
}

export async function updateCategory(
  id: number,
  updates: Partial<Omit<CategoryItem, "id">>
): Promise<void> {
  const categories = await getAllCategories();
  const categoryIndex = categories.findIndex((c) => c.id === id);

  if (categoryIndex === -1) {
    throw new Error(`Category ${id} not found`);
  }

  categories[categoryIndex] = {
    ...categories[categoryIndex],
    ...updates,
  };

  await fs.writeFile(
    CATEGORIES_FILE,
    JSON.stringify(categories, null, 2),
    "utf-8"
  );
}

export async function deleteCategory(id: number): Promise<void> {
  const categories = await getAllCategories();
  const filteredCategories = categories.filter((c) => c.id !== id);

  await fs.writeFile(
    CATEGORIES_FILE,
    JSON.stringify(filteredCategories, null, 2),
    "utf-8"
  );
}
