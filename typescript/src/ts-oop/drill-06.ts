interface Payment {
  pay(amount: number): void;
}

class CashPayment implements Payment {
  pay(amount: number): void {
    console.log("Paid " + amount + " using cash");
  }
}

class CardPayment implements Payment {
  pay(amount: number): void {
    console.log("Paid " + amount + " using card");
  }
}

const cash = new CashPayment();
cash.pay(100);

const card = new CardPayment();
card.pay(200);