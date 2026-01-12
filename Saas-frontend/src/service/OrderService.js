import axios from "axios";
import toast from "react-hot-toast";


export const placeOrder=async(planId,getToken,onSuccess,backendUrl)=>{
    try {
        const token=await getToken();
       const response= await axios.post(`${backendUrl}/orders?planId=${planId}`,{},    { headers: { Authorization: `Bearer ${token}` } });
       if(response.status===200)
       {
        initializePayments({order:response.data.data,getToken,onSuccess,backendUrl});
       }

        
    } catch (error) {
        toast.error(error.message)
        
    }

}

const initializePayments = ({ order, getToken, onSuccess, backendUrl }) => {
  const options = {
    key: "rzp_test_CspNkDjMvuRRS2",
    amount: order.amount,
    currency: order.currency,
    name: "Credit Payment",
    description: "Credit payment",
    order_id: order.id,
    receipt: order.receipt,
    handler: async (paymentDetails) => {
      try {
        const token = await getToken();
        const response = await axios.post(
          `${backendUrl}/orders/verify`,
          paymentDetails,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          toast.success("Credits Added");
          onSuccess?.();
        }
      } catch (error) {
        toast.error(error.message); // fixed typo: .mesage -> .message
      }
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open(); // <-- Required to show the modal
};
