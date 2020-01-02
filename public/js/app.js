// var MongoClient = require('mongodb').MongoClient;	// require the mongodb driver

// /**
//  * Uses mongodb v3.1.9 - [API Documentation](http://mongodb.github.io/node-mongodb-native/3.1/api/)
//  * StoreDB wraps a mongoDB connection to provide a higher-level abstraction layer
//  * for manipulating the objects in our bookstore app.
//  */

// function StoreDB(mongoUrl, dbName){
// 	if (!(this instanceof StoreDB)) return new StoreDB(mongoUrl, dbName);
// 	this.connected = new Promise(function(resolve, reject){
// 		MongoClient.connect(
// 			mongoUrl,
// 			{
// 				useNewUrlParser: true
// 			},
// 			function(err, client){
// 				if (err) reject(err);
// 				else {
// 					console.log('[MongoClient] Connected to '+mongoUrl+'/'+dbName);
// 					resolve(client.db(dbName));
// 				}
// 			}
// 		)
// 	});
// }



// StoreDB.prototype.getProducts = function(queryParams){
// 	return this.connected.then(function(db){
//         var result = db.products;
// 		if ("minPrice" in queryParams) {
//             function checkMinPrice(product) {
//                 return product.price && product.price >= queryParams["minPrice"];
//             }
//             result.filter(checkMinPrice);
//         }
//         if ("maxPrice" in queryParams) {
//             function checkMaxPrice(product) {
//                 return product.price && product.price <= queryParams["maxPrice"];
//             }
//             result.filter(checkMaxPrice);
//         }
//         if ("category" in queryParams) {
//             function checkCategory(product) {
//                 return product.category && product.category == queryParams["category"];
//             }
//             result.filter(checkCategory);
//         }
// 	})
// }

// StoreDB.prototype.addOrder = function(order){
// 	return this.connected.then(function(db){
// 		// TODO: Implement functionality
// 	})
// }

// module.exports = StoreDB;

var displayed = [];

/*
assignment-4 #1
*/

function Store(serverUrl) {
    this.serverUrl = serverUrl;
    this.stock = {};
    this.cart = {};
    this.onUpdate = null;

}
Store.prototype.addItemToCart = function (itemName) {
    inactiveTime = 0;
    console.log("add item", itemName, this.stock[itemName]['quantity']);
    if (this.stock[itemName]['quantity'] <= 0) {
        alert("Sorry, this item is out of stock!");
        return;
    }
    if (itemName in this.cart) {
        this.cart[itemName] += 1;
    } else {
        this.cart[itemName] = 1;
    }
    this.stock[itemName]['quantity'] -= 1;
    this.onUpdate(itemName);
};
Store.prototype.removeItemFromCart = function (itemName) {
    if (itemName in this.cart) {
        this.cart[itemName] -= 1;
        this.stock[itemName]['quantity'] += 1;
        if (this.cart[itemName] === 0) {
            delete this.cart[itemName];
        }
    } else {
        alert("Your cart does not have this item!");
    }
    inactiveTime = 0;
    this.onUpdate(itemName);
};

//var store = new Store("https://cpen400a-bookstore.herokuapp.com");
var store = new Store("http://localhost:3000");
/*
assignment-3 #3. assign function to onUpdate property
*/
store.onUpdate = function (itemName) {
    if (!itemName) {
        var productView = document.getElementById("productView");
        renderProductList(productView, this);
    } else {
        var list_item = document.getElementById("product-" + itemName)
        renderProduct(list_item, this, itemName);
    }
    var modalContent = document.getElementById("modal-content");
    renderCart(modalContent, this);

    //assignment5-1-F
    var menuView = document.getElementById("menuView");
    renderMenu(menuView, this);
}

