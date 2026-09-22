# Anlyze Data in K2_Archive

import pandas as pd
import numpy as np
from matplotlib import pyplot as plt


K2_Archive = pd.read_csv("K2_Archive.csv")

K2_Archive = K2_Archive.head(10)
K2_Archive
# Compare Stellar Mass to Planetary Mass

K2_Archive.sort_values(by="st_mass", inplace=True)

# Make K2_Archive_df a DataFrame

K2_Archive_df = pd.DataFrame(K2_Archive)


# Plot Stellar Mass vs Planetary Mass

stellar_mass = K2_Archive_df["st_mass"]
planetary_mass = K2_Archive_df["pl_bmassj"]

plt.scatter(stellar_mass, planetary_mass, color="blue")


# Trend line through graph

data = K2_Archive_df[["st_mass", "pl_bmassj"]].copy()

data["st_mass"] = pd.to_numeric(data["st_mass"], errors="coerce")
data["pl_bmassj"] = pd.to_numeric(data["pl_bmassj"], errors="coerce")

data = data.replace([np.inf, -np.inf], np.nan).dropna()

stellar_mass = data["st_mass"].to_numpy()
planetary_mass = data["pl_bmassj"].to_numpy()

plt.scatter(stellar_mass, planetary_mass, color="blue")

line = np.polyfit(stellar_mass, planetary_mass, 1)
trend = np.poly1d(line)

plt.plot(stellar_mass, trend(stellar_mass), color="red")
plt.show()
K2_Archive_df.to_csv("K2_Archive_Processed.csv", index=False)