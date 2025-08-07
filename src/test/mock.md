## :toolbox: Functions

- [hello](#gear-hello)
- [hello2](#gear-hello2)
- [genericType](#gear-generictype)
- [formInvalidateHandler](#gear-forminvalidatehandler)
- [MyObject.someFunction](#gear-myobject.somefunction)

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


[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L239)

### :gear: MyObject.someFunction

| Function | Type |
| ---------- | ---------- |
| `MyObject.someFunction` | `() => void` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L283)


## :wrench: Constants

- [numberOne](#gear-numberone)
- [PrincipalTextSchema](#gear-principaltextschema)
- [SOMETHING](#gear-something)

### :gear: numberOne

A constant

| Constant | Type |
| ---------- | ---------- |
| `numberOne` | `2` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L11)

### :gear: PrincipalTextSchema

Zod schema to validate a string as a valid textual representation of a Principal.

This schema checks if the provided string can be converted into a `Principal` instance.
If the conversion fails, validation will return an error message.

| Constant | Type |
| ---------- | ---------- |
| `PrincipalTextSchema` | `any` |

Examples:

```typescript
const result = PrincipalTextSchema.safeParse('aaaaa-aa');
console.log(result.success); // true or false
```


[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L300)

### :gear: SOMETHING

A constant

| Constant | Type |
| ---------- | ---------- |
| `SOMETHING` | `"abc"` |

References:

* hello2
* [https://daviddalbusco.com](https://daviddalbusco.com)
* `hello`
* [Source code](https://github.com/peterpeterparker/tsdoc-markdown)


[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L340)


## :factory: LedgerCanister

LedgerCanister is a test class.

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L35)

### Constructors

`public`: The constructor is public.

Parameters:

* `agent`: Agent js
* `canisterId`
* `hardwareWallet`


### Static Methods

- [create](#gear-create)

#### :gear: create

Create a LedgerCanister

| Method | Type |
| ---------- | ---------- |
| `create` | `(options: { canisterId?: string or undefined; }) => LedgerCanister` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L55)

### Methods

- [accountBalance](#gear-accountbalance)
- [shouldBeDocumented](#gear-shouldbedocumented)

#### :gear: accountBalance

Returns the balance of the specified account identifier.

| Method | Type |
| ---------- | ---------- |
| `accountBalance` | `({ certified }: { certified?: boolean or undefined; }) => Promise<{ icp: bigint; }>` |

Returns:

The balance of the specified account identifier

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L70)

#### :gear: shouldBeDocumented

Public method.

| Method | Type |
| ---------- | ---------- |
| `shouldBeDocumented` | `() => void` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L98)

### Properties

- [publicShouldBeDocumented](#gear-publicshouldbedocumented)

#### :gear: publicShouldBeDocumented

The documentation of the public property.

| Property | Type |
| ---------- | ---------- |
| `publicShouldBeDocumented` | `string` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L81)

## :factory: SnsLedgerCanister

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L119)

### Constructors

`public`: The constructor is public as well.



### Static Methods

- [create](#gear-create)

#### :gear: create

This create function is public as well.

| Method | Type |
| ---------- | ---------- |
| `create` | `(options: { canisterId?: string or undefined; }) => SnsLedgerCanister` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L134)

### Methods

- [metadata](#gear-metadata)

#### :gear: metadata

The token metadata (name, symbol, etc.).

| Method | Type |
| ---------- | ---------- |
| `metadata` | `(params: QueryParams) => Promise<SnsTokenMetadataResponse>` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L143)

## :factory: default

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L147)

### Methods

- [bar](#gear-bar)

#### :gear: bar

Description

| Method | Type |
| ---------- | ---------- |
| `bar` | `() => void` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L151)

## :factory: Number

Should differentiate methods / properties and static methods / properties

References:

* [https://github.com/peterpeterparker/tsdoc-markdown](https://github.com/peterpeterparker/tsdoc-markdown)


[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L318)

### Static Methods

- [add](#gear-add)

#### :gear: add

| Method | Type |
| ---------- | ---------- |
| `add` | `(n1: Number, n2: Number) => Number` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L328)

### Methods

- [add](#gear-add)

#### :gear: add

| Method | Type |
| ---------- | ---------- |
| `add` | `(n: Number) => Number` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L324)

### Static Properties

- [world](#gear-world)

#### :gear: world

| Property | Type |
| ---------- | ---------- |
| `world` | `string` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L320)

### Properties

- [hello](#gear-hello)

#### :gear: hello

| Property | Type |
| ---------- | ---------- |
| `hello` | `string` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L319)

## :nut_and_bolt: Enum

- [Time](#gear-time)
- [MemberType](#gear-membertype)

### :gear: Time



[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L183)

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `SECOND` | `1000` |  |
| `MINUTE` | `60 * SECOND` |  |


### :gear: MemberType



[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L188)

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

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L157)

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `hello` | `string` | Says hello. |
| `world` | `string or undefined` | Something default: `hello` |
| `abc` | `Abc` |  |


### :gear: StorageConfigRedirect

Use a URL redirect to prevent broken links if you've moved a page or to shorten URLs.

References:

* [https://github.com/peterpeterparker/tsdoc-markdown](https://github.com/peterpeterparker/tsdoc-markdown)


[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L259)

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `source` | `string` | The glob pattern or specific path to match for incoming requests that should be redirected. type: {StorageConfigSourceGlob} |
| `location` | `string` | The URL or path to which the request should be redirected. type: {string} |
| `code` | `301 or 302` | The HTTP status code to use for the redirect, typically 301 (permanent redirect) or 302 (temporary redirect). type: {301 or 302} |


## :cocktail: Types

- [yolo](#gear-yolo)
- [Abc](#gear-abc)
- [StorageConfigSourceGlob](#gear-storageconfigsourceglob)
- [SatelliteConfig](#gear-satelliteconfig)

### :gear: yolo

A type yolo

| Type | Type |
| ---------- | ---------- |
| `yolo` | `'string'` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L176)

### :gear: Abc

A type yolo

| Type | Type |
| ---------- | ---------- |
| `Abc` | `Foo and {hello: string}` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L181)

### :gear: StorageConfigSourceGlob

| Type | Type |
| ---------- | ---------- |
| `StorageConfigSourceGlob` |  |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L252)

### :gear: SatelliteConfig

| Type | Type |
| ---------- | ---------- |
| `SatelliteConfig` | `Either<SatelliteId, SatelliteIds> and CliConfig and SatelliteConfigOptions` |

[:link: Source](https://github.com/peterpeterparker/tsdoc-markdown/tree/main/src/test/mock.ts#L279)

