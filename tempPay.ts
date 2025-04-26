const handlePlaceOrder = async() => {
    try {
      const response= await axios.post('/api/createOrder',{
        amount: orderTotal, 
        userId:session?.user.id,
        orderedItems:items
      });
      const orderId= response.data.orderId ;
         console.log(orderId);
         const paymentData={
          key:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
          order_id:orderId,
          handler:async(response:any)=>{
            //verify-payment
            const paymentId=response.razorpay_payment_id;
            const res= axios.post('/api/verifyOrder',{
              orderCreationId:response.razorpay_order_id,
              razorpayPaymentId:response.razorpay_payment_id,
              razorpaySignature:response.razorpay_signature,
              prefill: {
                name: user.name,
                email: user?.email || '',
                contact: user?.phone || ''
              },
              theme: {
                color: '#F37254'
              },
            })
            const data=(await res).data;
            console.log(data);
            if(data.isOk){
             console.log('hogaya payment');
             clearCart();          
              toast.success('payment successful');
            }
            else{
              console.error('payment failed');
            }
          }
    
        }
        const payment= new (window as any).Razorpay(paymentData);
        payment.open()
        
    } catch (error) {
      toast.error('Failed to create order');
      console.log("error in creating order",error);
    }
    
      };
    