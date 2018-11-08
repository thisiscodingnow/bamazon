var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require('console.table');

var connection = mysql.createConnection(
    {
        host:"localhost",

        port:8889,

        user: "root",

        password:"root",

        database:"bamazon",

        insecureAuth:true 

    }
);

connection.connect(function(err){
    if(err) throw err;
    console.log("connected with id of "+ connection.threadId);
    displayProducts();
   })

   

// Read products function
function displayProducts(){
   connection.query("SELECT item_id, product_name, price FROM products WHERE item_id <=10", function(err,res){
     if(err) throw err;
     // display response using require(console.table) module; see above for required modules.
     var tableDisplayProducts = consoleTable.getTable(res);
     console.log(tableDisplayProducts);
     setTimeout(ordersFunction, 1000) // run ordersFunction ONE second after displaying products
 })
}

var idValidatorFn = function idValidator(input) {
	var integer = Number.isInteger(parseFloat(input));
	var sign = Math.sign(input);

	if ((integer && (sign === 1)) && (!isNaN(input) && (input > 0 && input <= 10))) {
		return true;
  }

  else if(!isNaN(input)&&!integer){
    return "please enter non-decimal number";
  }
  else{
		return 'Invalid entry please enter a number between 1-10';
	}
}


var quantityValidatorFn = function quantityValidator(input) {
	var integer = Number.isInteger(parseFloat(input));
	var sign = Math.sign(input);

	if ((integer && (sign === 1)) && (!isNaN(input) && (input > 0))) {
		return true;
  }

  else if(!isNaN(input)&&!integer){
    return "please enter non-decimal number";
  }
  else{
		return 'Invalid entry please enter a number > 0';
	}
}


function ordersFunction(){

inquirer.prompt([
    {type:"input",
     message:"what is the Id of the product you like to buy? \n",
     name:"productId",
     validate:idValidatorFn,
     filter:Number
    },
    {
     type:"input",
     message:"how many units do you like to buy?",
     name:"quantity",
     validate:quantityValidatorFn,
     filter:Number

    }
]).then(function(orderResponse){

    var orderQuantity= orderResponse.quantity;
    var orderId= orderResponse.productId;
    var stockQuantity=0;
    var totalPrice=0;
    var totalSales=0;// added for bonus supperviser
    var itemId;// value will update after the following query
    connection.query("SELECT * FROM products WHERE?",{item_id:orderId}, function(err,queryRes){
        if(err) throw err;
        itemId=queryRes[0].item_id;
        stockQuantity=queryRes[0].stock_quantity;
        totalPrice = orderQuantity * queryRes[0].price;
        totalSales = (queryRes[0].product_sales + totalPrice);// added for bonus supperviser

        console.log("Hear is the summary of your order ");
        console.log("==============================================")
        // use console.table formate to display purchase summary
        var tableOrders = {
                ProductID:queryRes[0].item_id,
                ProductName:queryRes[0].product_name,
                PurchaseQuantity:orderQuantity,
                UnitPrice$:(parseFloat(queryRes[0].price).toFixed(2)),
                TotalPrice$:(parseFloat(totalPrice).toFixed(2))// display only upto 2 decimal point
                };
        console.log(consoleTable.getTable(tableOrders));
        //confirm order

    inquirer.prompt({  
            type:"confirm",
            message:"verify your order summary; Is this the correct order?",
            name:"orderConfirmed"
        }).then(function(confirmation){
          if(confirmation.orderConfirmed && orderQuantity<=stockQuantity){

        connection.query("SELECT * FROM products WHERE?",{item_id:orderId}, function(err,queryconfirmRes){
        if(err) throw err;
        connection.query("UPDATE products SET ? WHERE ?",
        [
          {   // updatate database quantity after purchase confirmed
              stock_quantity: (stockQuantity - orderQuantity),
              product_sales:totalSales
          },
          {
              item_id:orderId// update database where item_id = orderId
          }
        ],
        function(err,queryupdateRes) {
        if(err) throw err;
        console.log("processed your order!\n");
        console.log("Total Cost of Your Purchase is: $"+ (parseFloat(totalPrice).toFixed(2)));
        console.log("\nThank you for shopping at bamazon!\n")
        connection.end();
        // continueShopping();
     });
    });

    } 
  //---------------------------------------------------------------------------  
    // if order summary is not confirmed by user cancel transaction and ask if they want to start over again
    else if(!(confirmation.orderConfirmed) && (orderQuantity<=stockQuantity) && (orderId<=itemId)){
        console.log("transaction canceled! \n")
        calcelTransaction();
    }
   //------------------------------------------------------------------------- 
    // if product is available but order quantity exceeds stock quantity ask to reduce quantity or buy other product
    else if((orderQuantity>stockQuantity)  && (orderId<=itemId) && (stockQuantity !== 0)) { 
        console.log("Please reduce quantity, or check other products\n")
        continueShopping();
    } 
    // if product  is carried by bamazon but quantity is zero.... console out of stock
    else if((orderQuantity>stockQuantity)  && (orderId<=itemId) && (stockQuantity === 0)) {
        console.log("we are out of stock, please check our other products\n")
     }
     // for any other unknown reasons....
     else{
         console.log("errer 404\n")
     }
  
        });
});

        
    });


}


function continueShopping(){
  
            inquirer.prompt({
                type:"confirm",
                message:"\nDo you want to continue shopping?",
                name:"reConfirmed"
            }).then(function(continueShoppingResponse){
    
                if(continueShoppingResponse.reConfirmed){
                    console.log("OK, lets continue shopping")
                    ordersFunction();            
                }
                else{
                    console.log("\nThank you for shopping at BAMAZON!")
                    connection.end();
                }
    
            })    

}

function calcelTransaction(){
    inquirer.prompt({
        type:"confirm",
        message:"do you want to exit from bamazon?\n",
        name:"reConfirmed"
    }).then(function(reorderResponse){

        if(reorderResponse.reConfirmed){
            console.log("Thank you for visiting bamazon, hope you come back soon!\n")
            connection.end();
        }
        else{
            console.log("OK, please start over again\n")
            ordersFunction();
        }

    })
}


