/*
assignment-2 #6.Implement a function with 
the signature showCart(cart) 
*/
function showCart(cart) {
    var cart_info = "";
    for (var key in cart) {
        if (cart.hasOwnProperty(key)) {
            cart_info += key + " : " + cart[key] + "\n";
        }
    }
    var modal = document.getElementById("modal");
    modal.style.display = "block";
    var modalContent = document.getElementById("modal-content");
    renderCart(modalContent, store)
    inactiveTime = 0;
}
/*
assignment-3 #4.cart modal upgrade
*/
function renderCart(container, storeInstance) {
    console.log("update cart", storeInstance);
    var cartTable = document.createElement("table");
    var cartItemsTable = document.createElement("table");
    var cartItemsTableRow1 = document.createElement("tr");
    var cartItemsTableRow1Col1 = document.createElement("td");
    cartItemsTableRow1Col1.textContent = "name";
    var cartItemsTableRow1Col2 = document.createElement("td");
    cartItemsTableRow1Col2.textContent = "quantity";
    var cartItemsTableRow1Col3 = document.createElement("td");
    cartItemsTableRow1Col3.textContent = "price";
    var cartItemsTableRow1Col4 = document.createElement("td");
    cartItemsTableRow1Col4.textContent = "add / delete";
    cartItemsTableRow1.appendChild(cartItemsTableRow1Col1);
    cartItemsTableRow1.appendChild(cartItemsTableRow1Col2);
    cartItemsTableRow1.appendChild(cartItemsTableRow1Col3);
    cartItemsTableRow1.appendChild(cartItemsTableRow1Col4);
    cartTable.appendChild(cartItemsTableRow1);
    var totalPrice = 0;
    for (var key in storeInstance.cart) {
        if (storeInstance.cart.hasOwnProperty(key)) {
            var cartItemsTableRowN = document.createElement("tr");
            cartItemsTableRowN.setAttribute("id", key);
            var cartItemsTableRowNCol1 = document.createElement("td");
            cartItemsTableRowNCol1.textContent = storeInstance.stock[key].label;
            var cartItemsTableRowNCol2 = document.createElement("td");
            cartItemsTableRowNCol2.textContent = storeInstance.cart[key];
            var cartItemsTableRowNCol3 = document.createElement("td");
            cartItemsTableRowNCol3.textContent = storeInstance.cart[key] * storeInstance.stock[key].price;
            totalPrice += storeInstance.cart[key] * storeInstance.stock[key].price;
            var cartItemsTableRowNCol4 = document.createElement("td");
            var addOne = document.createElement("button");
            addOne.setAttribute("class", "addOne");
            addOne.textContent = "+";
            //addOne.addEventListener("click", storeInstance.addItemToCart(key));
            var delOne = document.createElement("button");
            delOne.setAttribute("class", "delOne");
            //addOne.addEventListener("click", storeInstance.removeItemFromCart(key));
            delOne.textContent = "-";
            cartItemsTableRowNCol4.append(addOne);
            cartItemsTableRowNCol4.append(delOne);
            cartItemsTableRowN.appendChild(cartItemsTableRowNCol1);
            cartItemsTableRowN.appendChild(cartItemsTableRowNCol2);
            cartItemsTableRowN.appendChild(cartItemsTableRowNCol3);
            cartItemsTableRowN.appendChild(cartItemsTableRowNCol4);
            cartTable.appendChild(cartItemsTableRowN);
        }
    }
    var cartItemsTableRowLast = document.createElement("tr");
    var cartItemsTableRowLastCol1 = document.createElement("td");
    cartItemsTableRowLastCol1.textContent = "Total Price";
    var cartItemsTableRowLastCol2 = document.createElement("td");
    cartItemsTableRowLastCol2.textContent = "";
    var cartItemsTableRowLastCol3 = document.createElement("td");
    cartItemsTableRowLastCol3.textContent = totalPrice;
    var cartItemsTableRowLastCol4 = document.createElement("td");
    cartItemsTableRowLastCol4.textContent = "";
    cartItemsTableRowLast.appendChild(cartItemsTableRowLastCol1);
    cartItemsTableRowLast.appendChild(cartItemsTableRowLastCol2);
    cartItemsTableRowLast.appendChild(cartItemsTableRowLastCol3);
    cartItemsTableRowLast.appendChild(cartItemsTableRowLastCol4);
    cartTable.appendChild(cartItemsTableRowLast);
    while (container.firstChild) container.firstChild.remove();
    container.appendChild(cartTable);
    var btnCheckOut = document.createElement("button");
    btnCheckOut.setAttribute("id", "btn-check-out");
    btnCheckOut.textContent = "Check out";
    container.appendChild(btnCheckOut);
    btnCheckOut.addEventListener("click", function () {
        event.target.disabled = true;
        storeInstance.checkOut();
    });
}

