import { QUOTE_CURRENCY } from "PlaceOrder/constants";
import { useStore } from "PlaceOrder/context";
import { useEffect } from "react";
import { Profit } from "PlaceOrder/model";

import styles from "./ProjectedProfit.module.scss";

type Props =  {
  projectedProfit: number;
  profitRows: Profit[];
  activeOrder: string;
};

export const ProjectedProfit = ({ projectedProfit, profitRows, activeOrder }: Props) => {
  const {
    price,
    amount,
    setProjectedProfit,
  } = useStore();

  useEffect(() => {
    const updatedProjectedProfit = calculateProjectedProfit(activeOrder, amount, price, profitRows);
    
    setProjectedProfit(updatedProjectedProfit);
  }, [profitRows, amount]);

  const calculateProjectedProfit = (activeOrder: string, amount: number, price: number, rows: Profit[]) => {
    return rows.reduce((totalProfit, row) => {
      const profit = activeOrder === "buy" ? amount * (row.price - price) : amount * (price - row.price);
      
      return totalProfit + profit;
    }, 0);
  };

  return (
    <div className={styles.root}>
      <div>Projected profit</div>
      <span/>
      <div>{projectedProfit} {QUOTE_CURRENCY}</div>
    </div>
  )
};
