var mysql = require("mysql");
var inquirer = require("inquirer");
var cliTable = require('cli-table');
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
    suppervisorFunction()
   })


   // Main Function 
function suppervisorFunction() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Select from the following menu options",
          choices: [
            "View Product Sales by Department",
            "Create New Department",
          ],
          name: "action"
        }
      ])
      .then(function(response) {
        switch (response.action) {
          case "View Product Sales by Department":
            productSalesByDepartmentFn();
            break;
  
          case "Create New Department":
            createNewDepartmentFn();
            break;
  
        }
      });
  }
// case View Product Sales by Department
 function productSalesByDepartmentFn() {
    var queryString = "SELECT departments.department_id,departments.department_name,departments.over_head_costs,SUM(products.product_sales) AS product_sales,(SUM(products.product_sales)-departments.over_head_costs) AS total_profit FROM departments INNER JOIN products ON (departments.department_name = products.department_name) GROUP BY departments.department_id";

    connection.query(queryString, function(err, res){

        var tableProductSales = new cliTable({
            head: ["Department_Id", 'Department_name', 'Overhead_cost ($)', 'Product_sales ($)','Total_profit ($)'],
            colWidths: [20, 25, 20, 20,20]
        });
        for (var i = 0; i < res.length; i++) {
            tableProductSales.push([res[i].department_id, res[i].department_name,res[i].over_head_costs,res[i].product_sales,res[i].total_profit])
        }
        console.log(tableProductSales.toString())

        connection.end();
    });
};


var overHeadCostValidatorFn = function depValidator(input) {
	var integer = Number.isInteger(parseFloat(input));
	var sign = Math.sign(input);

	if ((integer && (sign === 1)) && (!isNaN(input) && (input > 0))) {
		return true;
  }
  else{
		return 'Invalid entry please enter a valide number';
	}
}


// Create New Department 
function createNewDepartmentFn() {
    console.log("fill out the following information to add new department to inventory")
    inquirer.prompt([
      {
        type: "input",
        message: "department Name?",
        name: "name"
      },
      {
        type: "input",
        message: "overhead cost?",
        name: "cost",
        validate:overHeadCostValidatorFn
      }
  
  
    ]).then(function(response) {
        var departmentName = response.name;
        var overheadCost = response.cost;
  
        console.log("===========================================================================")
        var tableAddNewDepartment = consoleTable.getTable(response)
        console.log(tableAddNewDepartment);
  

          connection.query("INSERT INTO departments SET ?", 
            { 
              department_name:departmentName,
              over_head_costs: overheadCost
            },
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product added! \n");
            connection.end();
          }
        ); 
      
      })
    
  }