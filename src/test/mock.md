## Functions

- [hello](#hello)
- [hello2](#hello2)

### hello

Hello

| Function | Type |
| ---------- | ---------- |
| `hello` | `(world: string) => string` |

Parameters:

* `yolo`: this is a jsdoc


### hello2

hello2

| Function | Type |
| ---------- | ---------- |
| `hello2` | `() => void` |


## Constants

- [numberOne](#numberone)

### numberOne

A constant

| Constant | Type |
| ---------- | ---------- |
| `numberOne` | `2` |


## LedgerCanister

LedgerCanister is a test class.

### Constructors

`public`: The constructor is public.

Parameters:

* `agent`: Agent js
* `canisterId`: 
* `hardwareWallet`: 


### Methods

- [create](#create)
- [accountBalance](#accountbalance)

#### create

Create a LedgerCanister

| Method | Type |
| ---------- | ---------- |
| `create` | `(options: { canisterId?: string; }) => LedgerCanister` |

#### accountBalance

Returns the balance of the specified account identifier.

| Method | Type |
| ---------- | ---------- |
| `accountBalance` | `({ certified }: { certified?: boolean; }) => Promise<{ icp: bigint; }>` |

