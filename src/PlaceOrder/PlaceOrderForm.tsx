import { observer } from "mobx-react";

import { QuestionTooltip } from "shared/components/QuestionTooltip/QuestionTooltip";
import { Button } from "shared/components/Button/Button";
import { NumberInput } from "shared/components/NumberInput/NumberInput";

import { BASE_CURRENCY, QUOTE_CURRENCY } from "./constants";
import { useStore } from "./context";
import { PlaceOrderTypeSwitch } from "./components/PlaceOrderTypeSwitch/PlaceOrderTypeSwitch";
import { TakeProfit } from "./components/TakeProfit/TakeProfit";
import { updateErrorRows, validate } from "shared/utils/validate";

import styles from "./PlaceOrderForm.module.scss";
import { FormEvent } from "react";

export const PlaceOrderForm = observer(() => {
  const {
    activeOrderSide,
    price,
    total,
    amount,
    projectedProfit,
    profitRows,
    errors,
    setPrice,
    setAmount,
    setTotal,
    setOrderSide,
    setErrors,
    setErrorRows
  } = useStore();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validate(profitRows);
    const errorRows = updateErrorRows(profitRows);

    setErrors(newErrors);
    setErrorRows(errorRows);
    
    if (newErrors.length === 0) {
      setErrorRows(new Set<number>());
      event.currentTarget.submit();
    }
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <div className={styles.label}>
        Market direction{" "}
        <QuestionTooltip message="Market direction description" />
      </div>
      <div className={styles.content}>
        <div className={styles.typeSwitch}>
          <PlaceOrderTypeSwitch
            activeOrderSide={activeOrderSide}
            onChange={setOrderSide}
          />
        </div>
        <NumberInput
          label={`Price, ${QUOTE_CURRENCY}`}
          value={price}
          onChange={(value) => setPrice(Number(value))}
        />
        <NumberInput
          value={amount}
          label={`Amount, ${BASE_CURRENCY}`}
          onChange={(value) => setAmount(Number(value))}
        />
        <NumberInput
          value={total}
          label={`Total, ${QUOTE_CURRENCY}`}
          onChange={(value) => setTotal(Number(value))}
        />
        <TakeProfit activeOrder={activeOrderSide} projectedProfit={projectedProfit} profitRows={profitRows} errors={errors}/>
        <div className={styles.submit}>
          <Button
            color={activeOrderSide === "buy" ? "green" : "red"}
            type="submit"
            fullWidth
          >
            {activeOrderSide === "buy"
              ? `Buy ${BASE_CURRENCY}`
              : `Sell ${QUOTE_CURRENCY}`}
          </Button>
        </div>
      </div>
    </form>
  );
});
