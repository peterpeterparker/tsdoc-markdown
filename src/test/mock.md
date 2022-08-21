# Functions

## hello

Hello

| Name    | Type                        |
| ------- | --------------------------- |
| `hello` | `(world: string) => string` |

Parameters:

- `yolo`: this is a jsdoc

## hello2

hello2

| Name     | Type         |
| -------- | ------------ |
| `hello2` | `() => void` |

# Constants

## numberOne

A constant

| Name        | Type |
| ----------- | ---- |
| `numberOne` | `2`  |

# LedgerCanister

LedgerCanister is a test class.

## Constructors

`public`: The constructor is public.

Parameters:

- `agent`: Agent js
- `canisterId`:
- `hardwareWallet`:

## create

Create a LedgerCanister

| Name     | Type                                                    |
| -------- | ------------------------------------------------------- |
| `create` | `(options: { canisterId?: string; }) => LedgerCanister` |

## accountBalance

Returns the balance of the specified account identifier.

| Name             | Type                                                                     |
| ---------------- | ------------------------------------------------------------------------ |
| `accountBalance` | `({ certified }: { certified?: boolean; }) => Promise<{ icp: bigint; }>` |
