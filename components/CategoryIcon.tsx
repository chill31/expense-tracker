import { Category, IncomeCategory } from "@/utils/types";
import {
  BsBag,
  BsCapsulePill,
  BsCart3,
  BsCreditCard,
  BsGift,
  BsLightningFill,
  BsAsterisk,
  BsController,
  BsCashCoin,
  BsBriefcase,
  BsGlobe2,
  BsBicycle,
} from "react-icons/bs";

export default function CategoryIcon({
  category,
  className,
}: {
  category: Category | IncomeCategory
  className?: string;
}) {
  return (
    <>
      {category === "medical" && <BsCapsulePill className={className} />}
      {category === "entertainment" && <BsController className={className} />}
      {category === "travel" && <BsBicycle className={className} />}
      {category === "food" && <BsBag className={className} />}
      {category === "utility" && <BsLightningFill className={className} />}
      {category === "shopping" && <BsCart3 className={className} />}
      {category === "loans" && <BsCreditCard className={className} />}
      {category === "gifts" && <BsGift className={className} />}
      {category === "misc" && <BsAsterisk className={className} />}

      {category === "salary" && <BsCashCoin className={className} />}
      {category === "business" && <BsBriefcase className={className} />}
      {category === "freelance" && <BsGlobe2 className={className} />}
    </>
  );
}
