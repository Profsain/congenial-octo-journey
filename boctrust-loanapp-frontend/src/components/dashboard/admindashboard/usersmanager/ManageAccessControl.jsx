import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPermissions,
  fetchRolesAndPermisions,
} from "../../../../redux/reducers/adminUserReducer";

import "./CreateNewAdmin.css";

const ManageAccessControl = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const { rolesAndPermission, allPermisions } = useSelector(
    (state) => state.adminUserReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      dispatch(fetchRolesAndPermisions());
      dispatch(fetchPermissions());
    };

    getData();
  }, []);
  return (
    <div className="manage__accessControl">
      <div className=" border p-3">
        {rolesAndPermission && (
          <div className="FieldGroup">
            <label htmlFor="userRole">User Roles</label>
            <select name="userRole" id="userRole" className="Input">
              <option value="">Select Role</option>
              {Object.keys(rolesAndPermission).map((option) => (
                <option
                  onClick={() => setSelectedRole(option)}
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="border p-3">
        {selectedRole && allPermisions && (
          <div className="permission__control">
            <h4>Permission Control</h4>

            <div>
              <h5>KYC</h5>
              <div>
                {allPermisions.kyc.map((item, index) => (
                  <div
                    key={index}
                    className="form-check d-flex gap-3 align-items-center"
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item}
                      id={item}
                    />
                    <label className="form-check-label" htmlFor={item}>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5>Loans</h5>
              <div>
                {allPermisions.loan.map((item, index) => (
                  <div
                    key={index}
                    className="form-check d-flex gap-3 align-items-center"
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item}
                      id={item}
                    />
                    <label className="form-check-label" htmlFor={item}>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5>Remita</h5>
              <div>
                {allPermisions.remita.map((item, index) => (
                  <div
                    key={index}
                    className="form-check d-flex gap-3 align-items-center"
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item}
                      id={item}
                    />
                    <label className="form-check-label" htmlFor={item}>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5>Credit Assessment</h5>
              <div>
                {allPermisions.credit.map((item, index) => (
                  <div
                    key={index}
                    className="form-check d-flex gap-3 align-items-center"
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item}
                      id={item}
                    />
                    <label className="form-check-label" htmlFor={item}>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5>Employer Manager</h5>
              <div>
                {allPermisions.employer.map((item, index) => (
                  <div
                    key={index}
                    className="form-check d-flex gap-3 align-items-center"
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item}
                      id={item}
                    />
                    <label className="form-check-label" htmlFor={item}>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5>Website Manager</h5>
              <div>
                {allPermisions.webManager.map((item, index) => (
                  <div
                    key={index}
                    className="form-check d-flex gap-3 align-items-center"
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item}
                      id={item}
                    />
                    <label className="form-check-label" htmlFor={item}>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5>User Manager</h5>
              <div>
                {allPermisions.user.map((item, index) => (
                  <div
                    key={index}
                    className="form-check d-flex gap-3 align-items-center"
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item}
                      id={item}
                    />
                    <label className="form-check-label" htmlFor={item}>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5>Setting</h5>
              <div>
                {allPermisions.setting.map((item, index) => (
                  <div
                    key={index}
                    className="form-check d-flex gap-3 align-items-center"
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item}
                      id={item}
                    />
                    <label className="form-check-label" htmlFor={item}>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAccessControl;
