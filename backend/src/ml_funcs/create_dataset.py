import random
import pandas as pd

"""
Crop Area (in m²):
Since the total farm area is 864 x 576 = 498,624 m², crop areas should be selected within this range (reasonable range: 1 to 5000 m²).

Soil pH:
Typical pH range for agricultural soils is between 5.5 to 7.5.

Soil NPK (Nitrogen, Phosphorus, Potassium):
NPK values are typically measured in grams per kg of soil. A reasonable range could be:
Nitrogen: 10 to 50 g/kg
Phosphorus: 5 to 30 g/kg
Potassium: 10 to 50 g/kg

Soil Organic Matter (OM): 
Soil organic matter content is generally between 1% and 10%.

Irrigation Method:
Drip, Flood, Sprinkler (select randomly from these 3).

Fertilizer Type:
Nitrogen, Phosphorus, Potassium (select randomly from these 3).

Fertilizer Method:
Broadcasting, Fertigation, Side Dressing (select randomly from these 3).

Density (plants/m²):
A typical range for density is between 10 and 100 plants per square meter, depending on the crop type.
"""

# Define ranges
crop_types = ["Corn", "Wheat", "Tomatoes", "Potatoes", "Soybeans"]
irrigation_methods = ["Drip", "Flood", "Sprinkler"]
fertilizer_types = ["Nitrogen", "Phosphorus", "Potassium"]
fertilizer_methods = ["Broadcasting", "Fertigation", "Side Dressing"]

# Crop yield base factors (kg/m²)
base_yield_factors = {
    "Corn": 1.2,
    "Wheat": 1.0,
    "Tomatoes": 1.5,
    "Potatoes": 1.3,
    "Soybeans": 1.1
}

# Irrigation and Fertilizer multipliers
irrigation_factors = {
    "Drip": 1.3,
    "Flood": 1.0,
    "Sprinkler": 1.1
}

fertilizer_factors = {
    "Broadcasting": 1.2,
    "Fertigation": 1.4,
    "Side Dressing": 1.3
}

# Function to generate a random crop yield dataset
def generate_crop_yield_data(num_rows):
    data = []
    for _ in range(num_rows):
        crop_type = random.choice(crop_types)
        crop_area = random.uniform(1, 100000)  # Random crop area in m²
        soil_ph = random.uniform(5.5, 7.5)  # Random soil pH
        soil_npk = random.uniform(10, 50)  # Nitrogen (g/kg)
        soil_organic_matter = random.uniform(1, 10)  # Organic matter percentage
        irrigation_method = random.choice(irrigation_methods)
        fertilizer_type = random.choice(fertilizer_types)
        fertilizer_method = random.choice(fertilizer_methods)
        density = random.uniform(10, 100)  # Plants per m²
        
        # Calculate yield using the formula
        base_yield = base_yield_factors[crop_type]
        soil_ph_factor = max(0.5, 1 - abs(soil_ph - 6.5) / 10)  # Soil pH factor
        soil_npk_factor = min(2.0, soil_npk / 30)  # NPK factor
        organic_matter_factor = 1 + (soil_organic_matter / 100)  # Organic matter factor
        irrigation_factor = irrigation_factors[irrigation_method]
        fertilizer_factor = fertilizer_factors[fertilizer_method]
        density_factor = 1 + (density / 1000)  # Density factor

        yield_kg_m2 = (base_yield * soil_ph_factor * soil_npk_factor * organic_matter_factor
                       * irrigation_factor * fertilizer_factor * density_factor)

        # Add row to the data list
        data.append({
            "crop_type": crop_type,
            "crop_area": crop_area,
            "soil_ph": soil_ph,
            "soil_npk": soil_npk,
            "soil_organic_matter": soil_organic_matter,
            "irrigation_method": irrigation_method,
            "fertilizer_type": fertilizer_type,
            "fertilizer_method": fertilizer_method,
            "density": density,
            "predicted_yield_kg_m2": yield_kg_m2
        })
    
    return data

# generate dataset
num_rows = 500
data = generate_crop_yield_data(num_rows)

# create DataFrame
df = pd.DataFrame(data)

# Export to CSV
df.to_csv("crop_yield_data.csv", index=False)

print("Dataset generated and exported to 'crop_yield_data.csv'.")
