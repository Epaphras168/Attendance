
import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Button from "./ui/Button";

const QRScanner = ({ onScan, isArrival }) => {
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
const [qrError, setQrError] = useState(null);
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

  const startScanner = () => {
    const qrScanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 400, height: 400 }, // bigger box
      rememberLastUsedCamera: true,
      aspectRatio: 1.0, // ensures square view
    }, false);

    const onScanSuccess = (decodedText) => {
      setIsScanning(false);
      setLastResult(decodedText);
      qrScanner.clear();
      onScan(decodedText);
    };

    qrScanner.render(onScanSuccess, (error) => {
      setQrError(errorMessage);
      console.error("QR scan error:", error);
    });

    setScanner(qrScanner);
    setIsScanning(true);
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          {isArrival ? "Scan QR to Check In" : "Scan QR to Check Out"}
        </h2>

        {!isScanning ? (
          <Button
            onClick={startScanner}
            variant={isArrival ? "success" : "primary"}
            fullWidth
          >
            {isArrival ? "Start Check-In Scanner" : "Start Check-Out Scanner"}
          </Button>
        ) : (
          <Button onClick={stopScanner} variant="danger" fullWidth>
            Stop Scanner
          </Button>
        )}

        <div
          id="qr-reader"
          className="mt-4 w-full"
          style={{ height: "500px" }} // make the camera area taller
        ></div>

        {lastResult && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">Last Scanned QR Code:</p>
            <p className="font-mono text-xs break-all">{lastResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;