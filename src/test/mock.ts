/**
 * Hello
 *
 * @param yolo this is a jsdoc
 */
export const hello = (world: string): string => 'hello' + world;

/**
 * A constant
 */
export const numberOne = 2;

/**
 * hello2
 */
export function hello2() {
  console.log('hello2');
}

/**
 * Markdown should handle ` | ` for the type.
 */
export const genericType = <T>(value: [] | [T]): T | undefined => value?.[0];

/**
 * Should not be documented.
 */
const hello3 = () => {
  console.log('hello3');
};

/**
 * LedgerCanister is a test class.
 */
export class LedgerCanister {
  /**
   * The constructor is public.
   * @param agent Agent js
   * @param canisterId
   * @param hardwareWallet
   * @private
   */
  public constructor(
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
   * @throws an {@link Error}
   */
  public accountBalance = async ({
    certified = true
  }: {
    certified?: boolean;
  }): Promise<{icp: bigint}> => {
    return {icp: 1n};
  };

  /**
   * Private method.
   * @private
   */
  private shouldNoBeDocumented() {
    console.log('hello');
  }
}

export class SnsLedgerCanister extends Canister<SnsLedgerService> {
  /**
   * The constructor is public as well.
   * @param agent Agent js
   * @param canisterId
   * @param hardwareWallet
   */
  constructor() {}

  /**
   * This create function is public as well.
   *
   * @param {Object} params
   * @param params.canisterId An optional canisterId
   */
  static create(options: {canisterId?: string}) {
    const canisterId: string = options.canisterId ?? 'test';

    return new SnsLedgerCanister();
  }

  /**
   * The token metadata (name, symbol, etc.).
   */
  metadata = (params: QueryParams): Promise<SnsTokenMetadataResponse> =>
    this.caller(params).icrc1_metadata();
}

export default class foo {
  /**
   * Description
   */
  bar() {}
}

/**
 * A Foo interface description.
 */
export interface Foo {
  /**
   * Says hello.
   */
  hello: string;

  /**
   * Something
   *
   * @default `hello`
   */
  world?: string;

  abc: Abc;
}

/**
 * A type yolo
 */
export type yolo = 'string';

/**
 * A type yolo
 */
export type Abc = Foo & {hello: string};

export enum Time {
  SECOND = 1000,
  MINUTE = 60 * SECOND
}

export enum MemberType {
  T1,
  /**
   * comment
   */
  T2,
  T3
}

/**
 * @param form
 * @param err
 * @param cb
 * @example
 * ```vue
 * <template>
 *   <el-form ref="formEl" :model="form" :rules="rules" >
 *     ....
 *   </el-form>
 * </template>
 *
 * <script lang="ts" setup>
 * import { ref, reactive } from 'vue'
 * import { ElMessage, FormInstance } from 'element-plus'
 *
 * const formEl = ref<FormInstance>()
 * const form = reactive({
 *   name: '',
 * })
 * const rules = {
 *   name: [{ required: true, message: 'please input name', trigger: 'blur' }]
 * }
 *
 * function submit() {
 *   formEl.value
 *     ?.validate()
 *     .then(async () => {
 *       // ...
 *     })
 *     .catch((err) => {
 *       formInvalidateHandler(formEl.value!, err, (msg: string) =>
 *         ElMessage({
 *           type: 'warning',
 *           message: msg,
 *         }),
 *       )
 *     })
 * }
 * </script>
 * ```
 */
export function formInvalidateHandler(form: any, err: any, cb?: (msg: string) => void) {
  const keys = Object.keys(err);
  if (keys.length) {
    form.scrollToField?.(keys[0]);
    const msg = err[keys[0]]?.[0]?.message;
    if (msg && cb) cb(msg);
  }
}

/**
 * Represents a glob pattern for matching files in the Storage configuration.
 * @typedef {string} StorageConfigSourceGlob
 */
export type StorageConfigSourceGlob = string;

/**
 * Use a URL redirect to prevent broken links if you've moved a page or to shorten URLs.
 * @interface StorageConfigRedirect
 */
export interface StorageConfigRedirect {
  /**
   * The glob pattern or specific path to match for incoming requests that should be redirected.
   * @type {StorageConfigSourceGlob}
   */
  source: StorageConfigSourceGlob;

  /**
   * The URL or path to which the request should be redirected.
   * @type {string}
   */
  location: string;

  /**
   * The HTTP status code to use for the redirect, typically 301 (permanent redirect) or 302 (temporary redirect).
   * @type {301 | 302}
   */
  code: 301 | 302;
}

export type SatelliteConfig = Either<SatelliteId, SatelliteIds> &
    CliConfig &
    SatelliteConfigOptions;
