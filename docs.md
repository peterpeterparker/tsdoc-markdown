# Functions

|         |                         |
| ---------- | --------------------------- |
| Name | `hello` |
|Type| `(world: string) => string` |
|Parameters| |

Returns the list of neurons controlled by the caller.

# Const

If an array of neuron IDs is provided, precisely those neurons will be fetched. |

| Name        | Type                        | Documentation | Parameters |
| ----------- | --------------------------- | ------------- | ---------- |
| `hello`     | `(world: string) => string` | Hello         |            |
| `numberOne` | `2`                         | A constant    |            |
| `hello2`    | `() => void`                | hello2        |            |

# LedgerCanister

LedgerCanister is a test class.

| Name             | Type                                                                     | Documentation                                            | Parameters |
| ---------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- | ---------- |
| `create`         | `(options: { canisterId?: string; }) => LedgerCanister`                  | Create a LedgerCanister                                  |            |
| `accountBalance` | `({ certified }: { certified?: boolean; }) => Promise<{ icp: bigint; }>` | Returns the balance of the specified account identifier. |            |
