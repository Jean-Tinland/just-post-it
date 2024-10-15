export type PostItItem = {
  id: number;
  title: string;
  content: string;
  dueDate: Date | null;
  bounds: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  lastUpdated?: Date;
  categoryId: number | null;
  categoryName: string;
  categoryColor: string;
};
