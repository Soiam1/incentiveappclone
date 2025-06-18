import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import api from '../../lib/api';

export default function SalesPage() {
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [manualBarcode, setManualBarcode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("token");
      if (!raw) throw new Error("No token");
      jwtDecode(raw);
    } catch {
      localStorage.removeItem("token");
      navigate('/login');
    }
  }, [navigate]);

  const handleManualEntry = async (code) => {
    if (!code) return;
    try {
      const { price, traitPercentage } = await api
        .get(`/api/products/api/products/${code}`)
        .then((r) => r.data);

      setItems((prev) => {
        const existing = prev.find((i) => i.barcode === code);
        if (existing) {
          return prev.map((i) =>
            i.barcode === code ? { ...i, qty: i.qty + 1 } : i
          );
        }
        return [...prev, { barcode: code, qty: 1, price, traitPercentage }];
      });

      setManualBarcode('');
    } catch {
      alert("Product not found");
    }
  };

  const updateQty = (idx, qty) => {
    setItems(items.map((it, i) => (i === idx ? { ...it, qty } : it)));
  };

  const total = items.reduce(
    (sum, { price, qty, traitPercentage }) =>
      sum + price * qty * (traitPercentage / 100),
    0
  );

  const submitSale = async () => {
    try {
      const raw = localStorage.getItem("token");
      const decoded = jwtDecode(raw);
      const salesman_id = decoded.id;

      await api.post('/api/sales/submit', {
        items: items.map(({ barcode, qty }) => ({ barcode, qty })),
        customer_name: customer.name,
        customer_number: customer.phone,
        salesman_id
      });

      navigate('/salesman');
    } catch (error) {
      alert("Failed to submit sale");
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-pink-100 min-h-screen space-y-6">
      {/* Global Header */}
      <Header />
      
      
      <div className="mt-4">
        <Button
          onClick={() => navigate(-1)}
          className="text-sm bg-white text-red-600 border border-red-600 px-4 py-2 rounded-full"
        >
          ← Back
        </Button>
      </div>

      {/* Manual Entry */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold text-center">Enter Barcode Manually</h3>
        <div className=" w-full flex gap-2 items-center">
          <input
            placeholder="Enter barcode"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => handleManualEntry(manualBarcode)}>Add</Button>
        </div>
      </Card>

      {/* Scanned Items Table */}
      <Card className="p-4 overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100">
            <tr className="text-xs">
              <th>SNO</th>
              <th>BARCODE</th>
              <th>QTY</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-t">
                <td>{i + 1}</td>
                <td>{it.barcode}</td>
                <td>
                  <Input
                    type="number"
                    value={it.qty}
                    onChange={(e) => updateQty(i, +e.target.value)}
                    className="w-16 text-center"
                  />
                </td>
                <td>{(it.price * it.qty * (it.traitPercentage / 100)).toFixed(2)}</td>
              </tr>
            ))}
            {items.length > 0 && (
              <tr className="font-semibold border-t">
                <td colSpan="3" className="text-right pr-2">TOTAL</td>
                <td>{total.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="border-t border-gray-300 my-2" /> 
      <Card className="p-4 space-y-3">
        <h3 className="font-bold underline text-center">Customer Info</h3>
        <Input
          label="Name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        />
        <Input
          label="Number"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        />
      </Card>

      <h3 className="font-bold underline text-center"></h3>
      <div className="text-center pb-8">
        <Button
          onClick={submitSale}
          disabled={!items.length || !customer.name || !customer.phone}
          className="bg-red-600 text-white py-3 px-10 rounded-full text-lg"
        >
          SUBMIT
        </Button>
      </div>
    </div>
  );
}
