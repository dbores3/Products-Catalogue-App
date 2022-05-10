<?php
//Allows the conenction from the React App
header('Access-Control-Allow-Origin: http://localhost:3000');

// @desc    Gets the products accordingly to the pagination & price order
// @route   GET localhost:8000/listingproducts.php?startlimit=&endlimit=&order=desc
Class BooztProducts{  

  // @desc    Receives the GET request and decides whether to get the total products or the products per page
  // @access  public
  public function getRequest(){
    //If total is in the URL, gets the number of rows
    if(isset($_GET['total'])){
      $this->getTotalProducts();
    }else{
      //else, gets the products per page
      $this->getProducts();
    }
  }//end method

  // @desc    Gets the products accordingly to the pagination & price order
  // @access  private
  private function getTotalProducts(){
    
    //Creates the SQL Query, based on the variables sent
    $query = "SELECT COUNT(*) as total FROM products_list "; 

    //Sends the query to be run
    $result = $this->ConnectDatabase($query);

    //Creates a JSON out of the results
    echo json_encode(mysqli_fetch_object($result));
  }//end getTotalProducts method
  
  // @desc    Gets the products accordingly to the pagination & price order
  // @access  public
  private function getProducts(){

    //Gets the variables  
    $startLimit = $_GET['startlimit'];
    $endLimit = $_GET['endlimit'];
    $order = $_GET['order'];

    //Validates the Request & its variables
    $this->validateRequest($startLimit,$endLimit,$order);

    //If the user wants to order it by price, adds and ORDER BY
    if(isset($order))
      $order = "ORDER BY actual_price ".$_GET['order'];
    else
      $order = "";

    //Creates the SQL Query, based on the variables sent
    $query = "SELECT id,brand_name,product_name,base_price,actual_price,filename FROM products_list ".$order." LIMIT ".$startLimit.",".$endLimit.""; 
    
    //Sends the query to be run
    $result = $this->ConnectDatabase($query);
    
    //Creates a JSON out of the results * used for-loop in order to know the row key and add a ,
    echo '[';
    for ($i=0 ; $i < mysqli_num_rows($result) ; $i++) {
      //separates each row with a comma
      echo ($i>0 ? ',':'').json_encode(mysqli_fetch_object($result));
    }
    echo ']';
  }//end getProducts method

  // @desc  Validates the Request and the data sent in the URL
  // @access  private
  private function validateRequest($startLimit,$endLimit,$order = NULL){
    //Validates if the request is public
    $method = $_SERVER['REQUEST_METHOD'];
    if($method != "GET")
      die("Method not accepted");

    //Validates the variables
    if(!isset($startLimit) && !is_numeric($startLimit) && !isset($endLimit) && !is_numeric($endLimit))
      die("Not valid variables");
    
    //Validates the order
    if(isset($order) && $order != "asc" && $order != "desc")
      die("Not valid variables");
  }//end validateRequest method

  private function ConnectDatabase($query){
    //Credentials * I normally put them in the framework's env and then access securely via config or dotenv
    $host = "localhost"; 
    $user = "root"; 
    $password = ""; 
    $dbname = "boozt"; 

    //Connects to the database
    $con = mysqli_connect($host, $user, $password,$dbname);

    //Sets the characters to UTF-8 in order to accept special nordic characters
    /* change character set to utf8mb4 */
    mysqli_set_charset($con, "utf8");

    //Returns error if it could'nt connect to the db
    if (!$con)
      die("Connection failed: " . mysqli_connect_error());

    //Runs SQL's Query
    $result = mysqli_query($con,$query);

    //Dies if SQL's Query failed
    if (!$result) {
      http_response_code(404);
      die(mysqli_error($con));
    }
    
    //Finishes the connection
    $con->close();

    //Returns the Query's result
    return $result;
  }//end method

}//end BooztProducts Class

//Creates the Object & runs it
$BooztPRoducts = new BooztProducts();
$BooztPRoducts->getRequest();