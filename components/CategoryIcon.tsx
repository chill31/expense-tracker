import { Category } from "@/types/types";
import { BsBag, BsCapsulePill, BsCart3, BsCreditCard, BsGift, BsLightningFill, BsAsterisk, BsCashCoin, BsController, BsDash } from "react-icons/bs";

export default function CategoryIcon({ category, className }: { category: Category, className?: string }) {
  return (
    <>
      {category === 'medical' && <BsCapsulePill className={className} />}
      {category === 'entertainment' && <BsController className={className} />}
      {category === 'food' && <BsBag className={className} />}
      {category === 'utility' && <BsLightningFill className={className} />}
      {category === 'shopping' && <BsCart3 className={className} />}
      {category === 'loans' && <BsCreditCard className={className} />}
      {category === 'gifts' && <BsGift className={className} />}
      {category === 'income' && <BsCashCoin className={className} />}
      {category === 'misc' && <BsAsterisk className={className} />}
    </>
  )
}