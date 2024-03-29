import { configureStore } from '@reduxjs/toolkit';
import fetchJobs from '../reducers/fetchJobs';
import userSlice from '../reducers/userSlice';
import blogReducer from '../reducers/blogReducer';
import productReducer from '../reducers/productReducer';
import wikiReducer from '../reducers/wikiReducer';
import careerReducer from '../reducers/careerReducer'
import contactFormReducer from '../reducers/contactFormReducer';
import branchReducer from '../reducers/branchReducer';
import accountReducer from '../reducers/accountReducer';
import customerReducer from '../reducers/customerReducer';
import disbursementMethodReducer from '../reducers/disbursementMethodReducer';
import employersManagerReducer from '../reducers/employersManagerReducer';
import adminUserReducer from '../reducers/adminUserReducer';
import authReducer from '../reducers/adminAuthReducer';
import settingReducer from '../reducers/settingReducer';
// create a store
const store = configureStore({
    reducer: {
        // add reducers here
        fetchJobs,
        blogReducer,
        productReducer,
        wikiReducer,
        careerReducer,
        contactFormReducer,
        branchReducer,
        accountReducer,
        customerReducer,
        disbursementMethodReducer,
        adminUserReducer,
        employersManagerReducer,
        user: userSlice,
        adminAuth: authReducer,
        settingReducer
    }
});

export default store;
