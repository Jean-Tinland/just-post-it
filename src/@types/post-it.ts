type Bounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type PostItItem = {
  id: number;
  title: string;
  content: string;
  dueDate: Date | null;
  bounds: Bounds;
  lastUpdated: Date;
  categoryId: number | null;
  categoryName: string;
  categoryColor: string;
};

export type PostItItemPatch = Partial<Omit<PostItItem, "bounds">> & {
  bounds?: Partial<Bounds>;
};
