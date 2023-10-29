import { PERCENT, QUOTE_CURRENCY } from "PlaceOrder/constants";
import CloseIcon from '@mui/icons-material/Close';
import { NumberInput } from "shared/components/NumberInput/NumberInput";

import styles from "./ProfitRow.module.scss";

type Props =  {
  value: number;
  price: number;
  amount: number;
  isError: boolean;
  removeRow: () => void;
  onValueBlur: (newValue: number) => void;
  onPriceBlur: (newPrice: number) => void;
  onAmountBlur: (newAmount: number) => void;
};

const ProfitRow = ({
  value,
  price,
  amount,
  isError,
  removeRow,
  onValueBlur,
  onPriceBlur,
  onAmountBlur,
}: Props) => {
  return (
    <div className={`${styles.row} ${isError ? styles.error : ''}`}>
      <div className={styles.item}>
        <NumberInput
          value={value}
          onChange={(value) => onValueBlur(Number(value))}
        />
        <span>{PERCENT}</span>
      </div>

      <div className={styles.item}>
        <NumberInput
          value={price}
          onChange={(value) => onPriceBlur(Number(value))}
        />
        <span>{QUOTE_CURRENCY}</span>
      </div>
      
      <div className={styles.item}>
        <NumberInput
          value={amount}
          onChange={(value) => onAmountBlur(Number(value))}
        />
        <span>{PERCENT}</span>
        <CloseIcon className={styles.button} onClick={removeRow} />
      </div>
    </div>
  )
};

export { ProfitRow };
