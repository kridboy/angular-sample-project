import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = []
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {
  }

  addToCart(theCartItem: CartItem) {
    let found: boolean;
    //type is either undefined or CartItem
    let existingCartItem:CartItem | undefined;
    // for(let item of this.cartItems){
    //   if(theCartItem.id===item.id){
    //     item.quantity+=theCartItem.quantity;
    //     found=true;
    //     break;
    //   }
    // }
    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)

    found = existingCartItem != undefined;

    if (found)
      //we can safely assert not-undefined because we are explicitly checking this in conditional above
      existingCartItem!.quantity += theCartItem.quantity;
    else
      this.cartItems.push(theCartItem)


    this.updateCartTotals()
  }

  updateCartTotals() {
    let tempTotal: number = 0;
    let tempQuantity: number = 0;
    for (let item of this.cartItems) {
      tempTotal += item.unitPrice * item.quantity;
      tempQuantity += item.quantity;
    }

    this.totalPrice.next(tempTotal);
    this.totalQuantity.next(tempQuantity);
  }

  removeItemFromCart(item: CartItem) {
    if (confirm('Are you sure you want to delete this item?')) {
      for (let i = 0; i < this.cartItems.length; i++) {
        if (item.id === this.cartItems[i].id) {
          this.cartItems.splice(i, 1)
          break;
        }
      }
    } else {
      item.quantity = 1
    }
  }

  incrementItemQuantity(tempCartItem: CartItem) {
    tempCartItem.quantity++
    this.updateCartTotals();
  }

  decrementItemQuantity(tempCartItem: CartItem) {
    if (--tempCartItem.quantity === 0)
      this.removeItemFromCart(tempCartItem)
    else
      this.updateCartTotals();
  }
}
