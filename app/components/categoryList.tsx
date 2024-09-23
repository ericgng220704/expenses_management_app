import { Category } from "../types/category";
import Icon from "./icons";

type CategoryListProps = {
  categories: Category[];
};

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <button
          key={category.id}
          className="flex items-center bg-white gap-2 px-3 py-2 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <Icon categories={categories} category={`${category.name}`} />
          {category.name}
        </button>
      ))}
    </div>
  );
}
