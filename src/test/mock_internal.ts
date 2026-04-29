/**
 * @internal
 */
export const internalConst = 'internal';

/**
 * Visible const
 */
export const visibleConst = 'visible';

/**
 * @internal
 */
export class InternalClass {}

export class VisibleClass {
  /**
   * Internal constructor
   * @internal
   */
  constructor() {}

  /**
   * @internal
   */
  internalMethod() {}

  visibleMethod() {}
}

export enum MixedEnum {
  /**
   * @internal
   */
  INTERNAL = 'INTERNAL',
  VISIBLE = 'VISIBLE'
}

/**
 * @internal
 */
export interface InternalInterface {
  prop: string;
}

/**
 * @internal
 */
export type InternalType = string;
