import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Settings
NUM_DRIVERS = 50
START_DATE = datetime(2025, 1, 1)
DAYS = 90  # 3 months of data

data = []

print("Generating synthetic driver data...")

for driver_id in range(1, NUM_DRIVERS + 1):
    # Assign each driver a "skill level" (0.1 is bad, 0.9 is good)
    # This helps consistency: a bad driver is usually bad all the time.
    skill_level = random.uniform(0.1, 0.9)
    
    current_date = START_DATE
    for day in range(DAYS):
        date_str = current_date.strftime('%Y-%m-%d')
        
        # 1. Delays (Minutes)
        # Bad drivers have more delays. Random variance added.
        base_delay = int((1 - skill_level) * 30) 
        delays = max(0, int(np.random.normal(base_delay, 10)))
        
        # 2. Accidents & Violations
        # Rare events. Bad drivers have higher chance.
        accident_prob = 0.05 if skill_level < 0.3 else 0.001
        accidents = 1 if random.random() < accident_prob else 0
        
        violation_prob = 0.2 if skill_level < 0.4 else 0.02
        violations = np.random.poisson(violation_prob)
        
        behavioral_issues = 1 if random.random() < (violation_prob / 2) else 0

        # 3. Rating (1.0 to 5.0)
        # Base rating depends on skill.
        # Penalties: -2.0 for accident, -0.1 per minute of delay over 30 mins
        rating = 3.0 + (skill_level * 2.0) 
        if accidents > 0:
            rating -= 2.0
        if delays > 30:
            rating -= (delays - 30) * 0.05
        
        # Clamp rating between 1 and 5
        rating = max(1.0, min(5.0, rating))
        rating = round(rating, 2)

        data.append([
            driver_id, 
            date_str, 
            delays, 
            behavioral_issues, 
            violations, 
            accidents, 
            rating
        ])
        
        current_date += timedelta(days=1)

# Create DataFrame
columns = ['driver_id', 'date', 'delays_minutes', 'behavioral_problems', 'violations_count', 'accidents_count', 'rating']
df = pd.DataFrame(data, columns=columns)

# Save to CSV
df.to_csv('driver_profiles.csv', index=False)
print(f"Successfully created 'driver_profiles.csv' with {len(df)} rows!")