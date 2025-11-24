import React, { useState } from "react";
import { useData } from "../contexts/DataContext";
import QRScanner from "../components/QRScanner";
import Button from "../components/ui/Button";
const AttendanceScanner = () => {
  const [isArrival, setIsArrival] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const {
    recordAttendance,
    students
  } = useData();
  const handleScan = async (qrCode) => {
    const result = await recordAttendance(qrCode, isArrival);
    setScanResult(result);
  };
  return <div>
      <h1 className="text-2xl font-semibold text-gray-900">Attendance Scanner</h1>
      <p className="mt-1 text-sm text-gray-600">
        Scan student QR codes to record attendance
      </p>
      <div className="mt-6 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" className={`px-4 py-2 text-sm font-medium rounded-l-lg ${isArrival ? "bg-green-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`} onClick={() => setIsArrival(true)}>
            Check In
          </button>
          <button type="button" className={`px-4 py-2 text-sm font-medium rounded-r-lg ${!isArrival ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`} onClick={() => setIsArrival(false)}>
            Check Out
          </button>
        </div>
      </div>
      <div className="mt-6">
        <QRScanner onScan={handleScan} isArrival={isArrival} />
      </div>
      {scanResult && <div className="mt-8">
        <div className={`rounded-md p-4 ${scanResult.success ? (isArrival ? "bg-green-50" : "bg-blue-50") : "bg-red-50"}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {scanResult.success ? (
                  isArrival ? (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )
                ) : (
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4a1 1 0 012 0v2a1 1 0 11-2 0v-2zm0-6a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

            <div className="ml-3">
                <h3 className={`text-sm font-medium ${scanResult.success ? (isArrival ? "text-green-800" : "text-blue-800") : "text-red-800"}`}>
                  {scanResult.success
                    ? (isArrival ? "Check-In Successful" : "Check-Out Successful")
                    : scanResult.message}
                </h3>
                <div className={`mt-2 text-sm ${scanResult.success ? (isArrival ? "text-green-700" : "text-blue-700") : "text-red-700"}`}>
                  <p>Student: {scanResult.student.name}</p>
                  <p>
                    Time: {isArrival ? scanResult.record.time_in : scanResult.record.time_out}
                  </p>
                  <p>Date: {scanResult.record.date}</p>
                </div>
                <div className="mt-4">
                  <Button size="sm" onClick={() => setScanResult(null)} variant="outline">
                    Scan Another
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>}
    </div>;
};
export default AttendanceScanner;
