import { getLocalStorage, setLocalStorage } from "./utils.mjs";

import ExternalServices from "./ExternalServices.mjs";

 const services = new ExternalServices();

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
function packageItems(items) {
  // convert the list of products from localStorage to the simpler form required for the checkout process.
   const simplifiedItems = items.map((item) => {
    console.log(item);
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: 1,
    };
  });
  return simplifiedItems;
  // An Array.map would be perfect for this process.
        
}

// takes a form element and returns an object where the key is the "name" of the form input.
function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}
export default class CheckoutProcess{

constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total amount of the items in the cart, and the number of items.
    const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal"
    );
    const itemNumElement = document.querySelector(
      this.outputSelector + " #num-items"
    );
    itemNumElement.innerText = this.list.length;
    // calculate the total of all the items in the cart
    const amounts = this.list.map((item) => item.FinalPrice);
    this.itemTotal = amounts.reduce((sum, item) => sum + item);
    summaryElement.innerText = `$${this.itemTotal}`;;
  }

    calculateItemSubTotal() {
        let totalItems = 0;
  
        if(this.list && this.list.length > 0){
            this.list.forEach(item => {
                 this.itemTotal += item.FinalPrice;
                 totalItems += item.quantity || 1;
            });
        }
       
    // calculate and display the total dollar amount of the items in the cart, and the number of items.
    
  }

  calculateOrderTotal() {
    // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
    this.tax = this.itemTotal * 0.06;
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.orderTotal = parseFloat(this.itemTotal) + parseFloat(this.tax) + parseFloat(this.shipping);


    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const tax = document.querySelector(`${this.outputSelector} #tax`);

    tax.innerText = `$${this.tax.toFixed(2)}`;

    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    const date = document.querySelector(`${this.outputSelector} #date-order`);
    date.innerText=new Date().toISOString();
  }

  async checkout() {
    const formElement = document.forms["checkout"];
    const order = formDataToJSON(formElement);

    // convert the form data to a JSON order object using the formDataToJSON function
    // populate the JSON order object with the order Date, orderTotal, tax, shipping, and list of items
    // call the checkout method in the ExternalServices module and send it the JSON order data.
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal;
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = packageItems(this.list);
    //console.log(order);

    try {
       
      const response = await services.checkout(order);
      
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

        
        
    
}