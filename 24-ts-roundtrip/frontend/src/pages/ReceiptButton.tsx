// Download receipt: the response status is never checked, so a 401 or 404 body is saved as
// if it were the receipt.
export default function ReceiptButton({ orderId }: { orderId: number }) {
  function downloadReceipt() {
    fetch(`/api/orders/${orderId}/receipt`, { headers: { authorization: localStorage.token ?? '' } })
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `receipt-${orderId}.txt`;
        a.click();
      });
  }

  return <button onClick={downloadReceipt}>Download receipt</button>;
}
