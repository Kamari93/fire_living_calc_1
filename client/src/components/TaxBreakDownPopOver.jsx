// ...existing code...
import React from "react";
import InfoPopover from "./InfoPopover";

function fmt(v) {
  if (v === undefined || v === null || v === "") return "---";
  const n = Number(String(v).replace(/,/g, ""));
  if (Number.isNaN(n)) return v;
  return `$${n.toLocaleString("en-US")}`;
}

export default function TaxBreakdownInfo({ taxes }) {
  if (!taxes) return null;
  const hasAny =
    (taxes.federal != null && taxes.federal !== "") ||
    (taxes.state != null && taxes.state !== "") ||
    (taxes.local != null && taxes.local !== "");
  if (!hasAny) return null;

  return (
    <InfoPopover label="Tax breakdown">
      <div className="mb-1 font-medium">Tax breakdown:</div>
      <div>Federal: {fmt(taxes.federal)}</div>
      <div>State: {fmt(taxes.state)}</div>
      <div>Local/FICA: {fmt(taxes.local)}</div>
    </InfoPopover>
  );
}
// ...existing code...
