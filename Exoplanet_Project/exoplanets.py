# Goal: Parse NASA Exoplanet Archive CSV file and make visualization using pandas and matplotlib

import os
import pandas as pd
import matplotlib.pyplot as plt

csv_path = os.path.join(os.path.dirname(__file__), "exoplanets..csv")
df = pd.read_csv(csv_path)

# Display the first few rows of the dataframe
print(df.head())

# Create a simple plot
plt.scatter(df['semi_major_axis'], df['orbital_period'])
plt.xlabel('Semi-Major Axis')
plt.ylabel('Orbital Period')
plt.title('Exoplanet Properties')
plt.show()