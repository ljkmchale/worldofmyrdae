import json
import pathlib
import re
import shutil
import datetime

root = pathlib.Path(__file__).resolve().parent
source = root / "js" / "locations-db.js"
backup_dir = root / "backups"
backup_dir.mkdir(parents=True, exist_ok=True)
text = source.read_text(encoding="utf-8")

match = re.search(r'"locations"\s*:\s*\[', text)
if not match:
    raise SystemExit('Could not find the locations array in js/locations-db.js')

start = match.end() - 1
bracket = 0
end = None
for i, ch in enumerate(text[start:], start):
    if ch == '[':
        bracket += 1
    elif ch == ']':
        bracket -= 1
        if bracket == 0:
            end = i + 1
            break

if end is None:
    raise SystemExit('Could not find the end of the locations array')

array_text = text[start:end]
locations = json.loads(array_text)
locations.sort(key=lambda item: (item.get('region') or '').lower())

backup_name = f"locations-db.backup.{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.js"
backup_path = backup_dir / backup_name
shutil.copy2(source, backup_path)

new_text = text[:start] + json.dumps(locations, indent=4) + text[end:]
source.write_text(new_text, encoding="utf-8")
print(f"Sorted {len(locations)} locations by region")
print(f"Backup saved to {backup_path}")
