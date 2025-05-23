import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api"; // Adjust the import path as needed

// CollectionMenu component fetches collection names and renders a dropdown menu
const CollectionMenu = ({ onSelectCollection }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/collections")
      .then((response) => {
        const data = response.data;
        if (data.collections) {
          setCollections(data.collections);
          toast.success("Collections fetched successfully!");
        } else {
          setError("No collections found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch collections!");
        setLoading(false);
        toast.error("Failed to fetch collections!");
      });
  }, []);

  if (loading) return <p>Loading collections...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="my-3">
      <label htmlFor="collection-select">Select a Collection: </label>
      <select
        id="collection-select"
        onChange={(e) => onSelectCollection(e.target.value)}
      >
        <option value="">--Select--</option>
        {collections.map((col, index) => (
          <option key={index} value={col}>
            {col.charAt(0).toUpperCase() + col.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

// TableData component fetches and displays data for the selected collection
const TableData = ({ collectionName }) => {
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to dynamically extract headers from data objects
  const extractHeaders = (data) => {
    const headersSet = new Set();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => headersSet.add(key));
      // Also extract header names from customFields if available
      if (item.customFields && Array.isArray(item.customFields)) {
        item.customFields.forEach((field) => {
          if (field.name) headersSet.add(field.name.toLowerCase());
        });
      }
    });
    return Array.from(headersSet);
  };

  useEffect(() => {
    if (!collectionName) return;
    setLoading(true);
    api
      .get(`/api/collection?name=${collectionName}`)
      .then((response) => {
        const data = response.data;
        if (data && data.data) {
          setTableData(data.data);
          const headers = extractHeaders(data.data);
          setTableHeaders(headers);
          toast.success("Table data fetched successfully!");
        } else {
          setError("No data available for this collection.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch table data!");
        setLoading(false);
        toast.error("Failed to fetch table data!");
      });
  }, [collectionName]);

  const formatHeader = (header) =>
    header.charAt(0).toUpperCase() + header.slice(1);

  if (loading) return <p>Loading table data...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3 className="text-center">
        {collectionName &&
          collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}{" "}
        Data
      </h3>
      {/* Wrap the table in a responsive container */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              {tableHeaders.map((header, index) => (
                <th key={index}>{formatHeader(header)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((item, index) => (
                <tr key={index}>
                  {tableHeaders.map((header, idx) => (
                    <td key={idx}>
                      {(() => {
                        let cellValue =
                          item[header] ||
                          (item.customFields &&
                            item.customFields.find(
                              (field) =>
                                field.name.toLowerCase() === header
                            )?.value) ||
                          "N/A";
                        // If the cellValue is an object, convert it to a string
                        if (
                          typeof cellValue === "object" &&
                          cellValue !== null
                        ) {
                          cellValue = JSON.stringify(cellValue);
                        }
                        return cellValue;
                      })()}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center">
                  No data found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Main component that combines CollectionMenu and TableData
const DynamicCollectionViewer = () => {
  const [selectedCollection, setSelectedCollection] = useState("");
  return (
    <div className="container">
      <CollectionMenu onSelectCollection={(col) => setSelectedCollection(col)} />
      {selectedCollection && <TableData collectionName={selectedCollection} />}
    </div>
  );
};

export default DynamicCollectionViewer;
