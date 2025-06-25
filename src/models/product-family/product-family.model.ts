import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { CostCenter } from '../cost-center/cost-center.model';
import { WithClassId } from '../decorators/withClassId.decorator';
import { RegisteredForGui } from '../decorators/registeredForGui.decorator';
import { replaceById } from 'common/commonFunctions';

@Exclude()
@WithClassId('ProductFamily')
export class ProductFamily {
  constructor(
    name?: string,
    price?: number,
    variableCost?: number,
    projectedQ?: number
  ) {
    if (name) this.name = name;
    if (price) this.price = price;
    if (variableCost) this.variableCost = variableCost;
    if (projectedQ) this.projectedQ = projectedQ;
  }

  @Expose()
  _id!: string;

  @Expose()
  name!: string;

  @Expose()
  price!: number;

  @Expose()
  variableCost!: number;

  @Expose()
  projectedQ!: number;

  @Expose()
  @Type(() => CostCenterUsage)
  costCentersUsage!: CostCenterUsage[];

  public get fixedCost(): number {
    return this.costCentersUsage.reduce(
      (sum, usage) => sum + (usage.usagePercentage / 100) * usage.costCenter.totalCost,
      0
    );
  };

  public get breakEvenQ(): number {
    return this.fixedCost / (this.price - this.variableCost);
  };

  public get breakEvenValue(): number {
    return this.breakEvenQ * this.price;
  }
}

@RegisteredForGui('CostCenterUsage', { newEdit: 'CostCenterUsageNewEditComponent' })
@Exclude()
export class CostCenterUsage {
  @Expose()
  @Type(() => CostCenter)
  @Transform((params: any) => replaceById(params.value), { toPlainOnly: true })
  costCenter!: CostCenter;

  @Expose()
  usagePercentage!: number;
}
