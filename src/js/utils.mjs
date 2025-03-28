// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}


export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param)
  return product;
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false){
    if(clear) parentElement.innerHTML = "";
    parentElement.insertAdjacentHTML(position, list.map(templateFn).join(""));
}

export function renderWithTemplate(template, parentElement, data, callback){
    parentElement.innerHTML = template;
    if(callback) {
      callback(data);
    }
}



export async function loadTemplate(path){
    const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter(){
    
   const headerTemplate = await loadTemplate("../partials/header.html");
   
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
 
  const footerElement = document.querySelector("#main-footer");

  const cartItems = getLocalStorage("so-cart") || [];
  
  renderWithTemplate(headerTemplate, headerElement,cartItems,updateCartCount);
  renderWithTemplate(footerTemplate, footerElement);

    
    
}


export function updateCartCount(cartItems) {
  // Get cart items from localStorage (or initialize an empty array if none exist)
 

  // Calculate the total number of items in the cart
  let totalItems = 0;
  cartItems.forEach(item => {
    totalItems += item.quantity || 1; // Add item quantity, default to 1 if not defined
  });

  // Select the <em> element
  const cartCountElement = document.querySelector(".cart em");

  // Update the <em> element"s content with the total number of items
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}



export function alertMessage(message, scroll = true) {
  // create element to hold the alert
  const alert = document.createElement("div");

  // add a class to style the alert
  alert.classList.add("alert");
  alert.classList.add("alert-warning");
  
  alert.innerHTML = `${message} <button id="close"> X </button>`;
  
  // set the contents. You should have a message and an X or something the user can click on to remove
   // add the alert to the top of main
  const main = document.querySelector("main");
  
  main.prepend(alert);
  // add a listener to the alert to see if they clicked on the X
  // if they did then remove the child
  document.querySelector("#close").addEventListener("click", function(e) {
      //can you tell if they clicked on the X or on something else?  hint: check out e.target.tagName or e.target.innerText
        main.removeChild(alert);
      
  })
 
  // make sure they see the alert by scrolling to the top of the window
  // you may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if(scroll)
    window.scrollTo(0,0);
}

export function updateCartIcon() {
  const cartItems =  getLocalStorage("so-cart") || []; // Get cart items from localStorage
   let totalItems = 0;
  cartItems.forEach(item => {
    totalItems += item.quantity || 1; // Add item quantity, default to 1 if not defined
  });

  const cartIcon = document.querySelector(".cart em"); // Assuming you have a class 'cart-count' on your cart icon element

  if (cartIcon) {
     cartIcon.textContent = "";
    cartIcon.textContent = totalItems;
  }
}