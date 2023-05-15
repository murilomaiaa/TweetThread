import { Id } from './valueObjects/Id'

export abstract class Entity<Props> {
  protected _id: Id
  get id() {
    return this._id.toString()
  }

  protected props: Props

  protected constructor(props: Props, id?: Id) {
    this.props = props
    this._id = id ?? new Id()
  }
}
