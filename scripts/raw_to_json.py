import json

FILEIN = "data/raw.txt"
FILEOUT = 'data/out.json'

# Step 1: Read the content of file
with open(FILEIN, 'r') as file:
    lines = file.readlines()

# Step 2: Parse the content into a structured format
parsed_data = []
for i in range(0, len(lines), 2):
    if i + 1 < len(lines):
        parsed_data.append({
            "1": lines[i].strip(),
            "3": lines[i + 1].strip()
        })

# Step 3: Create a JSON structure for base_game.json
base_game_data = {
    "game_data": parsed_data
}

# Step 4: Save the JSON structure to base_game.json
with open(FILEOUT, 'w') as json_file:
    json.dump(base_game_data, json_file, indent=4)