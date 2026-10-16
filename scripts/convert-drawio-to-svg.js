const fs = require('fs');
const path = require('path');

function drawioToSvg(drawioPath) {
  const content = fs.readFileSync(drawioPath, 'utf8');
  
  // Extract cells
  const cellRegex = /<mxCell\s+([^>]+)>(?:[\s\r\n]*<mxGeometry\s+([^>]+)(?:\/?>|>[\s\S]*?<\/mxGeometry>))?/g;
  
  const cells = [];
  let match;
  while ((match = cellRegex.exec(content)) !== null) {
    const cellAttrs = parseAttrs(match[1]);
    if (match[2]) {
      cellAttrs.geo = parseAttrs(match[2]);
    }
    cells.push(cellAttrs);
  }

  // Find min/max bounds
  let minX = 9999, minY = 9999, maxX = 0, maxY = 0;
  cells.forEach(c => {
    if (c.geo && c.geo.x !== undefined && c.geo.y !== undefined) {
      const x = parseFloat(c.geo.x);
      const y = parseFloat(c.geo.y);
      const w = parseFloat(c.geo.width || 0);
      const h = parseFloat(c.geo.height || 0);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    }
  });

  const pad = 40;
  const viewBoxX = Math.max(0, minX - pad);
  const viewBoxY = Math.max(0, minY - pad);
  const viewBoxW = (maxX - minX) + pad * 2;
  const viewBoxH = (maxY - minY) + pad * 2;

  let boundaryElements = [];
  let actorElements = [];
  let useCaseElements = [];
  let edgeElements = [];
  
  // 1. Render System Boundary
  cells.filter(c => c.style && c.style.includes('shape=rect')).forEach(c => {
    const g = c.geo;
    if (!g) return;
    const x = parseFloat(g.x), y = parseFloat(g.y), w = parseFloat(g.width), h = parseFloat(g.height);
    const title = (c.value || '').replace(/&amp;/g, '&');
    boundaryElements.push(
      '<g id="' + c.id + '">' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" ry="8" fill="#F8FAFC" stroke="#64748B" stroke-width="2" stroke-dasharray="6,4" />' +
        '<text x="' + (x + w/2) + '" y="' + (y + 30) + '" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif" font-size="15" font-weight="bold" fill="#1E293B">' + escapeXml(title) + '</text>' +
      '</g>'
    );
  });

  // 2. Render Actors
  cells.filter(c => c.style && c.style.includes('shape=umlActor')).forEach(c => {
    const g = c.geo;
    if (!g) return;
    const x = parseFloat(g.x), y = parseFloat(g.y), w = parseFloat(g.width), h = parseFloat(g.height);
    const name = c.value || '';
    actorElements.push(
      '<g id="' + c.id + '" transform="translate(' + x + ', ' + y + ')">' +
        '<circle cx="' + (w/2) + '" cy="16" r="14" fill="#E0F2FE" stroke="#0284C7" stroke-width="2" />' +
        '<line x1="' + (w/2) + '" y1="30" x2="' + (w/2) + '" y2="60" stroke="#0284C7" stroke-width="2.5" />' +
        '<line x1="4" y1="42" x2="' + (w-4) + '" y2="42" stroke="#0284C7" stroke-width="2" />' +
        '<line x1="' + (w/2) + '" y1="60" x2="6" y2="88" stroke="#0284C7" stroke-width="2" />' +
        '<line x1="' + (w/2) + '" y1="60" x2="' + (w-6) + '" y2="88" stroke="#0284C7" stroke-width="2" />' +
        '<text x="' + (w/2) + '" y="108" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0F172A">' + escapeXml(name) + '</text>' +
      '</g>'
    );
  });

  // 3. Render Use Cases (Ellipses)
  const cellMap = {};
  cells.forEach(c => { if (c.id) cellMap[c.id] = c; });

  cells.filter(c => c.style && c.style.includes('ellipse')).forEach(c => {
    const g = c.geo;
    if (!g) return;
    const x = parseFloat(g.x), y = parseFloat(g.y), w = parseFloat(g.width), h = parseFloat(g.height);
    const cx = x + w / 2;
    const cy = y + h / 2;
    
    let fill = '#FFFFFF', stroke = '#64748B';
    if (c.style.includes('fillColor=#d5e8d4')) { fill = '#DCFCE7'; stroke = '#16A34A'; }
    else if (c.style.includes('fillColor=#fff2cc')) { fill = '#FEF9C3'; stroke = '#CA8A04'; }
    else if (c.style.includes('fillColor=#f8cecc')) { fill = '#FEE2E2'; stroke = '#DC2626'; }
    else if (c.style.includes('fillColor=#e1d5e7')) { fill = '#F3E8FF'; stroke = '#9333EA'; }

    const rawText = (c.value || '').replace(/&#xa;/g, '\n').replace(/&amp;/g, '&');
    const lines = rawText.split('\n');
    const lineHeight = 15;
    const startY = cy - ((lines.length - 1) * lineHeight) / 2 + 4;

    const textNodes = lines.map((line, idx) => {
      const isBold = idx === 0 && (c.style.includes('fontStyle=1') || lines.length > 1);
      return '<tspan x="' + cx + '" y="' + (startY + idx * lineHeight) + '" font-weight="' + (isBold ? 'bold' : 'normal') + '">' + escapeXml(line.trim()) + '</tspan>';
    }).join('');

    useCaseElements.push(
      '<g id="' + c.id + '">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (w/2) + '" ry="' + (h/2) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.8" />' +
        '<text text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif" font-size="11.5" fill="#1E293B">' +
          textNodes +
        '</text>' +
      '</g>'
    );
  });

  // 4. Render Edges ON TOP with precise perimeter clipping so arrows touch the ellipse edge!
  cells.filter(c => c.edge === '1').forEach(c => {
    const source = cellMap[c.source];
    const target = cellMap[c.target];
    if (source && target && source.geo && target.geo) {
      const scx = parseFloat(source.geo.x) + parseFloat(source.geo.width || 0) / 2;
      const scy = parseFloat(source.geo.y) + parseFloat(source.geo.height || 0) / 2;
      const tcx = parseFloat(target.geo.x) + parseFloat(target.geo.width || 0) / 2;
      const tcy = parseFloat(target.geo.y) + parseFloat(target.geo.height || 0) / 2;

      // Calculate intersection on target boundary so arrow sits on the perimeter
      const trw = parseFloat(target.geo.width || 0) / 2;
      const trh = parseFloat(target.geo.height || 0) / 2;

      let pTarget = getIntersection(tcx, tcy, trw, trh, scx, scy, target.style && target.style.includes('ellipse'));
      let pSource = getIntersection(scx, scy, parseFloat(source.geo.width || 0) / 2, parseFloat(source.geo.height || 0) / 2, tcx, tcy, source.style && source.style.includes('ellipse'));

      const sx = pSource.x;
      const sy = pSource.y;
      const tx = pTarget.x;
      const ty = pTarget.y;

      const isDashed = c.style && c.style.includes('dashed=1');
      const stroke = isDashed ? '#334155' : '#334155';
      const dashAttr = isDashed ? 'stroke-dasharray="6,4"' : '';
      const marker = isDashed ? 'url(#arrow)' : '';
      
      const midX = (sx + tx) / 2;
      const midY = (sy + ty) / 2;
      const label = c.value || '';

      let labelHtml = '';
      if (label) {
        labelHtml = '<rect x="' + (midX - 42) + '" y="' + (midY - 12) + '" width="84" height="24" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1" rx="4" />' +
                    '<text x="' + midX + '" y="' + (midY + 4) + '" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif" font-size="11.5" font-weight="bold" fill="#0F172A">' + escapeXml(label) + '</text>';
      }

      edgeElements.push(
        '<g id="' + c.id + '">' +
          '<line x1="' + sx + '" y1="' + sy + '" x2="' + tx + '" y2="' + ty + '" stroke="' + stroke + '" stroke-width="1.8" ' + dashAttr + ' marker-end="' + marker + '" />' +
          labelHtml +
        '</g>'
      );
    }
  });

  const fullSvg = '<?xml version="1.0" encoding="UTF-8"?>\n' +
'<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBoxX + ' ' + viewBoxY + ' ' + viewBoxW + ' ' + viewBoxH + '" width="' + viewBoxW + '" height="' + viewBoxH + '" style="background-color: #ffffff;">\n' +
'  <defs>\n' +
'    <marker id="arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">\n' +
'      <path d="M 1 2 L 11 6 L 1 10 z" fill="#1E293B" stroke="none" />\n' +
'    </marker>\n' +
'  </defs>\n' +
  boundaryElements.join('\n') + '\n' +
  actorElements.join('\n') + '\n' +
  useCaseElements.join('\n') + '\n' +
  edgeElements.join('\n') + '\n' +
'</svg>';

  return fullSvg;
}

function getIntersection(cx, cy, rx, ry, ox, oy, isEllipse) {
  const dx = ox - cx;
  const dy = oy - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };

  if (isEllipse && rx > 0 && ry > 0) {
    const angle = Math.atan2(dy * rx, dx * ry);
    return {
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle)
    };
  } else {
    // bounding box
    const dist = Math.sqrt(dx * dx + dy * dy);
    return {
      x: cx + (dx / dist) * rx,
      y: cy + (dy / dist) * ry
    };
  }
}

function parseAttrs(str) {
  const attrs = {};
  const re = /([a-zA-Z_0-9]+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function escapeXml(unsafe) {
  return (unsafe || '').replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Convert all 3 files
const dir = "D:\\Projects\\homework-management-system\\docs\\diagrams\\use-case";
const files = [
  'uc-manage-class-and-group',
  'uc-submit-homework',
  'uc-view-homework-calendar'
];

files.forEach(f => {
  const dPath = path.join(dir, f + '.drawio');
  const sPath = path.join(dir, f + '.svg');
  const svg = drawioToSvg(dPath);
  fs.writeFileSync(sPath, svg, 'utf8');
  console.log('Created: ' + sPath);
});
