import PropTypes from "prop-types";
import "./LabeledInput.css";

const LabeledInput = ({
  label,
  name,
  value,
  placeholder,
  isTextArea,
  isDate,
  className,
  setInputValue,
}) => {
  return (
    <div>
      <div className="input__wrapper">
        <label
          className="font-medium text-base  leading-[2.03rem]"
          htmlFor={label}
        >
          {label}
        </label>
        {isTextArea ? (
          <textarea
            name={name}
            value={value}
            onChange={setInputValue}
            className={`${className} `}
            placeholder={placeholder || `Enter your ${label}`}
          />
        ) : isDate ? (
          <input
            type="date"
            name={name}
            value={value}
            onChange={setInputValue}
            className={className}
          />
        ) : (
          <input
            name={name}
            value={value}
            onChange={setInputValue}
            className={className}
            placeholder={placeholder || `Enter your ${label}`}
          />
        )}
      </div>
    </div>
  );
};

LabeledInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  isTextArea: PropTypes.bool,
  isDate: PropTypes.bool,
  className: PropTypes.string,
  setInputValue: PropTypes.func,
};

export default LabeledInput;
