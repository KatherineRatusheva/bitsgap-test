import { useStore } from "PlaceOrder/context";
import { Profit } from "PlaceOrder/model";

type Props =  {
  activeOrder: string;
  profitRows: Profit[];
};

const useProfitRowUpdate = ({profitRows, activeOrder}: Props) => {
  const {
    price,
    setProfitRows
  } = useStore();

  const handleValueBlur = (index: number, newValue: number) => {
    const updatedRows = [...profitRows];

    updatedRows[index].value = newValue;
    updatedRows[index].price = activeOrder === "buy" ? price + (price * newValue) / 100 : price - (price * newValue) / 100;
    setProfitRows(updatedRows);
  };

  const handlePriceBlur = (index: number, newPrice: number) => {
    const updatedRows = [...profitRows];

    updatedRows[index].price = newPrice;
    setProfitRows(updatedRows);
  };

  const handleAmountBlur = (index: number, newAmount: number) => {
    const updatedRows = [...profitRows];
    
    updatedRows[index].amount = newAmount;
    setProfitRows(updatedRows);
  };

  return { handleValueBlur, handlePriceBlur, handleAmountBlur };
}

export default useProfitRowUpdate;