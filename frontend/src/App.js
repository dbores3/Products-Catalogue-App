import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.scss"
import Pagination from "./components/Pagination"
import ProductCard from "./components/ProductCard"
import Select from 'react-select'
import axios from 'axios'
import Spinner from './components/Spinner'
import boozImg from './public/images/boozt.jpg'

// @desc  Main Component in charge of displaying the products & ordering them by the price
class App extends Component {

  state = {
    currentProducts: [],
    currentPage: null,
    totalPages: null,
    pageLimit: null,
    orderPrice: null,
    totalProducts: null,
    isLoading : true
  };
  
  //Loads the number of products before rendering the page
  componentDidMount() {
    axios.get('http://localhost:8000/productsListing.php?total')
    .then(response => {
      //Updates the states with the actual number of products & takes off the loading spinner
      this.setState({ totalProducts: parseInt(response.data.total) })
      this.setState({ isLoading : false })
    });
  }

  //Handles a change in the price order
  handleSelect = (data) => {
    //Gets the pagination limits from the state
    const { currentPage, totalPages, pageLimit } = this.state;
    //sets the offset for the pagination
    const offset = (currentPage - 1) * pageLimit;
    const orderPrice  = data.value;
    //Gets the products accordingly to the pagination
    axios.get('http://localhost:8000/productsListing.php?startlimit='+offset+'&endlimit='+pageLimit+'&order='+orderPrice)
    .then(response => {
      const currentProducts = response.data;
      //Sets the state of the new price order
      this.setState({ currentPage, currentProducts, totalPages,orderPrice });
    });
  }

  //Handles a page changing
  onPageChanged = (data) => {
    const { orderPrice } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
    //sets the offset for the pagination
    const offset = (currentPage - 1) * pageLimit;

    let order = ''
    if(orderPrice)  
      order = "&order="+orderPrice

    //Gets the products accordingly to the pagination
    axios.get('http://localhost:8000/productsListing.php?startlimit='+offset+'&endlimit='+pageLimit+''+order)
    .then(response => {
      const currentProducts = response.data;
      //Sets the state with the new data
      this.setState({ currentPage, currentProducts, totalPages,pageLimit });
    });
  };


  render() {
    const {
      currentProducts,
      currentPage,
      totalPages,
      isLoading,
      totalProducts
    } = this.state;
    //
    if (totalProducts === 0) return null;

    const headerClass = [
      "text-dark py-2 pr-4 m-0",
      currentPage ? "border-gray border-right" : ""
    ]
      .join(" ")
      .trim();

    //Values 
    const options = [
      { value: 'desc', label: 'Price high-low' },
      { value: 'asc', label: 'Price low-high' },
    ]

    //Displays the loading spinner, unless it was deactivated
    if(isLoading){
      return <Spinner />
    }

    return (
      <>
       <section className='heading'>
        <img
          src={boozImg}
          className="logo"
          alt={`${boozImg}`}
        />
        <hr/>
      </section>
      <div className="container mb-5">
        <div className="row d-flex flex-row py-5">
          <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <h2 className={headerClass}>
                <strong className="text-secondary">{totalProducts}</strong>{" "}
                Products
              </h2>
            </div>
            <Select
              className="sort-by"
              options={options}
              placeholder="Sort By"
              onChange={this.handleSelect}
            />
            <div className="d-flex flex-row py-4 align-items-center">
              <Pagination 
                totalRows={totalProducts}
                pageLimit={18}
                pageSiblings={1}
                onPageChanged={this.onPageChanged}
              />
            </div>
          </div>
          {currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {currentPage && (
            <span className="current-page d-inline-block h-100 pl-4 text-secondary">
              Page <span className="font-weight-bold">{currentPage}</span> /{" "}
              <span className="font-weight-bold">{totalPages}</span>
            </span>
          )}
        </div>
      </div>
      </>
    );
  }
}

export default App;
