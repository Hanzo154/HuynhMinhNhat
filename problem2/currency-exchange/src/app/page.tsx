"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "antd";
import CurrencySelect from "./components/currencySelect";
import { CurrencyList } from "./constants";

export default function Home() {
  const [price, setPrice] = useState({
    inputPrice: CurrencyList[0].price,
    outputPrice: CurrencyList[0].price,
  });

  const [value, setValue] = useState({
    inputValue: 0,
    outputValue: 0,
  });

  const handleChangePrice = (target: string, value: number) => {
    setPrice({
      ...price,
      [target]: value,
    });
  };

  const handleSwapPrice = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPrice((prev) => ({
      inputPrice: prev.outputPrice,
      outputPrice: prev.inputPrice,
    }));

    setValue((prev) => ({
      inputValue: prev.outputValue,
      outputValue: prev.inputValue,
    }));
  };

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      inputValue: (prev.outputValue * price.inputPrice) / price.outputPrice,
    }));
  }, [price.inputPrice]);

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      outputValue: (prev.inputValue * price.outputPrice) / price.inputPrice,
    }));
  }, [price.outputPrice]);

  return (
    <main className="absolute top-[20%] left-1/2 transform -translate-x-1/2 max-w-[480px] px-4">
      <h2 className="text-center font-bold text-xl mb-4">Currency Exchange</h2>
      <form onSubmit={(e) => handleSwapPrice(e)}>
        <div className="relative">
          <div className="p-4 mb-1 border-solid border-2 border-black rounded-lg">
            <label className="w-1/3" htmlFor="input-amount">
              Amount to send
            </label>
            <div className="flex justify-between items-center py-2">
              <Input
                className="w-3/5 outline-none mr-2 text-4xl"
                id="input-amount"
                value={value.inputValue}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value)))
                    alert("Only accept numberic characters.");
                  const changedValue = isNaN(Number(e.target.value))
                    ? 0
                    : Number(e.target.value);
                  setValue({
                    inputValue: changedValue,
                    outputValue:
                      (changedValue * price.outputPrice) / price.inputPrice,
                  });
                }}
              />
              <CurrencySelect
                name="inputPrice"
                price={price.inputPrice}
                changePrice={handleChangePrice}
              />
            </div>
          </div>

          <div className="p-4 border-solid border-2 border-black rounded-lg">
            <label className="w-1/3" htmlFor="output-amount">
              Amount to receive
            </label>
            <div className="flex justify-between items-center py-2">
              <Input
                className="w-3/5 outline-none mr-2 text-4xl"
                id="output-amount"
                value={value.outputValue}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value)))
                    alert("Only accept numberic characters.");
                  const changedValue = isNaN(Number(e.target.value))
                    ? 0
                    : Number(e.target.value);
                  setValue({
                    inputValue:
                      (changedValue * price.inputPrice) / price.outputPrice,
                    outputValue: changedValue,
                  });
                }}
              />
              <CurrencySelect
                name="outputPrice"
                price={price.outputPrice}
                changePrice={handleChangePrice}
              />
            </div>
          </div>

          <button className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 border-2 border-black rounded-full transition ease-in-out duration-300 bg-white hover:bg-gray-500">
            <Image
              src="/icon-arrow.png"
              alt="arrow-icon"
              width={16}
              height={16}
            />
          </button>
        </div>
      </form>
    </main>
  );
}
