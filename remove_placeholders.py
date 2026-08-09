import re
filepath = r'c:\Users\Amana\Desktop\Demo4-main\frontend\src\app\dashboard\content\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()
# match `placeholder="..."` and remove it
text = re.sub(r'\s*placeholder="[^"]*"', '', text)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
print("Placeholders removed")
