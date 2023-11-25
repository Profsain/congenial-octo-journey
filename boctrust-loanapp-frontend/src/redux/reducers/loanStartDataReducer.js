import { createSlice } from "@reduxjs/toolkit";

const startDataSlice = createSlice({
    name: "startData",
    initialState: {
        loanamount: null,
        careertype: null,
        noofmonth: null,
        loanRepaymentTotal: null,
        monthlyRepayment: null,
        loanproduct: null
    },

    reducers: {
        addData: (state, action) => {
            state.loanamount = action.payload.loanamount;
            state.careertype = action.payload.careertype;
            state.noofmonth = action.payload.noofmonth;
            state.loanRepaymentTotal = action.payload.loanRepaymentTotal;
            state.monthlyRepayment = action.payload.monthlyRepayment;
            state.loanproduct = action.payload.loanproduct;
        }
    }
});

export const { addData } = startDataSlice.actions;
export default startDataSlice.reducer;