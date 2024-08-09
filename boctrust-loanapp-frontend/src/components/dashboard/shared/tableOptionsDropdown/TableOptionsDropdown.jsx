import { IoEllipsisVertical } from "react-icons/io5";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import styles from "./tableOptionsDropdown.module.css";
import { useOnClickOutside } from "../../../../../hooks/useOnclickOutside";

const TableOptionsDropdown = ({ items, loan }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const ref = useRef(null);

  useOnClickOutside(ref, () => setShowDropdown(false));
  return (
    <div className={styles.options__wrapper}>
      <button
        className="btn btn-light"
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <IoEllipsisVertical />
      </button>
      {showDropdown && (
        <div ref={ref} className={styles.options__dropdown}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => item.func(loan)}
              className={` ${item.className}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

TableOptionsDropdown.propTypes = {
  items: PropTypes.array,
  loan: PropTypes.object,
};

export default TableOptionsDropdown;
