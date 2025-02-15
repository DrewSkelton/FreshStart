import React, { useState } from "react";
import FarmArea from "../components/FarmArea";

const LayoutPage = () => {
  const [farmDimensions, setFarmDimensions] = useState({ width: 800, height: 600 });
  const [cropAreas, setCropAreas] = useState([]);

  return (
    <div>
      <h2>Farm Layout Planner</h2>
      <label>Farm Width (m):</label>
      <input type="number" value={farmDimensions.width} onChange={(e) => setFarmDimensions({ ...farmDimensions, width: Number(e.target.value) })} />

      <label>Farm Height (m):</label>

      <input type="number" value={farmDimensions.height} onChange={(e) => setFarmDimensions({ ...farmDimensions, height: Number(e.target.value) })} />

      <FarmArea farmDimensions={farmDimensions} cropAreas={cropAreas} setCropAreas={setCropAreas} />

    </div>
  );
};

export default LayoutPage;
