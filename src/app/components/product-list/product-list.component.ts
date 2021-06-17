import {Component, OnInit} from '@angular/core';
import {GetResponseProducts, ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-list',
  //templateUrl: './product-list.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = []
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = 'Books';
  searchMode: boolean = false;
  thePreviousKeyword = '';
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  //injection happens here
  constructor(private productService: ProductService,
              private cartService:CartService,
              private route: ActivatedRoute) {
  }

  //kind of like postconstruct
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })

  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    console.log(this.searchMode)
    if (this.searchMode)
      this.handleSearchProducts();
    else
      this.handleListProducts()

    console.log('pagenumber after all is done: ' + this.thePageNumber)
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    const hasCategoryName: boolean = this.route.snapshot.paramMap.has('name');

    if (hasCategoryId) {
      //+ symbol for casting to number and ! for non-null-assertion (we're checking with bool above)
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    this.currentCategoryName = hasCategoryName ? this.route.snapshot.paramMap.get('name')! : 'Books';
    // with ternary = this.currentCategoryId=hasCategoryId?+this.route.snapshot.paramMap.get('id'):1;


    if (this.previousCategoryId != this.currentCategoryId)
      this.thePageNumber = 1;

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(this.processResult());

  }

  updatePageSize(updatedPageSize: string) {
    console.log(updatedPageSize);
    this.thePageSize = +updatedPageSize;
    this.listProducts();
  }

  private handleSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get('keyword')!;
    if (this.thePreviousKeyword != keyword) {
      this.thePageNumber = 1

    }


    this.thePreviousKeyword = keyword

    this.productService.searchProductsPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      keyword).subscribe(this.processResult());
    // this.productService.searchProducts(keyword).subscribe(
    //   data => {
    //     this.products = data
    //   }
    // }

  }

  private processResult() {
    //We can't use implicit any type, we need to define any properly or completely declare what data will be (even though this is done in interface)
    return (data: GetResponseProducts) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct:Product) {
    console.log(`adding product: ${theProduct.name} || €${theProduct.unitPrice}`)
    let cartItem:CartItem=new CartItem(theProduct,1);
    this.cartService.addToCart(cartItem);

  }
}

