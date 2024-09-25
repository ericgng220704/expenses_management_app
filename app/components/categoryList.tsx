import { Category } from "../types/category";
import Icon from "./icons";

type CategoryListProps = {
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function CategoryList({
  categories,
  selectedCategories,
  setSelectedCategories,
}: CategoryListProps) {
  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="flex gap-2 flex-wrap text-sm sm:text-base">
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category.name);
        return (
          <button
            key={category.id}
            className={`flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
              isSelected ? "bg-black text-white" : "bg-white"
            }`}
            onClick={() => toggleCategory(category.name)}
          >
            <Icon categories={categories} category={`${category.name}`} />
            <span className="">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
