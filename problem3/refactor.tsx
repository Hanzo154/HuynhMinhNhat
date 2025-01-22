interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
// In my POV, we should move interface, type to some kind of types.ts file which is used to declare interface and type.

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const priorityList = new Map();
  priorityList.set("Osmosis", 100);
  priorityList.set("Ethereum", 50);
  priorityList.set("Arbitrum", 30);
  priorityList.set("Zilliqa", 20);
  priorityList.set("Neo", 20);

  const getPriority = (blockchain: any): number => {
    return priorityList.has(blockchain) ? priorityList.get(blockchain) : -99;
  };

  const sortedBalances = useMemo(() => {
    const balancesWithPriority = balances
      .map((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return { ...balance, priority }; // Add the priority to each balance
      })
      .filter(({ priority, amount }) => {
        // Filter based on the calculated priority and amount
        return priority > -99 && amount > 0;
      })
      .sort((lhs, rhs) => {
        // Sort based on the priority
        return rhs.priority - lhs.priority; // Sort in descending order
      });

    return balancesWithPriority;
  }, [balances, prices]);

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          // using index as a key can lead to performance degradation and issues with component state.
          // a unique identifier such as balance.currency should be used as the key.
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...props}>{rows}</div>;
};