/*
assignment-3 #5.cart modal show and close
*/
function hideCart() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
}

/*
assignment-2 #7 Timer set
*/
var inactiveTime = 0;
setInterval(function () {
    //setInterval is better than setTimeOut    
    //alert("timer on");
    inactiveTime += 1;
    if (inactiveTime === 1800) {
        alert("Hey there! Are you still planning to buy something?");
        inactiveTime = 0;
    }
}, 1000);

/*
assignment-3 #1 Functions renderProduct & renderProductList
*/
function renderProduct(container, storeInstance, itemName) {
    var product_container = document.createElement("div");
    product_container.setAttribute("class", "container");
    var product_img = document.createElement("img");
    product_img.setAttribute("class", "product_img");
    // console.log(itemName)
    // console.log(storeInstance.stock[itemName])
    product_img.setAttribute("src", storeInstance.stock[itemName].imageUrl);
    product_container.appendChild(product_img);

    var price = document.createElement("p");
    price.setAttribute("class", "price");
    price.appendChild(document.createTextNode("$" + storeInstance.stock[itemName].price));
    product_container.appendChild(price);

    var span = document.createElement("span");
    span.appendChild(document.createTextNode(storeInstance.stock[itemName].label));
    product_container.appendChild(span);
    var item_control = document.createElement("div");
    item_control.setAttribute("class", "item_control");
    product_container.appendChild(item_control);

    var add_button = document.createElement("button");
    add_button.setAttribute("class", "btn-add");
    add_button.appendChild(document.createTextNode("Add to Cart"));
    var remove_button = document.createElement("button");
    remove_button.setAttribute("class", "btn-remove");
    remove_button.appendChild(document.createTextNode("Remove from Cart"));

    if (storeInstance.stock[itemName]['quantity'] > 0) {
        item_control.appendChild(add_button);
    } else {
        if (item_control.contains(add_button)) {
            item_control.removeChild(add_button);
        }
    }
    if (!storeInstance.cart[itemName] || storeInstance.cart[itemName] === 0) {
        if (item_control.contains(remove_button)) {
            item_control.removeChild(remove_button);
        }
    } else {
        item_control.appendChild(remove_button);
    }
    while (container.firstChild) container.firstChild.remove();
    container.appendChild(product_container);
}

function renderProductList(container, storeInstance) {
    var product_list = document.createElement("ul");
    product_list.setAttribute("class", "flex-container");
    product_list.setAttribute("id", "productList");
    //for (var item_name in storeInstance.stock) {
    for (let item=0; item<displayed.length; item++) {
        var item_name = displayed[item];
        if (storeInstance.stock.hasOwnProperty(item_name)) {
            var list_item = document.createElement("li");
            list_item.setAttribute("id", "product-" + item_name);
            list_item.setAttribute("class", "product");
            renderProduct(list_item, storeInstance, item_name);
            product_list.appendChild(list_item);
        }
    }
    while (container.firstChild) container.firstChild.remove();
    container.appendChild(product_list);
}

var productView = document.getElementById("productView");
renderProductList(productView, store);

