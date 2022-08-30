## :toolbox: Functions

- [hello](#gear-hello)
- [hello2](#gear-hello2)
- [genericType](#gear-generictype)

### :gear: hello

Hello

| Function | Type |
| ---------- | ---------- |
| `hello` | `(world: string) => string` |

Parameters:

* `yolo`: this is a jsdoc


### :gear: hello2

hello2

| Function | Type |
| ---------- | ---------- |
| `hello2` | `() => void` |

### :gear: genericType

Markdown should handle ` | ` for the type.

| Function | Type |
| ---------- | ---------- |
| `genericType` | `<T>(value: [] or [T]) => T` |


## :wrench: Constants

- [numberOne](#gear-numberone)

### :gear: numberOne

A constant

| Constant | Type |
| ---------- | ---------- |
| `numberOne` | `2` |


## :factory: LedgerCanister

LedgerCanister is a test class.

### Constructors

`public`: The constructor is public.

Parameters:

* `agent`: Agent js
* `canisterId`
* `hardwareWallet`


### Methods

- [create](#gear-create)
- [accountBalance](#gear-accountbalance)

#### :gear: create

Create a LedgerCanister

| Method | Type |
| ---------- | ---------- |
| `create` | `(options: { canisterId?: string; }) => LedgerCanister` |

#### :gear: accountBalance

Returns the balance of the specified account identifier.

| Method | Type |
| ---------- | ---------- |
| `accountBalance` | `({ certified }: { certified?: boolean; }) => Promise<{ icp: bigint; }>` |


## :factory: SnsLedgerCanister



### Constructors

`public`: The constructor is public as well.



### Methods

- [create](#gear-create)
- [metadata](#gear-metadata)

#### :gear: create

This create function is public as well.

| Method | Type |
| ---------- | ---------- |
| `create` | `(options: { canisterId?: string; }) => SnsLedgerCanister` |

#### :gear: metadata

The token metadata (name, symbol, etc.).

| Method | Type |
| ---------- | ---------- |
| `metadata` | `(params: QueryParams) => Promise<SnsTokenMetadataResponse>` |

