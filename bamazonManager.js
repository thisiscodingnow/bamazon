var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require('console.table');// to display json into simple column/row table formate


var connection = mysql.createConnection({
  host: "localhost",

  port: 8889,

  user: "root",

  password: "root",

  database: "bamazon",

  insecureAuth: true
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected with id of " + connection.threadId);
  managerFunction();// run main function defined below
});

// Main Function to run listend functions base on prompt response
function managerFunction() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Select from the following menu options",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ],
        name: "action"
      }
    ])
    .then(function(response) {
      switch (response.action) {
        case "View Products for Sale":
          displayProductsFn();
          break;

        case "View Low Inventory":
          lowInventoryFn();
          break;

        case "Add to Inventory":
          addToInventoryFn();
          break;
        case "Add New Product":
          addNewProductToInventoryFn();
          break;

      }
    });
}

//  case View Products for Sale displays to products available for sale from products table
function displayProductsFn() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("===========================================================================================================================");

    var tableDisplayProducts = consoleTable.getTable(res)
    console.log(tableDisplayProducts)

  });
  connection.end();
}

// case View Low Inventory ...will display items with stock quantity less than the specified limit (5 in this case)
function lowInventoryFn() {
    var quantityLimit =5;

  var queryString ="SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity<"+quantityLimit;
  connection.query(queryString,function(err, res) {
    if (err) throw err;
    if(res.length <= 0){
        console.log("it looks like there is no product with stock quantity below 5");
        connection.end();
    }
  
    else{
    console.log("===========================================================================");
    console.log("Here are the product with an inventory count lower than " + quantityLimit)
    var tableLowInventory = consoleTable.getTable(res)
    console.log(tableLowInventory);
    connection.end();

}

  });
}

// case Add to Inventory..... will update stock_quantity to existing inventory query by itemId
function addToInventoryFn() {
  inquirer.prompt({
      type: "input",
      message: "specify itemId?",
      name: "itemId"
    }).then(function(response) {
      var stockQuantity = 0;
      var queryString ="SELECT item_id, product_name, price, stock_quantity FROM products WHERE?";
        connection.query(queryString,{item_id:response.itemId}, function(err,res) {
        stockQuantity = res[0].stock_quantity;
        if (err) throw err;
// display in simpe table formate
        console.log("===========================================================================")
        var tableQueryByItemId = consoleTable.getTable(res)
        console.log(tableQueryByItemId);

        inquirer.prompt({
            type: "input",
            message: "how many do you like to add to stock for item " + response.itemId,
            name: "quantity"
          }).then(function(result) {
            var quantityToAdd = result.quantity;
            var updatedStockQuantity = (parseInt(stockQuantity) + parseInt(quantityToAdd));
            connection.query("UPDATE products SET ? WHERE ? ",
              [
                {
                  stock_quantity:updatedStockQuantity
                },
                {
                  item_id: response.itemId
                }
              ],
              function(err, res) {
                if (err) throw err;
                console.log(quantityToAdd+" added to the stock!\n");
                  });
            connection.end();
          });
      });
    });
}


// validate stock quantity to be counting number
var stockQuantityInputValidation = function InputNumberValidationFn(input) {
	var integer = Number.isInteger(parseFloat(input));
	var sign = Math.sign(input);

	if (integer && (sign === 1)) {
		return true;
  }

  if(!integer){
    return "please input non-decimal positive";
  }
  else{
		return 'Please enter whole number above zero';
	}
}



// case Add New Product... will add new product to products table
function addNewProductToInventoryFn() {
  console.log("fill out the following information to add new product to inventory")
  inquirer.prompt([
    {
      type: "input",
      message: "product Name?",
      name: "productName"
    },
    {
      type: "input",
      message: "Department?",
      name: "departmentName"
    },
    {
      type: "input",
      message: "price?",
      name: "unitPrice",
    },
    {
      type: "input",
      message: "add stock quantity?",
      name: "stockQuantity",
      validate:stockQuantityInputValidation,
      filter:Number

    }

  ]).then(function(response1) {
    // store response's in variable for later use.
      var productName = response1.productName;
      var departmentName = response1.departmentName;
      var unitPrice = response1.unitPrice;
      var quantity = response1.stockQuantity;

      console.log("===========================================================================")
      var tableAddNewProduct = consoleTable.getTable(response1)
      console.log(tableAddNewProduct);

        connection.query("INSERT INTO products SET ?", 
          { 
            product_name:productName,
            department_name:departmentName,
            price:unitPrice,
            stock_quantity:quantity
          },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " product added! \n");
          connection.end();
        
          // displayProductsFn();
        }
      ); 
    
    })

  
}

  


      


  



