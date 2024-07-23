import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface AcceptPaymentProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  totalPrice: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  userId: string; // Assuming you have userId as part of props
}

const AcceptPayment: React.FC<AcceptPaymentProps> = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  totalPrice,
  address,
  city,
  state,
  zipCode,
  userId,
}) => {
  const [txRef, setTxRef] = useState<string>('');

  useEffect(() => {
    // Generate a unique transaction reference
    const uniqueRef = `tx-${userId}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setTxRef(uniqueRef);
  }, [userId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!firstName || !lastName || !email || !phoneNumber || !address || !city || !state || !zipCode) {
      toast({
        variant: "default",
        description: "Please fill in all required fields",
      });
      return;
    }

    // If all required fields are filled, submit the form
    e.currentTarget.submit();
  };

  return (
    <main>
      <div>
        <form method="POST" action="https://api.chapa.co/v1/hosted/pay" onSubmit={handleSubmit}>
          <input type="hidden" name="public_key" value="CHAPUBK_TEST-ownPiYcgHzrXrdD2immKKQfuF3MgCZna" />
          <input type="hidden" name="tx_ref" value={txRef} />
          <input type="hidden" name="amount" value={totalPrice.toString()} />
          <input type="hidden" name="currency" value="ETB" />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="first_name" value={firstName} />
          <input type="hidden" name="last_name" value={lastName} />
          <input type="hidden" name="phone_number" value={phoneNumber} />
          <input type="hidden" name="address" value={address} />
          <input type="hidden" name="city" value={city} />
          <input type="hidden" name="state" value={state} />
          <input type="hidden" name="zip_code" value={zipCode} />
          <input type="hidden" name="title" value="Let us do this" />
          <input type="hidden" name="description" value="Paying with Confidence with cha" />
          <input type="hidden" name="logo" value="https://chapa.link/asset/images/chapa_swirl.svg" />
          <input type="hidden" name="callback_url" value="https://example.com/callbackurl" />
          <input type="hidden" name="return_url" value="http://localhost:3000/user/checkout/transaction-result" />
          <input type="hidden" name="meta[title]" value="test" />
          <button type="submit">Pay Now</button>
        </form>
      </div>
    </main>
  );
};

export default AcceptPayment;
