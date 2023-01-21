import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IProducts } from '../../models/products';

import { ProductsService } from '../../services/products.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private ProductsService: ProductsService,
    public dialog: MatDialog
  ) {}

  products: IProducts[];
  productsSubcription: Subscription;

  basket: IProducts[];
  basketSubcription: Subscription;

  canEdit: boolean = false;
  canView: boolean = false;

  ngOnInit(): void {
    // .....
    this.canEdit = true;

    this.productsSubcription = this.ProductsService.getProducts().subscribe(
      (data) => {
        this.products = data;
      }
    );

    this.basketSubcription =
      this.ProductsService.getProductFromBasket().subscribe((data) => {
        this.basket = data;
      });
  }

  addToBasket(product: IProducts) {
    product.quantity = 1;
    let findItem;
    if (this.basket.length > 0) {
      findItem = this.basket.find((item) => item.id === product.id);
      if (findItem) this.updateToBasket(findItem);
      else this.postToBasket(product);
    } else this.postToBasket(product);
  }

  postToBasket(product: IProducts) {
    this.ProductsService.postProductToBasket(product).subscribe((data) =>
      this.basket.push(data)
    );
  }

  updateToBasket(product: IProducts) {
    product.quantity += 1;
    this.ProductsService.updateProductToBasket(product).subscribe((data) => {});
  }

  deleteItem(id: number) {
    this.ProductsService.deleteProduct(id).subscribe(() =>
      this.products.find((item) => {
        if (id === item.id) {
          let idx = this.products.findIndex((data) => data.id === id);
          this.products.splice(idx, 1);
        }
      })
    );
  }

  // openDialog(): void {
  // const dialogRef = this.dialog.open(DialogBoxComponent, {
  //   width: '700px',
  //   data: 77777,
  // });
  // }
  openDialog(product?: IProducts): void {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    dialogConfig.data = product;

    const dialogRef = this.dialog.open(DialogBoxComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);

      if (data) {
        if (data && data.id) this.updateData(data);
        else this.postData(data);
      }
    });
  }
  // updateData(data: any) {
  //   throw new Error('Method not implemented.');
  // }

  postData(data: IProducts) {
    this.ProductsService.postProduct(data).subscribe((data) =>
      this.products.push(data)
    );
  }

  updateData(product: IProducts) {
    this.ProductsService.updateProduct(product).subscribe((data) => {
      this.products = this.products.map((product) => {
        console.log(product);
        if (product.id === data.id) return data;
        else return product;
      });
    });
  }

  ngOnDestroy() {
    if (this.productsSubcription) this.productsSubcription.unsubscribe();
    if (this.basketSubcription) this.basketSubcription.unsubscribe();
  }
}
