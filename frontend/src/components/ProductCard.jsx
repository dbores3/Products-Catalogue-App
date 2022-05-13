import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "../App.scss";

// @desc  Configures the product's card
class ProductCard extends Component {
  render() {
    const { filename,product_name,brand_name,base_price = null,actual_price } =
      this.props.product || {};

    return (
      <Fragment>
        <div className="col-md-6 col-lg-5 col-xl-4">
          <div className="product-card-container rounded border my-5 flex-row align-items-center p-0 bg-light">
            <div className="h-100 position-relative border-gray border-right px-2 bg-white rounded-left">
              <img
                src={filename}
                className="d-block h-100"
                alt={`${product_name}`}
              />
            </div>
            <div>
              <span className="product-name text-dark d-block font-weight-bold">
                {product_name} - {brand_name}
              </span>
              <span className="price text-secondary text-uppercase">
              {actual_price < base_price ? (
                  <p><s>{base_price}</s>  <strong>{actual_price}</strong></p>
                ) : (
                  <p>{actual_price}</p>
                )}
                
              </span>
            </div>
          </div>
        </div>
        
      </Fragment>
    );
  }
}

//Checks the Product's properties
ProductCard.propTypes = {
  product: PropTypes.shape({
    product_name: PropTypes.string.isRequired,
    brand_name: PropTypes.string.isRequired,
    base_price: PropTypes.string.isRequired,
    actual_price: PropTypes.string.isRequired,
  }).isRequired
};

export default ProductCard;
