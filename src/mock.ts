/**
 * Hello
 *
 * @params yolo
 */
export const hello = (world: string): string => 'hello' + world;

/**
 * hello2
 */
export function hello2() {
  console.log('hello2');
}

export class LedgerCanister {
  private constructor(
    private readonly agent: number,
    private readonly canisterId: {canisterId: string},
    private readonly hardwareWallet: boolean = false
  ) {}

  /**
   * Create a LedgerCanister
   *
   * @param {Object} params
   * @param params.canisterId An optional canisterId
   */
  public static create(options: {canisterId?: string}) {
    const canisterId: string = options.canisterId ?? 'test';

    return new LedgerCanister(1, {canisterId}, true);
  }

  /**
   * Returns the balance of the specified account identifier.
   *
   * @param {Object} params
   * @param params.certified Update calls?
   *
   * @throws {@link Error}
   */
  public accountBalance = async ({
    certified = true
  }: {
    certified?: boolean;
  }): Promise<{icp: bigint}> => {
    return {icp: 1n};
  };
}
