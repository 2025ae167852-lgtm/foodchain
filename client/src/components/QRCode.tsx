import React from "react";
import QRCode from "qrcode.react";

export default function QR({ value }: { value: string }) {
  return <QRCode value={value} size={128} />;
}
