import React, { useState } from "react";
import { useData } from "../contexts/DataContext";
import QRScanner from "../components/QRScanner";
import Button from "../components/ui/Button";

const AttendanceScanner = () => {
  const [isArrival, setIsArrival] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const { recordAttendance } = useData();

  const handleScan = async (qrCode) => {
    try {
      const result = await recordAttendance(qrCode, isArrival);
      setScanResult(result);
    } catch (error) {
      setScanResult({
        success: false,
        message: "Failed to record attendance",
        student: null,
        record: null,
      });
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Attendance Scanner</h1>
      <p className="mt-1 text-sm text-gray-600">
        Scan student QR codes to record attendance
      </p>

      <div className="mt-6 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              isArrival
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setIsArrival(true)}
          >
            Check In
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              !isArrival
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setIsArrival(false)}
          >
            Check Out
          </button>
        </div>
      </div>

      <div className="mt-6">
        <QRScanner onScan={handleScan} isArrival={isArrival} />
      </div>

      {scanResult && (
        <div className="mt-8">
          <div
            className={`rounded-md p-4 ${
              scanResult.success
                ? isArrival
                  ? "bg-green-50"
                  : "bg-blue-50"
                : "bg-red-50"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {scanResult.success ? (
                  isArrival ? (
                    <span className="text-green-400">✔</span>
                  ) : (
                    <span className="text-blue-400">✔</span>
                  )
                ) : (
                  <span className="text-red-400">✖</span>
                )}
              </div>

              <div className="ml-3">
                <h3
                  className={`text-sm font-medium ${
                    scanResult.success
                      ? isArrival
                        ? "text-green-800"
                        : "text-blue-800"
                      : "text-red-800"
                  }`}
                >
                  {scanResult.success
                    ? isArrival
                      ? "Check-In Successful"
                      : "Check-Out Successful"
                    : scanResult.message}
                </h3>
                <div
                  className={`mt-2 text-sm ${
                    scanResult.success
                      ? isArrival
                        ? "text-green-700"
                        : "text-blue-700"
                      : "text-red-700"
                  }`}
                >
                  <p>Student: {scanResult.student?.name || "Unknown"}</p>
                  <p>
                    Time:{" "}
                    {isArrival
                      ? scanResult.record?.time_in || "N/A"
                      : scanResult.record?.time_out || "N/A"}
                  </p>
                  <p>Date: {scanResult.record?.date || "N/A"}</p>
                </div>
                <div className="mt-4">
                  <Button
                    size="sm"
                    onClick={() => setScanResult(null)}
                    variant="outline"
                  >
                    Scan Another
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceScanner;
