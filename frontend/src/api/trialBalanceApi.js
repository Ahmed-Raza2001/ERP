import axios from "axios";
import { BASE_URL, role, branchId } from "./constants";


export const getTrialBalance = async (trialBalanceName) => {
    let response;
  
    try {
        if (trialBalanceName == 'Customers') {
            response = await axios.get(`${BASE_URL}/ledger/customer`);
            return response.data.customers;

        }
        else {
            response = await axios.get(`${BASE_URL}/ledger/supplier`);
            return response.data.suppliers;

        }
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};