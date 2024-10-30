## :toolbox: Functions

- [hello](#gear-hello)
- [hello2](#gear-hello2)
- [genericType](#gear-generictype)
- [formInvalidateHandler](#gear-forminvalidatehandler)

### :gear: hello

Hello

| Function | Type |
| ---------- | ---------- |
| `hello` | `(world: string) => string` |

Parameters:

* `yolo`: this is a jsdoc


[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L6)

### :gear: hello2

hello2

| Function | Type |
| ---------- | ---------- |
| `hello2` | `() => void` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L16)

### :gear: genericType

Markdown should handle ` | ` for the type.

| Function | Type |
| ---------- | ---------- |
| `genericType` | `<T>(value: [] or [T]) => T or undefined` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L23)

### :gear: formInvalidateHandler

| Function | Type |
| ---------- | ---------- |
| `formInvalidateHandler` | `(form: any, err: any, cb?: ((msg: string) => void) or undefined) => void` |

Examples:

```vue
<template>
  <el-form ref="formEl" :model="form" :rules="rules" >
    ....
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

const formEl = ref<FormInstance>()
const form = reactive({
  name: '',
})
const rules = {
  name: [{ required: true, message: 'please input name', trigger: 'blur' }]
}

function submit() {
  formEl.value
    ?.validate()
    .then(async () => {
      // ...
    })
    .catch((err) => {
      formInvalidateHandler(formEl.value!, err, (msg: string) =>
        ElMessage({
          type: 'warning',
          message: msg,
        }),
      )
    })
}
</script>
```


[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L206)


## :wrench: Constants

- [numberOne](#gear-numberone)

### :gear: numberOne

A constant

| Constant | Type |
| ---------- | ---------- |
| `numberOne` | `2` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L11)


## :factory: LedgerCanister

LedgerCanister is a test class.

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L35)

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
| `create` | `(options: { canisterId?: string or undefined; }) => LedgerCanister` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L55)

#### :gear: accountBalance

Returns the balance of the specified account identifier.

| Method | Type |
| ---------- | ---------- |
| `accountBalance` | `({ certified }: { certified?: boolean or undefined; }) => Promise<{ icp: bigint; }>` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L69)


## :factory: SnsLedgerCanister

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L86)

### Constructors

`public`: The constructor is public as well.



### Methods

- [create](#gear-create)
- [metadata](#gear-metadata)

#### :gear: create

This create function is public as well.

| Method | Type |
| ---------- | ---------- |
| `create` | `(options: { canisterId?: string or undefined; }) => SnsLedgerCanister` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L101)

#### :gear: metadata

The token metadata (name, symbol, etc.).

| Method | Type |
| ---------- | ---------- |
| `metadata` | `(params: QueryParams) => Promise<SnsTokenMetadataResponse>` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L110)


## :factory: default

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L114)

### Methods

- [bar](#gear-bar)

#### :gear: bar

Description

| Method | Type |
| ---------- | ---------- |
| `bar` | `() => void` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L118)


## :nut_and_bolt: Enum

- [Time](#gear-time)
- [MemberType](#gear-membertype)

### :gear: Time



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `SECOND` | `1000` |  |
| `MINUTE` | `60 * SECOND` |  |


### :gear: MemberType



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `T1` | `` |  |
| `T2` | `` | comment |
| `T3` | `` |  |


## :tropical_drink: Interfaces

- [Foo](#gear-foo)
- [StorageConfigRedirect](#gear-storageconfigredirect)

### :gear: Foo

A Foo interface description.

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `hello` | `string` | Says hello. |
| `world` | `string or undefined` | Something default: `hello` |
| `abc` | `Abc` |  |


### :gear: StorageConfigRedirect

Use a URL redirect to prevent broken links if you've moved a page or to shorten URLs.

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `source` | `string` | The glob pattern or specific path to match for incoming requests that should be redirected. type: {StorageConfigSourceGlob} |
| `location` | `string` | The URL or path to which the request should be redirected. type: {string} |
| `code` | `301 or 302` | The HTTP status code to use for the redirect, typically 301 (permanent redirect) or 302 (temporary redirect). type: {301 or 302} |


## :cocktail: Types

- [yolo](#gear-yolo)
- [Abc](#gear-abc)
- [StorageConfigSourceGlob](#gear-storageconfigsourceglob)

### :gear: yolo

A type yolo

| Type | Type |
| ---------- | ---------- |
| `yolo` | `'string'` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L143)

### :gear: Abc

A type yolo

| Type | Type |
| ---------- | ---------- |
| `Abc` | `Foo and {hello: string}` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L148)

### :gear: StorageConfigSourceGlob

| Type | Type |
| ---------- | ---------- |
| `StorageConfigSourceGlob` |  |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L219)

