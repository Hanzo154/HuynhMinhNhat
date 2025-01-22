import { FC } from "react";
import dayjs from "dayjs";
import { Select } from "antd";
import { CurrencyList } from "../constants";
import { Currency } from "../type";

type Props = {
  name: string;
  price: number;
  changePrice: (target: string, value: number) => void;
};

const CurrencySelect: FC<Props> = ({ name, price, changePrice }) => {
  const priceList = new Map<string, Currency>();
  CurrencyList.map((item) => {
    if (!priceList.has(item.currency)) {
      priceList.set(item.currency, item);
    } else {
      const currentDate = priceList.get(item.currency)?.date;
      if (dayjs(currentDate).isAfter(item.date)) {
        priceList.set(item.currency, item);
      }
    }
  });

  const priceOptions = Array.from(priceList.entries()).map((entry) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, value] = entry;
    return { value: value.price, label: value.currency };
  });

  return (
    <Select
      className="w-2/5 px-2 outline-none text-4xl"
      value={price}
      options={priceOptions}
      onChange={(value) => changePrice(name, Number(value))}
    />
  );
};

export default CurrencySelect;
