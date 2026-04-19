import { Exclude, Expose } from 'class-transformer';
import { WithClassId } from '../decorators/withClassId.decorator';

@Exclude()
@WithClassId('Input')
export class Input {
  constructor(
    name?: string,
    sku?: string,
    cost?: number,
  ) {
    if (name) this.name = name;
    if (sku) this.sku = sku;
    if (cost) this.cost = cost;
  }

  @Expose()
  _id!: string;

  @Expose()
  name!: string;

  @Expose()
  sku!: string;

  @Expose()
  cost!: number;
}
