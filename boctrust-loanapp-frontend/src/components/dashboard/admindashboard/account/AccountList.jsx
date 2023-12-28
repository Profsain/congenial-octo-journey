import PropTypes from "prop-types"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import PageLoader from "../../shared/PageLoader";
import NoResult from "../../../shared/NoResult";
import searchList from "../../../../../utilities/searchListFunc";

const AccountList = ({showCount, searchTerms}) => {
  const styles = {
    table: {
      // margin: "0 2rem 0 3rem",
    },
    head: {
      color: "#fff",
      fontSize: "1.2rem",
    },
    booked: {
      color: "#145098",
    },
    completed: {
      color: "#5cc51c",
    },
    withcredit: {
      color: "#f64f4f",
    },
    withdisbursement: {
      color: "#ecaa00",
    },
  };

  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );

  const status = useSelector((state) => state.customerReducer.status);

  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch]);

  // filter customer by isAccountCreated
  const filteredCustomers = customers?.filter(
    (customer) => customer?.banking?.isAccountCreated === true
  );

  // search customer list
  const [customerList, setCustomerList] = useState(filteredCustomers);

  // update customerList to show 10 customers on page load
  // or on count changes
  useEffect(() => {
    setCustomerList(filteredCustomers?.slice(0, showCount));
  }, [customers, showCount]);

  // update customerList on search
  const handleSearch = () => {
    const currSearch = searchList(
      filteredCustomers,
      searchTerms,
      "agreefullname"
    );
    setCustomerList(currSearch?.slice(0, showCount));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  return (
    <div>
      {status === "loading" && <PageLoader />}
      <DashboardHeadline
        height="52px"
        mspacer="2rem 0 -2.95rem -1rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <div style={styles.table}>
        <Table borderless hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Account Number</th>
              <th>Customer</th>
              <th>Account ID</th>
              <th>Status</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {customerList?.length === 0 && <NoResult name="customer" />}

            {customerList?.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.banking.accountDetails.Message.AccountNumber}</td>
                <td>{customer.banking.accountDetails.Message.FullName}</td>
                <td>{customer.banking.accountDetails.Message.Id}</td>
                <td style={styles.completed}>Active</td>
                {/* <td>
                  <select name="action" id="action">
                    <option value="">Action</option>
                    <option value="">Action 1</option>
                    <option value="">Action 2</option>
                    <option value="">Action 3</option>
                  </select>
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

AccountList.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number
}

export default AccountList;
