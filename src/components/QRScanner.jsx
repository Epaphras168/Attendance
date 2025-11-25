import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Button from "./ui/Button";

const QRScanner = ({ onScan, isArrival, students }) => {
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [qrError, setQrError] = useState(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [scanner]);

  const startScanner = () => {
    if (scanner) return; // Prevent multiple scanners

    const qrScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 400, height: 400 },
        rememberLastUsedCamera: true,
        aspectRatio: 1.0,
        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      },
      false
    );

    const onScanSuccess = (decodedText) => {
      const trimmed = decodedText.trim();

      // Ignore duplicate scans
      if (trimmed === lastResult) return;

      setLastResult(trimmed);

      // Check if students data is loaded
      if (!students || students.length === 0) {
        console.warn("Students data not loaded yet");
        return;
      }

      // Check if scanned student exists
      const student = students.find((s) => s.id === trimmed);
      if (!student) {
        console.warn("Student not found:", trimmed);
        return;
      }

      // Stop scanner and call parent
      qrScanner.clear().catch(() => {});
      setIsScanning(false);
      setScanner(null);

      onScan(trimmed);
    };

    qrScanner.render(onScanSuccess, (error) => {
      setQrError(error);
      console.error("QR scan error:", error);
    });

    setScanner(qrScanner);
    setIsScanning(true);
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.clear().catch(() => {});
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
          style={{ height: "500px" }}
        ></div>

        {lastResult && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">Last Scanned QR Code:</p>
            <p className="font-mono text-xs break-all">{lastResult}</p>
          </div>
        )}

        {qrError && (
          <div className="mt-2 text-red-500 text-sm">
            QR Scanner Error: {qrError}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
