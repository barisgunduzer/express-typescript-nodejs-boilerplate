import { IEntityBase } from '@api/entities/Abstracts/Interfaces/IEntityBase';

export abstract class EntityBase implements IEntityBase {
  fromDto(dto: any): any {
    Object.assign(this, dto);
    return this;
  }

  toDto(): any {
    return this;
  }
}
