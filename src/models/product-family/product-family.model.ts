import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { CostCenter } from '../cost-center/cost-center.model';
import { WithClassId } from '../decorators/withClassId.decorator';
import { RegisteredForGui } from '../decorators/registeredForGui.decorator';
import { commonFunctions } from '@martinferra/common';

@Exclude()
@WithClassId('ProductFamily')
export class ProductFamily {
  constructor(
    name?: string
  ) {
    if (name) this.name = name;
  }

  @Expose()
  _id!: string;

  @Expose()
  name!: string;

  @Expose()
  @Type(() => CostCenterUsage)
  costCentersUsage!: CostCenterUsage[];

  price!: number;

  productsVariableCost!: number;

  projectedQ!: number;

  public get fixedCost(): number {
    return this.costCentersUsage
      .filter(usage => !usage.costCenter.isVariable)
      .reduce(
        (sum, usage) => sum + (usage.usagePercentage / 100) * (usage.qPercentage / 100) * usage.costCenter.totalCost,
      0
    );
  };

  public get variableCost(): number {
    return this.costCentersUsage
      .filter(usage => usage.costCenter.isVariable)
      .reduce(
        (sum, usage) => sum + (usage.usagePercentage / 100) * (usage.qPercentage / 100) * usage.costCenter.totalCost / this.projectedQ,
      0
    ) + this.productsVariableCost;
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
  @Transform((params: any) => commonFunctions.replaceById(params.value), { toPlainOnly: true })
  costCenter!: CostCenter;

  @Expose()
  usagePercentage!: number;

  @Expose()
  qPercentage!: number;
}
