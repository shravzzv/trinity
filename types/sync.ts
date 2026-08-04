export type PendingDeleteEntity = 'fast' | 'weightEntry'

export interface PendingDelete {
  /**
   * Unique identifier of this pending deletion.
   */
  id: string

  /**
   * The identifier of the entity that was deleted.
   */
  entityId: string

  /**
   * The type of entity that was deleted.
   */
  entity: PendingDeleteEntity

  /**
   * When the deletion occurred locally.
   */
  deletedAt: string
}
