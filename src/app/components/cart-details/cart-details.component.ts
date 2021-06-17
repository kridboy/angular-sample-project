import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.listCartDetails();
  }

  private listCartDetails() {
    //obviously this will make this the same object as in cartservice! (however we will still delegate logic to service class ;) )
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data)
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data)
    this.cartService.updateCartTotals()
  }

  setItemQuantity(item: CartItem, i: number) {
    if (i === 0)
      this.removeItemFromCart(item);
    else
      item.quantity = i;

    this.cartService.updateCartTotals();
  }

  removeItemFromCart(item: CartItem) {
    this.cartService.removeItemFromCart(item)
  }

  incrementItemQuantity(tempCartItem: CartItem) {
    this.cartService.incrementItemQuantity(tempCartItem)
  }

  decrementItemQuantity(tempCartItem: CartItem) {
    this.cartService.decrementItemQuantity(tempCartItem)
  }

}
