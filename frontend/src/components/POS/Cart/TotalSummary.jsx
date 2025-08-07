import React from "react";

function TotalSummary({ total }) {
    return (
      <h5 className="text-end mt-3">
        Total: <span className="text-success">${total.toFixed(2)}</span>
      </h5>
    );
}

export default TotalSummary;
