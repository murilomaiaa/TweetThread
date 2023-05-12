import { Id } from './valueObjects/Id'

export abstract class Entity<Props> {
  public readonly id: Id
  protected props: Props

  protected constructor(props: Props, id?: Id) {
    this.props = props
    this.id = id ?? new Id()
  }
}
