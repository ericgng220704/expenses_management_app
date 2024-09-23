import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faReceipt,
  faUtensils,
  faBasketShopping,
  faCookieBite,
  faGamepad,
  faChampagneGlasses,
  faCartShopping,
  faTheaterMasks,
  faTags,
  IconDefinition, // Import IconDefinition for proper typing
} from "@fortawesome/free-solid-svg-icons";
import { Category } from "../types/category";
import { colorMap } from "../types/colorMap";

// Define the iconMap with the correct type using IconDefinition
const iconMap: Record<string, IconDefinition> = {
  faHouse: faHouse,
  faReceipt: faReceipt,
  faUtensils: faUtensils,
  faBasketShopping: faBasketShopping,
  faCookieBite: faCookieBite,
  faGamepad: faGamepad,
  faChampagneGlasses: faChampagneGlasses,
  faCartShopping: faCartShopping,
  faTheaterMasks: faTheaterMasks,
  faTags: faTags,
};

type IconProps = {
  categories: Category[];
  category: string;
};

export default function Icon({ categories, category }: IconProps) {
  const selectedCategory = categories.find(
    (categoryM) => categoryM.name === category
  );

  const iconBgColorClass =
    colorMap[selectedCategory?.color || ""] || "bg-white";

  const iconName = selectedCategory?.icon || "faTags";
  const icon = iconMap[iconName];

  return (
    <div
      className={`p-2 flex justify-center items-center ${iconBgColorClass} rounded-full`}
    >
      <FontAwesomeIcon icon={icon} className="opacity-80 text-gray-900" />
    </div>
  );
}
