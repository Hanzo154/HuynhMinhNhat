interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
// In my POV, we should move interface, type to some kind of types.ts file which is used to declare interface and type.

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  // If children from props is not used in the component, destructuring it serves no purpose and can be removed.

  const balances = useWalletBalances();
  const prices = usePrices();

  // The getPriority function could be optimized by using a map for constant time lookups rather than a switch statement, which is less efficient, especially with many cases.
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // blockchain property is not declared in WalletBalance interface which can lead to runtime errors if the property doesn't exist.
        // Refactor: declare blockchain in WalletBalance
        if (lhsPriority > -99) {
          // lhsPriority is undefined, this will cause a runtime error.
          // Should replace it with balancePriority.
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // The sorting function does not handle cases where both priorities are equal.
        // It can result in an unstable sort, which might matter depending on how the rendering behaves with respect to keys.
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // The getPriority function is called multiple times (once for filtering and once for sorting), which is inefficient.
        // It could be called once per balance and stored in a variable.
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => { // formattedBalances is not used.
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
      // The method toFixed() does not specify decimal places, which implies conversion to string can lead to loss of precision. Defining the number of decimal places may be a better practice.
      // Refactor: should specify decimal places
      // formatted: balance.amount.toFixed(2),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount; // If prices[balance.currency] is not found, this could result in undefined leading to unexpected behavior.
      return (
        <WalletRow
          className={classes.row} // classes is undefined
          key={index}
          // using index as a key can lead to performance degradation and issues with component state.
          // a unique identifier such as balance.currency should be used as the key.
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
  // Refactor:   return <div {...props}>{rows}</div>;
};
