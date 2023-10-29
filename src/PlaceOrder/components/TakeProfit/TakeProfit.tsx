import { QuestionTooltip } from "shared/components/QuestionTooltip/QuestionTooltip";
import styles from "./TakeProfit.module.scss";
import { Switch } from "shared/components/Switch/Switch";
import { useEffect } from "react";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { ProfitRow } from "shared/components/ProfitRow/ProfitRow";
import { Profit } from "PlaceOrder/model";
import { useStore } from "PlaceOrder/context";
import { ProjectedProfit } from "shared/components/ProjectedProfit/ProjectedProfit";
import useProfitRowUpdate from "../../../shared/hooks/useProfitRowUpdate";

type Props =  {
  activeOrder: string;
  projectedProfit: number;
  profitRows: Profit[];
  errors: string[];
};

export const TakeProfit = ({ activeOrder, projectedProfit, profitRows, errors }: Props) => {
  const {
    price,
    isTakeProfitEnabled,
    profitCount,
    startingPrice,
    columns,
    errorRows,
    setTakeProfitEnabled,
    setProfitCount,
    setProfitRows,
    setErrors,
    setErrorRows
  } = useStore();

  useEffect(() => {
    orderTypeChange(activeOrder);
  }, [activeOrder, price]);

  const { handleValueBlur, handlePriceBlur, handleAmountBlur } = useProfitRowUpdate({profitRows, activeOrder});

  const orderTypeChange = (orderType: string) => {
    const updatedProfitRows = profitRows.map((item, index) => ({
      ...item,
      price: orderType === "buy" ? price + (price * (2 + index * 2)) / 100 : price - (price * (2 + index * 2)) / 100,
    }));
    setProfitRows(updatedProfitRows);
  };

  const takeProfitChange = (value: boolean) => {
    setTakeProfitEnabled(value);
    setProfitRows([{ value: 2, price: startingPrice, amount: 100 }]);
    setProfitCount(1);
    setErrors([]);
    setErrorRows(new Set<number>());
  };

  const calculateTotalAmount = (rows: Profit[]) => {
    return rows.reduce((total, row) => total + row.amount, 0);
  };

  return (
    <div className={styles.root}>
      <div className={styles.switch}>
        <div className={`${styles.label} ${isTakeProfitEnabled ? styles.enabled : ''}`}>
          <QuestionTooltip message="Take profit description" />
          Take profit{" "}
        </div>
        <Switch checked={isTakeProfitEnabled} onChange={takeProfitChange} />
      </div>

      {isTakeProfitEnabled && (
        <div>
          <div className={styles.tableHeader}>
            {columns.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>

          <div className={styles.tableList}>
          {profitRows.map((item, index) => (
            <ProfitRow
              key={index}
              value={item.value}
              price={item.price}
              amount={item.amount}
              removeRow={() => removeRow(index)}
              onValueBlur={(newValue) => handleValueBlur(index, newValue)}
              onPriceBlur={(newPrice) => handlePriceBlur(index, newPrice)}
              onAmountBlur={(newAmount) => handleAmountBlur(index, newAmount)}
              isError={errorRows.has(index)}
            />
          ))}
          </div>

          {errors.map((error, index) => (
            <div className={styles.error} key={index}>{error}</div>
          ))}

          {profitCount < 5 && (
            <div onClick={addProfit} className={styles.button}>
              <AddCircleRoundedIcon /> Add profit target {profitCount}/5
            </div>
          )}

          <ProjectedProfit projectedProfit={projectedProfit} profitRows={profitRows} activeOrder={activeOrder}/>
        </div>
      )}
    </div>
  );

  function addProfit() {
    if (profitCount === 5) {
      return;
    }
  
    const newValue = profitRows[profitRows.length - 1].value + 2;
    const updatedProfitRows = [
      ...profitRows,
      { value: newValue, 
        price: activeOrder === "buy" ? price + (price * newValue) / 100 : price - (price * newValue) / 100,
        amount: 20 },
    ];
    const totalAmount = calculateTotalAmount(updatedProfitRows);
    const adjustedRows = [...updatedProfitRows];
    
    adjustedRows[0].amount -= totalAmount - 100;
    setProfitRows(adjustedRows);
    setProfitCount(profitCount + 1);
  };

  function removeRow (indexToRemove: number) {
    const updatedProfitRows = profitRows.filter((_, index) => index !== indexToRemove);

    if(!updatedProfitRows.length) {
      setTakeProfitEnabled(false)
    }
    
    const updatedProfitRowsWithValues = updatedProfitRows.map((item, index) => ({
      ...item,
      value: 2 + index * 2,
      price: activeOrder === "buy" ? price + (price * (2 + index * 2)) / 100 : price - (price * (2 + index * 2)) / 100,
      amount: index !== 0 ? 20 : item.amount += 100 - calculateTotalAmount(updatedProfitRows)
    }));

    setProfitRows(updatedProfitRowsWithValues);
    setProfitCount(profitCount - 1);
  };
};