document.body.addEventListener("click", function () {
    if (event.target.className == "btn-add") {
        let product_name = event.target.parentNode.parentNode.parentNode.id;
        product_name = product_name.replace('product-', '');
        store.addItemToCart(product_name);
        renderProductList(productView, store);
    }
    if (event.target.className == "btn-remove") {
        let product_name = event.target.parentNode.parentNode.parentNode.id;
        product_name = product_name.replace('product-', '');
        store.removeItemFromCart(product_name);
        renderProductList(productView, store);
    }
    if (event.target.className == "addOne") {
        let product_name = event.target.parentNode.parentNode.id;
        store.addItemToCart(product_name);
        renderCart(document.getElementById("modal-content"), store);
        renderProductList(productView, store);
    }
    if (event.target.className == "delOne") {
        let product_name = event.target.parentNode.parentNode.id;
        store.removeItemFromCart(product_name);
        renderCart(document.getElementById("modal-content"), store);
        renderProductList(productView, store);
    }
    if (event.target.id == "btn-show-cart") {
        showCart(store.cart);
    }
    if (event.target.id == "btn-hide-cart") {
        hideCart();
    }
})

document.addEventListener("keydown", function () {
    if (event.keyCode === 27) {
        hideCart();
    }
    // do something
});


var ajaxGet = function (url, onSuccess, onError) {
    var count = 0;
    var sendRequest = function () {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            if (xhttp.status == 200) {
                var response = JSON.parse(xhttp.responseText);
                onSuccess(response);
            } else {
                count++;
                if (count == 3) {
                    onError(xhttp.status);
                } else {
                    sendRequest();
                }
            }
        };
        xhttp.ontimeout = function () {
            count++;
            if (count == 3) {
                onError("timeout error");
            } else {
                sendRequest();
            }
        }
        xhttp.onerror = function () {
            count++;
            if (count == 3) {
                onError("network error");
            } else {
                sendRequest();
            }
        }
        xhttp.open("GET", url, true);
        xhttp.timeout = 5000;
        xhttp.send();
    }
    sendRequest();
}

/*
assignment-4 #3
*/
var preProducts = {};

Store.prototype.syncWithServer = function (onSync) {
    var that = this;
    var delta = {};

    ajaxGet(this.serverUrl + "/products",
        function (response) {
            var currentProducts = response;
            console.log("preProducts", preProducts);
            console.log("currentProducts", currentProducts);
            console.log("cart", that.cart);

            // create delta object for each product in response
            for (let currentProduct in currentProducts) {
                delta[currentProduct] = {}
                if (currentProduct in preProducts) {
                    // set the delta for the price and quantity to be current value - previous value
                    delta[currentProduct].price = parseInt(currentProducts[currentProduct].price) - parseInt(preProducts[currentProduct].price);
                    if (currentProduct in that.cart) {
                        delta[currentProduct].quantity = (parseInt(currentProducts[currentProduct].quantity) + that.cart[currentProduct]) - parseInt(preProducts[currentProduct].quantity);
                    } else {
                        delta[currentProduct].quantity = parseInt(currentProducts[currentProduct].quantity) - parseInt(preProducts[currentProduct].quantity);
                    }
                } else {
                    delta[currentProduct].price = 0;
                    delta[currentProduct].quantity = 0;
                }
            }

            // update stock and cart values
            for (let currentProduct in currentProducts) {
                if (!(currentProduct in that.stock)) {
                    that.stock[currentProduct] = currentProducts[currentProduct];
                    that.stock[currentProduct].price = parseInt(that.stock[currentProduct].price);
                    that.stock[currentProduct].quantity = parseInt(that.stock[currentProduct].quantity);
                } else {
                    // if adding items, add additional products to stock
                    if (delta[currentProduct].quantity >= 0) {
                        that.stock[currentProduct].quantity += parseInt(delta[currentProduct].quantity);
                    } else {
                        // if removing items, remove from stock first, then remove from cart if necessary
                        var remainingQuantityFromStock = that.stock[currentProduct].quantity + parseInt(delta[currentProduct].quantity);
                        if (remainingQuantityFromStock >= 0) {
                            that.stock[currentProduct].quantity = remainingQuantityFromStock;
                        } else {
                            that.stock[currentProduct].quantity = 0;
                            if (currentProduct in that.cart) {
                                var remainingQuantityFromCart = that.cart[currentProduct].quantity + remainingQuantityFromStock;
                                that.cart[currentProduct] = (remainingQuantityFromCart < 0) ? 0 : remainingQuantityFromCart;
                            }
                        }
                    }
                }

                // if(currentProduct in that.cart){
                //     // if adding items, add additional products to stock
                //     console.log(currentProduct, that.cart[currentProduct])
                //     if (delta[currentProduct].quantity >= 0) {
                //         that.stock[currentProduct].quantity += delta[currentProduct].quantity;
                //     } else {
                //         // if removing items, remove from stock first, then remove from cart if necessary
                //         var remainingQuantityFromStock = that.stock[currentProduct].quantity + delta[currentProduct].quantity;
                //         if (remainingQuantityFromStock >= 0) {
                //             that.stock[currentProduct].quantity = remainingQuantityFromStock;
                //         } else {
                //             that.stock[currentProduct].quantity = 0;
                //             var remainingQuantityFromCart = that.cart[currentProduct] + remainingQuantityFromStock;
                //             that.cart[currentProduct] = (remainingQuantityFromCart < 0) ? 0 : remainingQuantityFromCart;
                //         }
                //     }
                //     console.log(currentProduct, that.cart[currentProduct])
                // }else{
                //     that.stock[currentProduct].quantity = currentProducts[currentProduct].quantity;
                // }
                // // price is always updated
                // that.stock[currentProduct].price = currentProducts[currentProduct].price;

            }
            console.log("delta", delta);
            console.log("stock", that.stock);
            preProducts = that.stock;
            if (onSync) {
                onSync(delta);
            }
            that.onUpdate();
        },
        function (error) {

        });


}

