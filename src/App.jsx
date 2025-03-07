import React, { useState } from "react";

export default function App() {
  const [amount, setAmount] = useState(10000);
  const [installments, setInstallments] = useState(10);

  const total = parseFloat(amount) || 0;

  const [installmentItems, setInstallmentItems] = useState(
    Array.from({ length: installments }, (_, index) => ({
      number: index + 1,
      amount: total > 0 ? (total / installments).toFixed(2) : "0.00",
      checked: false,
      show: true,
      merged: false,
      split: false,
    }))
  );

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setInstallmentItems(
        Array.from({ length: installments }, (_, index) => ({
          number: index + 1,
          amount:
            total > 0 ? (parseFloat(value) / installments).toFixed(2) : "0.00",
          checked: false,
          show: true,
        }))
      );
    }
  };

  const handleInstallmentsChange = (e) => {
    const newInstallments = Number(e.target.value);
    setInstallments(newInstallments);
    setInstallmentItems(
      Array.from({ length: newInstallments }, (_, index) => ({
        number: index + 1,
        amount: total > 0 ? (total / newInstallments).toFixed(2) : "0.00",
        checked: false,
        show: true,
        merged: false,
      }))
    );
  };

  const handleCheckboxChange = (number) => {
    setInstallmentItems((prevItems) =>
      prevItems.map((item) =>
        item.number === number ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleMerge = () => {
    const checkedItems = installmentItems.filter((item) => item.checked);

    if (checkedItems.length < 2) {
      alert("Please select at least two installments to merge.");
      return;
    }
    const alreadyMerged = checkedItems.some((item) => item.merged);
    if (alreadyMerged) {
      alert("Please Choose An Item That Is Not Already Merged");
      return;
    }

    const mergedItem = checkedItems.reduce((acc, item) => ({
      number: acc.number + "+" + item.number,
      amount: (parseFloat(acc.amount) + parseFloat(item.amount)).toFixed(2),
      checked: false,
      show: true,
      merged: true,
    }));

    // Find the index of the first checked item
    const firstCheckedIndex = installmentItems.findIndex((item) => item.checked);
    console.log(firstCheckedIndex,"firstCheckedIndex");
    
    // Hide the checked items and prepare the updated list
    const updatedItems = installmentItems.map((item) =>
      item.checked ? { ...item, show: false, checked: false } : item
    );

    // Insert the merged item at the position of the first checked item
    const finalItems = [
      ...updatedItems.slice(0, firstCheckedIndex),
      mergedItem,
      ...updatedItems.slice(firstCheckedIndex)
    ];

    setInstallmentItems(finalItems);
  };
  console.log(installmentItems,"installmentItems");
  
  const handleSplit = () => { 
    console.log("handleSplit");
    const checkedItems = installmentItems.filter((item) => item.checked);
    if (checkedItems.length !== 1) {
      alert("Please select only one installment to split.");
      return;
    }

    const alreadyMerged = checkedItems.some((item)=>item.merged);
    if(alreadyMerged){
      alert("Please Choose An Item That Is Not Already Merged");
      return;
    }
    const alreadySplit = checkedItems.some((item)=>item.split)
    if(alreadySplit){
      alert("Please Choose An Item That Is Not Already Split");
      return;
    }
    const checkedItem = checkedItems[0];
   
    const splitAmount = (parseFloat(checkedItem.amount) / 2).toFixed(2);
    const splitItems = [
      {
        number: `${checkedItem.number}.1`,
        amount: splitAmount,
        checked: false,
        show: true,
        split: true,
      },
      {
        number: `${checkedItem.number}.2`,
        amount: splitAmount,
        checked: false,
        show: true,
        split: true,
      }
    ]
    const updatedItems = installmentItems.flatMap((item) =>
      item.number === checkedItem.number ? splitItems : item
    );
    setInstallmentItems(updatedItems);
    
  }
  return (
    <div>
      <label htmlFor="amount">Amount</label>
      <input
        id="amount"
        value={amount}
        onChange={handleAmountChange}
        type="text"
        inputMode="decimal"
      />
      <div>
        <select value={installments} onChange={handleInstallmentsChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Month{i + 1 > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleMerge}>merge</button>
      <button onClick={handleSplit}>split</button>
      {total > 0 && (
        <div>
          <p>Total Amount: ₹{total.toFixed(2)}</p>
          <p>Divided into {installments} installment(s):</p>
          <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Select</th>
                <th>Installment</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {installmentItems
                .filter((item) => item.show)
                .map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleCheckboxChange(item.number)}
                      />
                    </td>
                    <td>{item.number}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}