import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "./PageLoader";
import PropTypes from "prop-types";
import { fetchProduct } from "../../../redux/reducers/productReducer";

const DisplayLoanProductName = ({ loan }) => {
  const dispatch = useDispatch();
  const loanProducts = useSelector((state) => state.productReducer.products);
  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(fetchProduct());
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  return (
    <>
      {loanProducts ? (
        loanProducts?.find(
          (item) =>
            item.ProductCode === loan?.customer?.loanproduct ||
            loan?.loanproduct
        )?.ProductName || "General Loan"
      ) : (
        <PageLoader width="20px" />
      )}
    </>
  );
};

DisplayLoanProductName.propTypes = {
  loan: PropTypes.object,
};

export default DisplayLoanProductName;
