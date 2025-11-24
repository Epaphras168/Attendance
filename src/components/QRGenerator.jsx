import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import Button from "./ui/Button";

const QRGenerator = ({ studentId, qrCode, name, onRegenerate }) => {
  // Download the QR code as a PNG
  const downloadQR = () => {
    
    const canvas = document.getElementById(`qr-${studentId}`);
    console.log(canvas);
    if (!canvas) return;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${name.replace(/\s+/g, "-")}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm bg-white">
      <QRCodeCanvas
        id={`qr-${studentId}`}
        value={qrCode}
        size={180}
        level="H"
        includeMargin={true}
      />
      <div className="mt-3 text-center">
        <p className="text-lg font-medium text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">ID: {studentId}</p>
      </div>
      <div className="mt-4 flex space-x-2">
        <Button onClick={downloadQR} variant="secondary" size="sm">
          Download QR
        </Button>
        <Button onClick={() => onRegenerate(studentId)} variant="outline" size="sm">
          Regenerate
        </Button>
      </div>
    </div>
  );
};

export default QRGenerator;
