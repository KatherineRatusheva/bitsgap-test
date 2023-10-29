import { observable, computed, action, makeObservable } from "mobx";
import type { OrderSide, Profit } from "../model";

export class PlaceOrderStore {
  constructor() {
    makeObservable(this);
  }

  @observable activeOrderSide: OrderSide = "buy";
  @observable price = 0;
  @observable amount = 0;
  @observable isTakeProfitEnabled = false;
  @observable profitCount = 1;
  @observable projectedProfit = 0;
  @observable profitRows = [] as Profit[];
  @observable errors = [] as string[];
  @observable errorRows = new Set<number>();

  @computed get total(): number {
    return this.price * this.amount;
  }

  @computed get startingPrice(): number {
    return this.activeOrderSide === "buy" ? this.price + (this.price * 2) / 100 : this.price - (this.price * 2) / 100;
  }

  @computed get columns(): string[] {
    return ['Profit', 'Target price', this.activeOrderSide === "buy" ? `Amount to buy` : `Amount to sell`];
  }

  @action
  public setOrderSide = (side: OrderSide) => {
    this.activeOrderSide = side;
  };

  @action
  public setPrice = (price: number) => {
    this.price = price;
  };

  @action
  public setAmount = (amount: number) => {
    this.amount = amount;
  };

  @action
  public setTotal = (total: number) => {
    this.amount = this.price > 0 ? total / this.price : 0;
  };

  @action
  public setTakeProfitEnabled = (value: boolean) => {
    this.isTakeProfitEnabled = value;
  };

  @action
  public setProfitCount = (value: number) => {
    this.profitCount = value;
  };

  @action
  public setProjectedProfit = (value: number) => {
    this.projectedProfit = value;
  };

  @action
  public setProfitRows = (value: Profit[]) => {
    this.profitRows = value;
  };

  @action
  public setErrors = (value: string[]) => {
    this.errors = value;
  };

  @action
  public setErrorRows = (value: Set<number>) => {
    this.errorRows = value;
  };
}
