const fs = require('fs');
const path = require('path');

const targetDirs = [
  'src/app/dashboard/content',
  'src/app/dashboard/pages',
  'src/app/dashboard/footer',
  'src/app/dashboard/settings'
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

let files = [];
targetDirs.forEach(d => {
  if (fs.existsSync(d)) {
    files = files.concat(walk(d));
  }
});

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add visibility: {} to initial states
  if (content.match(/useState(<any>)?\(\{(.*?)\}\)/s)) {
    content = content.replace(/useState(<any>)?\(\{(.*?)\}\)/g, (match, p1, p2) => {
      if (p2.includes('visibility:') || p2.includes('activeTab') || p2.includes('message:')) return match;
      return `useState${p1 || ''}({${p2}, visibility: {}})`;
    });
    changed = true;
  }

  // Remove local Field component
  if (content.includes('const Field = ')) {
    content = content.replace(/const Field = \(\{ label, children, hint \}: \{ label: string; children: React\.ReactNode; hint\?: string \}\) => \(\s*<div className="space-y-1\.5">\s*<label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">\{label\}<\/label>\s*\{children\}\s*\{hint && <p className="text-\[11px\] text-gray-600">\{hint\}<\/p>\}\s*<\/div>\s*\);\s*/m, '');
    changed = true;
  }

  // Import VisibilityField
  if (content.includes('<Field') && !content.includes('VisibilityField')) {
    content = content.replace(/import \{.*?\} from "lucide-react";\n/m, match => match + `import { VisibilityField } from "@/features/dashboard/components/VisibilityField";\n`);
    changed = true;
  }

  const fieldRegex = /<Field\s+label="([^"]+)"(?:\s+hint="([^"]+)")?>([\s\S]*?)<\/Field>/g;
  
  content = content.replace(fieldRegex, (match, label, hint, inner) => {
    // Find form.fieldName
    let valueMatch = inner.match(/form\.([a-zA-Z0-9_]+)/);
    // Specifically handle item.fieldName in maps
    if (!valueMatch) {
       valueMatch = inner.match(/item\.([a-zA-Z0-9_]+)/);
    }
    
    let key = valueMatch ? valueMatch[1] : null;
    
    if (!key) {
        return match; 
    }

    let out = `<VisibilityField\n  label="${label}"\n`;
    if (hint) {
      out += `  hint="${hint}"\n`;
    }
    out += `  visible={form.visibility?.${key} ?? true}\n`;
    out += `  onToggle={(v) => setForm({ ...form, visibility: { ...form.visibility, ${key}: v } })}\n`;
    out += `>\n${inner}</VisibilityField>`;
    
    changed = true;
    return out;
  });

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
