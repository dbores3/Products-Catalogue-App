import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "../App.scss";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

//Forms the range in the pagination
const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

class Pagination extends Component {
  constructor(props) {
    super(props);
    const { totalRows = null, pageLimit, pageSiblings = 0 } = props;

    //If pageLimit is not a number, sets it again as 10
    this.pageLimit = 10;
    this.totalRows = typeof totalRows === "number" ? totalRows : 0;

    this.pageSiblings =
      typeof pageSiblings === "number"
        ? Math.max(0, Math.min(pageSiblings, 2))
        : 0;
    //Gets the total of pages, depending on the rows
    this.totalPages = Math.ceil(this.totalRows / this.pageLimit);

    this.state = { currentPage: 1 };
  }

  componentDidMount() {
    this.gotoPage(1);
  }
  
  //Sends to the required page
  gotoPage = page => {
    const { onPageChanged = f => f } = this.props;

    const currentPage = Math.max(0, Math.min(page, this.totalPages));

    const paginationData = {
      currentPage,
      totalPages: this.totalPages,
      pageLimit: this.pageLimit,
      totalRows: this.totalRows
    };

    this.setState({ currentPage }, () => onPageChanged(paginationData));
  };

  //Handles on click on the pagination page
  handleClick = (page, evt) => {
    evt.preventDefault();
    this.gotoPage(page);
  };

  //Handles the button to move 3 pages to the left
  handleMoveLeft = evt => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage - this.pageSiblings * 2 - 1);
  };

  //Handles the button to move 3 pages to the right
  handleMoveRight = evt => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage + this.pageSiblings * 2 + 1);
  };

  //Manages the pages numbers
  fetchPageNumbers = () => {
    const totalPages = this.totalPages;
    const currentPage = this.state.currentPage;
    const pageSiblings = this.pageSiblings;

    const totalNumbers = this.pageSiblings * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    //Compares to the toal blocks plus two additional buttons
    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBind = currentPage - pageSiblings;
      const rightBind = currentPage + pageSiblings;
      const beforeLastPage = totalPages - 1;
      //Alternates the page 2 or "Previous Button"
      const startPage = leftBind > 2 ? leftBind : 2;
      //Alternates the page before last or "Next Button"
      const endPage = rightBind < beforeLastPage ? rightBind : beforeLastPage;

      pages = range(startPage, endPage);
      
      //Gets the length of the pages
      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;
      //Sets the button after the first page
      const leftButton = startPage > 2;
      //Sets the button before the last page
      const rightButton = endPage < beforeLastPage;

      const leftButtonPage = LEFT_PAGE;
      const rightButtonPage = RIGHT_PAGE;

      //Checks where to locate the extra pages "..."
      if (leftButton && !rightButton) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftButtonPage, ...extraPages, ...pages];
      } else if (!leftButton && rightButton) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightButtonPage];
      } else if (leftButton && rightButton) {
        pages = [leftButtonPage, ...pages, rightButtonPage];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  render() {
    //If it didn't get a total Rows, returns null
    if (!this.totalRows) return null;
    //If it didn't get a total of pages, returns null
    if (this.totalPages === 1) return null;

    //Gets the current page
    const { currentPage } = this.state;
    //Gets the pages
    const pages = this.fetchPageNumbers();
  
    return (
      <Fragment>
        <nav aria-label="Products Pagination">
          <ul className="pagination">
            {pages.map((page, index) => {
              //Button to move 3 pages backwards
              if (page === LEFT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      aria-label="Previous"
                      onClick={this.handleMoveLeft}
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                );
              //Button to move 3 pages forward
              if (page === RIGHT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      aria-label="Next"
                      onClick={this.handleMoveRight}
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                );

              return (
                <li
                  key={index}
                  className={`page-item${
                    currentPage === page ? " active" : ""
                  }`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={e => this.handleClick(page, e)}
                  >
                    {page}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Fragment>
    );
  }
}

//Let's check the types of the Props
Pagination.propTypes = {
  totalRows: PropTypes.number.isRequired,
  pageLimit: PropTypes.number,
  pageSiblings: PropTypes.number,
  onPageChanged: PropTypes.func
};

export default Pagination;
