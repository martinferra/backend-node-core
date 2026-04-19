import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { WithClassId } from '../decorators/withClassId.decorator';
import { Input } from '../input/input.model';
import { ProductFamily } from '../product-family/product-family.model';
import { replaceById } from '../../../packages/common/commonFunctions';

@Exclude()
@WithClassId('Product')
export class Product {
  constructor(
    name?: string,
    sku?: string,
    unitPrice?: number,
    projectedUnitsQ?: number,
    inputs?: Input[]
  ) {
    if (name) this.name = name;
    if (sku) this.sku = sku;
    if (unitPrice) this.unitPrice = unitPrice;
    if (projectedUnitsQ) this.projectedUnitsQ = projectedUnitsQ;
    if (inputs) this.inputs = inputs;
  }

  @Expose()
  _id!: string;

  @Expose()
  name!: string;

  @Expose()
  sku!: string;

  @Expose()
  @Type(() => ProductFamily)
  @Transform((params: any) => replaceById(params.value), { toPlainOnly: true })
  productFamily!: ProductFamily;

  @Expose()
  unitPrice!: number;

  @Expose()
  unitPriceForResellers!: number;

  @Expose()
  projectedUnitsQ!: number;

  @Expose()
  projectedUnitsQForResellers!: number;

  @Expose()
  @Type(() => Input)
  @Transform((params: any) => params.value?.map((input: Input) => replaceById(input)), { toPlainOnly: true })
  inputs!: Input[];

  // Weight in grams by unit
  @Expose()
  weight!: number;

  // Variable cost by kg (not units)
  public get variableCost(): number {
    return this.inputs?.reduce((sum: number, input: Input) => sum + (input.cost ?? 0), 0) ?? 0;
  }

  private get totalProjectedUnitsQ(): number {
    return (this.projectedUnitsQ ?? 0) + (this.projectedUnitsQForResellers ?? 0);
  }

  // Projected Q in kg (not units)
  public get projectedQ(): number {
    return this.totalProjectedUnitsQ * (this.weight ?? 0) / 1000;
  }

  // Price by kg (not units)
  public get price(): number {
    return ((
      (this.unitPrice ?? 0)*this.projectedUnitsQ +
      (this.unitPriceForResellers ?? 0)*this.projectedUnitsQForResellers
    )/this.totalProjectedUnitsQ) * 1000 / (this.weight ?? 1);
  }
}
