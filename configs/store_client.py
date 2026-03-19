import json
import os
import fcntl

# Centralized location for the shared store
STORE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data_store.json")

def init_store():
    """Ensure the file exists with basic structure."""
    if not os.path.exists(STORE_PATH):
        with open(STORE_PATH, "w") as f:
            json.dump({
                "anomalies": [],
                "incidents": [],
                "explanations": [],
                "alerts": []
            }, f, indent=2)

def update_store(key, item):
    """
    Safely update a specific section (key) in the shared data store using file locks.
    Prepends the item to the list and limits the list to 100 items.
    """
    init_store()
    try:
        with open(STORE_PATH, "r+") as f:
            fcntl.flock(f, fcntl.LOCK_EX)
            try:
                data = json.load(f)
                if key not in data:
                    data[key] = []
                
                # Support updates for items with incident_id
                item_id = item.get("incident_id")
                updated = False
                if item_id:
                    for idx, existing in enumerate(data[key]):
                        if isinstance(existing, dict) and existing.get("incident_id") == item_id:
                            data[key][idx] = item
                            updated = True
                            break
                
                if not updated:
                    data[key].insert(0, item)
                    data[key] = data[key][:100]  # keep list bounded
                
                f.seek(0)
                f.truncate()
                json.dump(data, f, indent=2, default=str)
            finally:
                fcntl.flock(f, fcntl.LOCK_UN)
    except Exception as e:
        print(f"Failed to update data_store.json: {e}")

def get_store():
    """Safely read the shared data store."""
    init_store()
    try:
        with open(STORE_PATH, "r") as f:
            fcntl.flock(f, fcntl.LOCK_SH)
            try:
                return json.load(f)
            finally:
                fcntl.flock(f, fcntl.LOCK_UN)
    except Exception as e:
        print(f"Failed to read data_store.json: {e}")
        return {"anomalies": [], "incidents": [], "explanations": [], "alerts": []}