/*
assignment-4 #4A
*/
// var modal = document.getElementById("modal");
// var btnCheckOut = document.createElement("button");
// btnCheckOut.setAttribute("id","btn-check-out");
// btnCheckOut.textContent = "Check Out";
// modal.appendChild(btnCheckOut);
var Order = function(client_id, cart, total){
    this.client_id = client_id;
    this.cart = cart;
    this.total = total;
}

Store.prototype.checkOut = function (onFinish) {
    var that = this;
    this.syncWithServer(function (delta) {
        if (Object.keys(delta).length != 0) {
            var changes = "";
            for (var item in delta) {
                if (parseInt(delta[item].price) !== 0) changes += "Price of " + item + " changed from $" + (that.stock[item].price - delta[item].price) + " to $" + that.stock[item].price + "\n";
                if (parseInt(delta[item].quantity) !== 0) {
                    if (item in that.cart) {
                        changes += "Quantity of " + item + " changed from " + (that.cart[item] + that.stock[item].quantity - delta[item].quantity) + " to " + (that.cart[item] + that.stock[item].quantity) + "\n";
                    } else {
                        changes += "Quantity of " + item + " changed from " + (that.stock[item].quantity - delta[item].quantity) + " to " + (that.stock[item].quantity) + "\n";
                    }
                }
            }
            if (changes) {
                alert(changes);
                return;
            }
        }
        console.log("checkout");
        var client_id = String(Math.random());
        var total = 0;
        for (var item in that.cart) {
            //alert("The total amount is " + that.stock[item].quantity);
            total += that.cart[item] * that.stock[item].price;
        }
        
        var order = new Order(client_id, that.cart, total);
        ajaxPost(that.serverUrl +"/checkout", order, function(response){
            alert("Items are successfully checked out!");
            that.cart = {};
            that.onUpdate();
        }, function(error){
            alert("Items are unsuccessfully checked out!!");
        })
    });

    if (onFinish) { onFinish(); }
    document.getElementById("btn-check-out").disabled = false;
};

// var modal = document.getElementById("modal");
// var btnCheckOut = document.createElement("button");
// btnCheckOut.setAttribute("id","btn-check-out");
// btnCheckOut.textContent = "Check Out";
// modal.appendChild(btnCheckOut);

// document.getElementById("btn-check-out").addEventListener("click", function () {
//     //console.log("check out!");
//     event.target.disabled = true;
//     store.checkOut();    


// });
//This handler can not be put after store.syncWithServer(), why???

