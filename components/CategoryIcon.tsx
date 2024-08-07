import { Category, IncomeCategory } from "@/types/types";
import { BsBag, BsCapsulePill, BsCart3, BsCreditCard, BsGift, BsLightningFill, BsAsterisk, BsController, BsCashCoin, BsBriefcase, BsGlobe2 } from "react-icons/bs";

export default function CategoryIcon({ category, className }: { category: Category | IncomeCategory | 'total', className?: string }) {
  return (
    <>
      {category === 'medical' && <BsCapsulePill className={className} />}
      {category === 'entertainment' && <BsController className={className} />}
      {category === 'food' && <BsBag className={className} />}
      {category === 'utility' && <BsLightningFill className={className} />}
      {category === 'shopping' && <BsCart3 className={className} />}
      {category === 'loans' && <BsCreditCard className={className} />}
      {category === 'gifts' && <BsGift className={className} />}
      {category === 'misc' && <BsAsterisk className={className} />}

      {category === 'salary' && <BsCashCoin className={className} />}
      {category === 'business' && <BsBriefcase className={className} />}
      {category === 'freelance' && <BsGlobe2 className={className} />}
    </>
  )
}