import { randomUUID } from 'node:crypto'

export class Id {
  private _value: string

  constructor(id?: string) {
    this._value = id ?? randomUUID()
  }

  public toString() {
    return this._value
  }
}
