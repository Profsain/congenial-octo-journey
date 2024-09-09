import { useState } from "react";
import { useDispatch } from "react-redux";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import { toast } from "react-toastify";
import { fetchStatementRules } from "../../../../redux/reducers/statementRuleReducer";
import StatementRuleForm from "./molecules/StatementRuleForm";
import StatementRuleList from "./molecules/StatementRuleList";

const initialValues = {
  ruleTitle: "",
  maximumTenure: "",
  maximumAmount: "",
};

const StatementRules = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const addStatementRule = async ({ values }) => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_BASE_URL;
      // Handle form submission logic here
      await fetch(`${apiUrl}/api/statement-rule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      await dispatch(fetchStatementRules());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await addStatementRule({ values });
      // Reset form after submission
      resetForm();

      // Set message after successful submission
      setMessage("Statement rule added successfully");
      toast.success("Statement rule added successfully");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add__statementContainer">
      <StatementRuleForm
        formTitle={"Create New Statement Rule"}
        handleSubmit={handleSubmit}
        message={message}
        initialValues={initialValues}
        isLoading={isLoading}
      />

      <StatementRuleList />
    </div>
  );
};

export default StatementRules;
