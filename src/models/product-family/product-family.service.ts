import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DataService } from '../data.service';
import { AsyncTasksService } from '../../reports/async-tasks.service';
import { ProductFamily } from './product-family.model';
import { Product } from '../product/product.model';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductFamilyService extends DataService {
  constructor(
    http: HttpClient,
    asyncTasksService: AsyncTasksService,
    private productService: ProductService
  ) {
    super(http, asyncTasksService);
  }

  getModel(): string {
    return 'productfamily';
  }

  getMainEntityClass(): any {
    return ProductFamily;
  }

  findGridData(query?: any): Observable<any> {
    let _query: any = {
      filter: query ?? {},
      populateOpts: [{ path:'costCentersUsage.costCenter' }]
    };
    return this.find(_query);
  }

  findAutocompleteOptions(queryData: any, discriminator?: string): Observable<any> {
    return this.find(queryData, 'findAutocompleteOptions', discriminator)
  }

  private getProducts(productFamily: ProductFamily): Observable<Product[]> {
    return this.productService.find(
      {
        filter: { productFamily: { $oid: productFamily._id } },
        populateOpts: [{ path: 'inputs' }]
      }
    );
  }

  getWithProductSum(productFamily: ProductFamily): Observable<ProductFamily> {
    return this.getProducts(productFamily).pipe(
      map((products: Product[]) => {
        productFamily.projectedQ = products.reduce(
          (sum, product) => sum + (product.projectedQ ?? 0)
          , 0
        );
        productFamily.productsVariableCost = products.reduce(
          (sum, product) => sum + 
            ((product.variableCost ?? 0) * product.projectedQ / (productFamily.projectedQ || 1))
          , 0
        );
        productFamily.price = products.reduce(
          (sum, product) => sum + 
            ((product.price ?? 0) * product.projectedQ / (productFamily.projectedQ || 1))
          , 0
        );
        return productFamily;
      })
    )
  }

  /* findWithProjectedQ(query?: any, discriminator?: string): Observable<any> {
    let url = this.getUri() + '/findWithProjectedQ';
    if (discriminator) {
      url += '?discriminator=' + encodeURIComponent(discriminator);
    }
    return this.http.post<any>(url, query ?? {});
  } */
}