/*
assignment-5 #2D
*/
store.syncWithServer(function (delta) {
    if (Object.keys(delta).length != 0) {
        for(let key in delta){
            if (delta.hasOwnProperty(key)) {                
                displayed.push(key);
            }
        }
    } else {
        null;
    }
    var productView = document.getElementById("productView");
    renderProductList(productView, store);
});

/*
assignment-5 #2E-Copy from the link in the assignment
*/
Store.prototype.queryProducts = function (query, callback) {
    var self = this;
    var queryString = Object.keys(query).reduce(function (acc, key) {
        return acc + (query[key] ? ((acc ? '&' : '') + key + '=' + query[key]) : '');
    }, '');
    ajaxGet(this.serverUrl + "/products?" + queryString,
        function (products) {
            Object.keys(products)
                .forEach(function (itemName) {
                    var rem = products[itemName].quantity - (self.cart[itemName] || 0);
                    if (rem >= 0) {
                        self.stock[itemName].quantity = rem;
                    }
                    else {
                        self.stock[itemName].quantity = 0;
                        self.cart[itemName] = products[itemName].quantity;
                        if (self.cart[itemName] === 0) delete self.cart[itemName];
                    }

                    self.stock[itemName] = Object.assign(self.stock[itemName], {
                        price: products[itemName].price,
                        label: products[itemName].label,
                        imageUrl: products[itemName].imageUrl
                    });
                });
            self.onUpdate();
            callback(null, products);
        },
        function (error) {
            callback(error);
        }
    )
}

function renderMenu(container, storeInstance) {
    while (container.lastChild) container.removeChild(container.lastChild);
    if (!container._filters) {
        container._filters = {
            minPrice: null,
            maxPrice: null,
            category: ''
        };
        container._refresh = function () {
            storeInstance.queryProducts(container._filters, function (err, products) {
                if (err) {
                    alert('Error occurred trying to query products');
                    console.log(err);
                }
                else {
                    displayed = Object.keys(products);
                    renderProductList(document.getElementById('productView'), storeInstance);
                }
            });
        }
    }

    var box = document.createElement('div'); container.appendChild(box);
    box.id = 'price-filter';
    var input = document.createElement('input'); box.appendChild(input);
    input.type = 'number';
    input.value = container._filters.minPrice;
    input.min = 0;
    input.placeholder = 'Min Price';
    input.addEventListener('blur', function (event) {
        container._filters.minPrice = event.target.value;
        container._refresh();
    });

    input = document.createElement('input'); box.appendChild(input);
    input.type = 'number';
    input.value = container._filters.maxPrice;
    input.min = 0;
    input.placeholder = 'Max Price';
    input.addEventListener('blur', function (event) {
        container._filters.maxPrice = event.target.value;
        container._refresh();
    });

    var list = document.createElement('ul'); container.appendChild(list);
    list.id = 'menu';
    var listItem = document.createElement('li'); list.appendChild(listItem);
    listItem.className = 'menuItem' + (container._filters.category === '' ? ' active' : '');
    listItem.appendChild(document.createTextNode('All Items'));
    listItem.addEventListener('click', function (event) {
        container._filters.category = '';
        container._refresh()
    });
    var CATEGORIES = ['Clothing', 'Technology', 'Office', 'Outdoor'];
    for (var i in CATEGORIES) {
        var listItem = document.createElement('li'); list.appendChild(listItem);
        listItem.className = 'menuItem' + (container._filters.category === CATEGORIES[i] ? ' active' : '');
        listItem.appendChild(document.createTextNode(CATEGORIES[i]));
        listItem.addEventListener('click', (function (i) {
            return function (event) {
                container._filters.category = CATEGORIES[i];
                container._refresh();
            }
        })(i));
    }
}

var ajaxPost = function (url, data, onSuccess, onError) {
    //var count = 0;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.timeout = 5000;
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8")
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            //Use the JavaScript function JSON.parse() to convert text into a JavaScript object            
            onSuccess(response);
        }
    };
    xhttp.ontimeout = function () {
        onError("timeout error");
    }
    xhttp.onerror = function () {
        onError("network error");
    }    
    xhttp.send(JSON.stringify(data));//send data to server, the data must be string format.
}