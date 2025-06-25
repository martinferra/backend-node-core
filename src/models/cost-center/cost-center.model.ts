import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CostCenter {
  constructor(name?: string, totalCost?: number) {
    if (name) this.name = name;
    if (totalCost) this.totalCost = totalCost;
  }

  @Expose()
  _id!: string;

  @Expose()
  name!: string;

  @Expose()
  totalCost!: number;
}
